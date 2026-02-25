import { useGameStore } from '../game/gameState';

export function ConfidenceMeter({ side, shape }) {
  const { confidence } = useGameStore();
  const currentConfidence = confidence[side] || 0;

  // Color based on confidence level
  const getColor = () => {
    if (currentConfidence >= 70) return 'bg-green-500';
    if (currentConfidence >= 40) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  const getTextColor = () => {
    if (currentConfidence >= 70) return 'text-green-600';
    if (currentConfidence >= 40) return 'text-yellow-600';
    return 'text-red-500';
  };

  if (currentConfidence === 0) return null;

  return (
    <div className="flex items-center gap-2">
      {/* Circular progress indicator */}
      <div className="relative w-12 h-12">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeDasharray={`${currentConfidence * 1.26} 126`}
            className={getTextColor()}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold">{currentConfidence}</span>
        </div>
      </div>
      <span className={`text-sm font-bold ${getTextColor()}`}>
        {currentConfidence >= 70 ? '✓' : currentConfidence >= 40 ? '~' : '...'}
      </span>
    </div>
  );
}
