import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '../game/gameState';
import { LEVELS } from '../game/levels';
import { GameCanvas } from './GameCanvas';
import { Confetti } from './Confetti';

export function GameLoop() {
  const { currentLevel, completeLevel, failLevel, combo, score } = useGameStore();
  const level = LEVELS.find((l) => l.id === currentLevel);
  const [phase, setPhase] = useState('countdown'); // countdown, playing, result
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(level?.time || 10);
  const [showConfetti, setShowConfetti] = useState(false);
  const [leftRecognized, setLeftRecognized] = useState(false);
  const [rightRecognized, setRightRecognized] = useState(false);

  // Countdown phase
  useEffect(() => {
    if (phase === 'countdown') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setPhase('playing');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [phase]);

  // Playing phase timer
  useEffect(() => {
    if (phase === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setPhase('result');
            failLevel();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [phase, timeLeft, failLevel]);

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
  };

  const handleContinue = () => {
    setShowConfetti(false);
    setLeftRecognized(false);
    setRightRecognized(false);
  };

  const getShapeIcon = (shape) => {
    const icons = {
      circle: '●',
      square: '■',
      triangle: '▲',
      star: '★',
      heart: '♥',
      diamond: '◆',
    };
    return icons[shape] || '?';
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="text-center">
          <div className="text-sm text-chocolate opacity-70">Level</div>
          <div className="text-2xl font-bold text-chocolate">{currentLevel}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-chocolate opacity-70">Time</div>
          <div className={`text-2xl font-bold ${timeLeft <= 3 ? 'text-red-500' : 'text-chocolate'}`}>
            {phase === 'playing' ? timeLeft : level?.time || 10}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-chocolate opacity-70">Combo</div>
          <div className="text-2xl font-bold text-mint">{combo}x</div>
        </div>
      </div>

      {/* Target Shape Cards */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-sunshine rounded-2xl p-4 text-center shadow-lg">
          <div className="text-sm font-bold text-chocolate mb-2">LEFT HAND</div>
          <div className="text-6xl text-chocolate">{getShapeIcon(level?.left)}</div>
          <div className="text-xs text-chocolate opacity-70 capitalize mt-2">{level?.left}</div>
        </div>
        <div className="bg-skyblue rounded-2xl p-4 text-center shadow-lg">
          <div className="text-sm font-bold text-white mb-2">RIGHT HAND</div>
          <div className="text-6xl text-white">{getShapeIcon(level?.right)}</div>
          <div className="text-xs text-white opacity-90 capitalize mt-2">{level?.right}</div>
        </div>
      </div>

      {/* Countdown */}
      {phase === 'countdown' && (
        <div className="text-center py-12">
          <div className="text-9xl font-extrabold text-chocolate animate-bounce">
            {countdown > 0 ? countdown : 'GO!'}
          </div>
        </div>
      )}

      {/* Game Canvas */}
      {phase === 'playing' && (
        <GameCanvas
          level={level}
          onRecognize={handleRecognize}
          timeLimit={level?.time || 10}
        />
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
    </div>
  );
}
