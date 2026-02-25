import { useGameStore } from '../game/gameState';
import { SHAPES } from '../game/shapes';

export function TutorialGuide({ level }) {
  const { activeSide, tutorialStep } = useGameStore();

  // Only show for tutorial levels
  if (level.difficulty !== 'tutorial') return null;
  if (level.mode === 'single') {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-3 mb-2 sm:mb-4 shadow-lg border-2 border-sunshine">
        <div className="text-center">
          <div className="text-xl sm:text-2xl mb-1 sm:mb-2">👆</div>
          <div className="text-sm sm:text-base md:text-lg font-bold text-chocolate mb-0.5 sm:mb-1">
            Draw with either hand
          </div>
          <div className="text-xs sm:text-sm text-chocolate opacity-70">
            Draw a <span className="font-bold">{SHAPES[level.shape].name}</span>
          </div>
        </div>
      </div>
    );
  }

  if (level.mode === 'sequential') {
    const currentShape = tutorialStep === 0 ? level.left : level.right;
    const currentSide = tutorialStep === 0 ? 'left' : 'right';
    const isComplete = tutorialStep === 1;

    return (
      <div className={`rounded-xl sm:rounded-2xl p-2 sm:p-3 mb-2 sm:mb-4 shadow-lg border-2 ${currentSide === 'left' ? 'bg-sunshine border-chocolate' : 'bg-skyblue border-white'}`}>
        <div className="text-center">
          <div className="text-xl sm:text-2xl mb-1 sm:mb-2">
            {tutorialStep === 0 ? '👈 Left hand first!' : '👉 Now right hand!'}
          </div>
          <div className="text-sm sm:text-base md:text-lg font-bold text-chocolate mb-0.5 sm:mb-1">
            Draw a <span className="font-bold">{SHAPES[currentShape].name}</span>
          </div>
          {isComplete && (
            <div className="text-[10px] sm:text-xs md:text-sm text-chocolate opacity-70 mt-1 sm:mt-2">
              Then draw both at the same time!
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
