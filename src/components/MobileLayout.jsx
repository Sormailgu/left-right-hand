export function MobileLayout({ children, level }) {
  return (
    <div className="w-full flex flex-col h-full">
      {/* Header - more compact on mobile */}
      <div className="flex justify-between items-center mb-2 px-1 sm:mb-3 sm:px-2">
        <div className="text-center flex-1">
          <div className="text-[10px] sm:text-xs text-chocolate opacity-70">Level</div>
          <div className="text-lg sm:text-xl font-bold text-chocolate">{level.id}</div>
        </div>
        <div className="text-center flex-1">
          <div className="text-[10px] sm:text-xs text-chocolate opacity-70">Time</div>
          <div className="text-lg sm:text-xl font-bold text-chocolate" id="timer-display">--</div>
        </div>
        <div className="text-center flex-1">
          <div className="text-[10px] sm:text-xs text-chocolate opacity-70">Combo</div>
          <div className="text-lg sm:text-xl font-bold text-mint" id="combo-display">0x</div>
        </div>
      </div>

      {/* Desktop: side-by-side cards, Mobile: stacked and compact */}
      <div className="grid grid-cols-2 gap-2 mb-2 sm:mb-3 sm:gap-3">
        {/* Left shape card */}
        <div className="bg-sunshine rounded-xl sm:rounded-2xl p-2 sm:p-3 text-center shadow-lg">
          <div className="text-[10px] sm:text-xs font-bold text-chocolate mb-0.5 sm:mb-1">LEFT</div>
          <div className="text-4xl sm:text-5xl text-chocolate">{getShapeIcon(level.left)}</div>
          <div className="text-[10px] sm:text-xs text-chocolate opacity-70 capitalize mt-0.5 sm:mt-1">{level.left}</div>
        </div>

        {/* Right shape card */}
        <div className="bg-skyblue rounded-xl sm:rounded-2xl p-2 sm:p-3 text-center shadow-lg">
          <div className="text-[10px] sm:text-xs font-bold text-white mb-0.5 sm:mb-1">RIGHT</div>
          <div className="text-4xl sm:text-5xl text-white">{getShapeIcon(level.right)}</div>
          <div className="text-[10px] sm:text-xs text-white opacity-90 capitalize mt-0.5 sm:mt-1">{level.right}</div>
        </div>
      </div>

      {/* Canvas container */}
      <div className="relative flex-1 min-h-0">
        {children}
      </div>
    </div>
  );
}

function getShapeIcon(shape) {
  const icons = {
    circle: '●',
    square: '■',
    triangle: '▲',
    star: '★',
    heart: '♥',
    diamond: '◆',
  };
  return icons[shape] || '?';
}
