import { useState, useEffect, useCallback, useRef } from 'react';
import { useGameStore } from '../game/gameState';
import { LEVELS } from '../game/levels';
import { GameCanvas } from './GameCanvas';
import { Confetti } from './Confetti';
import { TutorialGuide } from './TutorialGuide';
import { ConfidenceMeter } from './ConfidenceMeter';
import { ShapeOverlay } from './ShapeOverlay';
import { MobileLayout } from './MobileLayout';
import { HandGuide } from './HandGuide';
import { generateFeedback } from '../utils/feedbackGenerator';

export function GameLoop() {
  const { currentLevel, completeLevel, failLevel, combo, score, gracePeriod, setGracePeriod, addTimeBonus, setSlowMotion, slowMotionActive, recognizedShapes, showFeedback, setShowFeedback, currentAttempt, setCurrentAttempt, setFeedbackMessage } = useGameStore();
  const level = LEVELS.find((l) => l.id === currentLevel);
  const [phase, setPhase] = useState('countdown'); // countdown, playing, result
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(level?.time || 10);
  const [showConfetti, setShowConfetti] = useState(false);
  const [leftRecognized, setLeftRecognized] = useState(false);
  const [rightRecognized, setRightRecognized] = useState(false);

  // Countdown phase with grace period activation
  useEffect(() => {
    if (phase === 'countdown') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setPhase('playing');
            // Activate grace period when countdown ends
            setGracePeriod(true);
            // Deactivate grace period after 2 seconds
            setTimeout(() => setGracePeriod(false), 2000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [phase, setGracePeriod]);

  // Playing phase timer with slow motion and grace period support
  useEffect(() => {
    if (phase === 'playing' && timeLeft > 0 && !gracePeriod) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          // Check if one shape is complete - activate slow motion
          const oneComplete = (recognizedShapes.left && !recognizedShapes.right) ||
                            (!recognizedShapes.left && recognizedShapes.right);
          if (oneComplete && !slowMotionActive) {
            setSlowMotion(true);
          }

          // Timer runs at 50% speed in slow motion (0.05s per 100ms instead of 0.1s)
          const decrement = slowMotionActive ? 0.05 : 0.1;

          if (prev <= 0.1) {
            clearInterval(timer);
            setPhase('result');
            failLevel();
            return 0;
          }
          return prev - decrement;
        });
      }, 100);
      return () => clearInterval(timer);
    }
  }, [phase, timeLeft, gracePeriod, slowMotionActive, recognizedShapes, setSlowMotion, failLevel]);

  // Add time bonus when shape is recognized
  const previousRecognized = useRef({ left: false, right: false });

  useEffect(() => {
    const leftBonus = recognizedShapes.left && !previousRecognized.current.left ? 5 : 0;
    const rightBonus = recognizedShapes.right && !previousRecognized.current.right ? 5 : 0;

    if (leftBonus || rightBonus) {
      const totalBonus = leftBonus + rightBonus;
      setTimeLeft((prev) => Math.min(prev + totalBonus, level?.time || 10)); // Cap at original time
      addTimeBonus(totalBonus);
    }

    previousRecognized.current = recognizedShapes;
  }, [recognizedShapes, level, addTimeBonus]);

  const handleRecognize = useCallback((isLeft) => {
    if (isLeft) {
      setLeftRecognized(true);
    } else {
      setRightRecognized(true);
    }

    if (leftRecognized || rightRecognized) {
      // Check if both are recognized
      if ((isLeft && rightRecognized) || (!isLeft && leftRecognized)) {
        setPhase('result');
        const timeBonus = timeLeft * 10;
        const comboMultiplier = combo >= 3 ? 2 : 1;
        const points = Math.floor((1000 + timeBonus) * comboMultiplier);
        completeLevel(points, combo >= 3);
        setShowConfetti(true);
      }
    }
  }, [leftRecognized, rightRecognized, timeLeft, combo, completeLevel]);

  const handleNextLevel = () => {
    setLeftRecognized(false);
    setRightRecognized(false);
    setShowConfetti(false);
    setSlowMotion(false);
    setGracePeriod(false);
    const nextLevel = currentLevel + 1;
    if (nextLevel <= LEVELS.length) {
      const level = LEVELS.find((l) => l.id === nextLevel);
      setTimeLeft(level?.time || 10);
      setCountdown(3);
      setPhase('countdown');
    }
  };

  const handleRetry = () => {
    setLeftRecognized(false);
    setRightRecognized(false);
    setTimeLeft(level?.time || 10);
    setCountdown(3);
    setPhase('countdown');
    setSlowMotion(false);
    setGracePeriod(false);
  };

  const handleContinue = () => {
    setShowConfetti(false);
    setLeftRecognized(false);
    setRightRecognized(false);
  };

  return (
    <MobileLayout level={level}>
      {/* Tutorial Guide */}
      <TutorialGuide level={level} />

      {/* Countdown */}
      {phase === 'countdown' && (
        <div className="text-center py-12">
          <div className="text-9xl font-extrabold text-chocolate animate-bounce">
            {countdown > 0 ? countdown : 'GO!'}
          </div>
        </div>
      )}

      {/* Game Canvas with Confidence Meters and Hand Guide */}
      {phase === 'playing' && (
        <div className="space-y-4">
          {/* Confidence Meters */}
          <div className="flex justify-between px-4">
            <ConfidenceMeter side="left" shape={level?.left} />
            <ConfidenceMeter side="right" shape={level?.right} />
          </div>

          {/* Game Canvas with Hand Guide overlay */}
          <div className="relative">
            <GameCanvas
              level={level}
              onRecognize={handleRecognize}
              timeLimit={level?.time || 10}
            />
            <HandGuide />
          </div>
        </div>
      )}

      {/* Result Screen */}
      {phase === 'result' && (
        <div className="text-center py-8">
          {showConfetti && <Confetti active={true} />}

          <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-chocolate">
            <h2 className="text-4xl font-extrabold text-chocolate mb-4">
              {showConfetti ? '🎉 Excellent!' : 'Time\'s Up!'}
            </h2>

            {showConfetti && (
              <div className="mb-6">
                <div className="text-6xl font-bold text-mint mb-2">
                  +{Math.floor((1000 + (timeLeft * 10)) * (combo >= 3 ? 2 : 1))}
                </div>
                <div className="text-sm text-chocolate opacity-70">
                  Base: 1000 | Time Bonus: {timeLeft * 10}
                  {combo >= 3 && ' | Combo: 2x'}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-sunshine rounded-xl p-4">
                <div className="text-sm text-chocolate opacity-70">Left Shape</div>
                <div className="text-2xl font-bold text-chocolate">
                  {leftRecognized ? '✓ ' + level?.left : '✗ Missed'}
                </div>
              </div>
              <div className="bg-skyblue rounded-xl p-4">
                <div className="text-sm text-white opacity-90">Right Shape</div>
                <div className="text-2xl font-bold text-white">
                  {rightRecognized ? '✓ ' + level?.right : '✗ Missed'}
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              {showConfetti ? (
                <button
                  onClick={handleNextLevel}
                  className="bg-mint text-chocolate px-8 py-4 rounded-full text-xl font-bold shadow-lg active:scale-95 transition-transform"
                >
                  Next Level →
                </button>
              ) : (
                <>
                  <button
                    onClick={handleRetry}
                    className="bg-sunshine text-chocolate px-6 py-4 rounded-full text-lg font-bold shadow-lg active:scale-95 transition-transform"
                  >
                    Retry
                  </button>
                  <button
                    onClick={handleContinue}
                    className="bg-mint text-chocolate px-6 py-4 rounded-full text-lg font-bold shadow-lg active:scale-95 transition-transform"
                  >
                    Continue
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Shape Overlay for Feedback */}
      <ShapeOverlay
        show={showFeedback}
        onClose={() => setShowFeedback(false)}
        attempt={currentAttempt}
      />
    </MobileLayout>
  );
}
