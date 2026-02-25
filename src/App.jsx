import { useGameStore } from './game/gameState';
import { LEVELS } from './game/levels';
import { GameLoop } from './components/GameLoop';

function App() {
  const { currentLevel, isPlaying, unlockedLevels, startLevel } = useGameStore();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {!isPlaying ? (
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-chocolate mb-4">
              Two Hands
              <span className="block text-2xl text-skyblue">One Challenge</span>
            </h1>

            <p className="text-lg text-chocolate mb-2">
              Draw shapes with both hands at the same time!
            </p>

            {/* New: How to play section */}
            <div className="bg-white rounded-2xl p-4 mb-6 shadow-lg">
              <h3 className="text-sm font-bold text-chocolate mb-2">How to Play:</h3>
              <div className="text-xs text-chocolate opacity-80 text-left space-y-1">
                <div>👆 Use two fingers (one from each hand)</div>
                <div>✏️ Draw the shown shapes on each side</div>
                <div>⏱️ Complete before time runs out!</div>
              </div>
            </div>

            <button
              onClick={() => startLevel(currentLevel)}
              className="w-full bg-sunshine text-chocolate px-8 py-4 min-h-[56px] rounded-full text-xl font-bold shadow-lg active:scale-95 transition-transform mb-6"
            >
              Play Level {currentLevel}
            </button>

            <div className="pt-4">
              <h3 className="text-lg font-bold text-chocolate mb-4">Select Level</h3>
              <div className="grid grid-cols-5 gap-2">
                {LEVELS.map((level) => {
                  const isUnlocked = level.id <= unlockedLevels;
                  return (
                    <button
                      key={level.id}
                      disabled={!isUnlocked}
                      onClick={() => startLevel(level.id)}
                      className={`aspect-square rounded-xl font-bold text-lg min-w-[60px] min-h-[60px] ${
                        isUnlocked
                          ? 'bg-mint text-chocolate hover:scale-105 active:scale-95 transition-transform'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {level.id}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty indicator */}
            {currentLevel <= 5 && (
              <div className="mt-6 text-sm text-chocolate opacity-70">
                📚 Tutorial Mode - Learn the basics!
              </div>
            )}
          </div>
        ) : (
          <GameLoop />
        )}
      </div>
    </div>
  );
}

export default App;
