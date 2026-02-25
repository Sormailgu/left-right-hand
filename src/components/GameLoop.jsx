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
    if (phase === 'playing' && !gracePeriod) {
      // Check if tutorial level with no time limit
      if (level?.mode === 'single' || level?.time === 0) {
        return; // No timer for single-shape tutorial levels
      }

      if (timeLeft > 0) {
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

            // For tutorial levels, don't fail - just show "Keep practicing" message
            if (prev <= 0.1 && level?.difficulty === 'tutorial') {
              clearInterval(timer);
              setPhase('result');
              // Don't call failLevel for tutorials - no-fail mode
              return 0;
            }

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
    }
  }, [phase, timeLeft, gracePeriod, slowMotionActive, recognizedShapes, setSlowMotion, failLevel, level]);

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
        <div className="text-center py-4 sm:py-8 md:py-12">
          <div className="text-6xl sm:text-7xl md:text-9xl font-extrabold text-chocolate animate-bounce">
            {countdown > 0 ? countdown : 'GO!'}
          </div>
        </div>
      )}

      {/* Game Canvas with Confidence Meters and Hand Guide */}
      {phase === 'playing' && (
        <div className="flex flex-col h-full space-y-2 sm:space-y-3 md:space-y-4">
          {/* Confidence Meters - smaller on mobile */}
          <div className="flex justify-between px-2 sm:px-3 md:px-4">
            <ConfidenceMeter side="left" shape={level?.left} />
            <ConfidenceMeter side="right" shape={level?.right} />
          </div>

          {/* Game Canvas with Hand Guide overlay */}
          <div className="relative flex-1 min-h-0">
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
        <div className="text-center p-2 sm:p-4 md:p-8">
          {showConfetti && <Confetti active={true} />}

          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border-4 border-chocolate">
            {/* No-Fail Mode: Show encouraging message for tutorials */}
            {showConfetti ? (
              <>
                <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-4">🎉</div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-mint mb-2 sm:mb-4">
                  Excellent!
                </h2>
              </>
            ) : level?.difficulty === 'tutorial' ? (
              <>
                <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-4">💪</div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-sunshine mb-1 sm:mb-2">
                  Keep Practicing!
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-chocolate opacity-80 mb-2 sm:mb-4">
                  You're doing great - try again!
                </p>
              </>
            ) : (
              <>
                <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-4">😅</div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-coral mb-2 sm:mb-4">
                  Time's Up!
                </h2>
              </>
            )}

            {showConfetti && (
              <div className="mb-3 sm:mb-4 md:mb-6">
                <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-mint mb-1 sm:mb-2">
                  +{Math.floor((1000 + (timeLeft * 10)) * (combo >= 3 ? 2 : 1))}
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm text-chocolate opacity-70">
                  Base: 1000 | Time Bonus: {timeLeft * 10}
                  {combo >= 3 && ' | Combo: 2x'}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6">
              <div className="bg-sunshine rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4">
                <div className="text-[10px] sm:text-xs md:text-sm text-chocolate opacity-70">Left</div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-chocolate">
                  {leftRecognized ? '✓ ' + level?.left : '✗ Missed'}
                </div>
              </div>
              <div className="bg-skyblue rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4">
                <div className="text-[10px] sm:text-xs md:text-sm text-white opacity-90">Right</div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  {rightRecognized ? '✓ ' + level?.right : '✗ Missed'}
                </div>
              </div>
            </div>

            <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center">
              {showConfetti ? (
                <button
                  onClick={handleNextLevel}
                  className="bg-mint text-chocolate px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full text-base sm:text-lg md:text-xl font-bold shadow-lg active:scale-95 transition-transform"
                >
                  Next Level →
                </button>
              ) : (
                <>
                  <button
                    onClick={handleRetry}
                    className="bg-sunshine text-chocolate px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full text-sm sm:text-base md:text-lg font-bold shadow-lg active:scale-95 transition-transform"
                  >
                    Try Again
                  </button>
                  {level?.difficulty !== 'tutorial' && (
                    <button
                      onClick={handleContinue}
                      className="bg-mint text-chocolate px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full text-sm sm:text-base md:text-lg font-bold shadow-lg active:scale-95 transition-transform"
                    >
                      Continue
                    </button>
                  )}
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
