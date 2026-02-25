import { useGameStore } from '../game/gameState';
import { SHAPES } from '../game/shapes';

export function ShapeOverlay({ show, onClose, attempt }) {
  const { feedbackMessage } = useGameStore();

  if (!show || !attempt) return null;

  const { recognized, confidence, shape } = attempt;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
        <div className="text-center">
          {/* Recognition result */}
          <div className="text-6xl mb-4">
            {recognized ? '✓' : '✗'}
          </div>

          <h3 className={`text-2xl font-bold mb-2 ${recognized ? 'text-mint' : 'text-coral'}`}>
            {recognized ? `Good ${shape}!` : 'Not quite...'}
          </h3>

          {/* Confidence meter */}
          <div className="bg-cream rounded-xl p-4 mb-4">
            <div className="text-sm text-chocolate opacity-70 mb-1">Match Score</div>
            <div className="flex items-center justify-center gap-2">
              <div className="text-4xl font-bold text-chocolate">{confidence}%</div>
              <div className={`text-sm ${confidence >= 70 ? 'text-green-600' : confidence >= 40 ? 'text-yellow-600' : 'text-red-500'}`}>
                {confidence >= 70 ? 'Great!' : confidence >= 40 ? 'Getting there' : 'Keep trying'}
              </div>
            </div>
          </div>

          {/* Specific feedback */}
          {feedbackMessage && (
            <div className="bg-skyblue bg-opacity-20 rounded-xl p-4 mb-4">
              <div className="text-sm text-chocolate font-semibold">Tip:</div>
              <div className="text-sm text-chocolate">{feedbackMessage}</div>
            </div>
          )}

          {/* Action buttons */}
          <button
            onClick={onClose}
            className="w-full bg-mint text-chocolate py-3 rounded-full font-bold shadow-lg active:scale-95 transition-transform"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
