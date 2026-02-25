export function MobileLayout({ children, level }) {
  return (
    <div className="w-full">
      {/* Header - always visible */}
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="text-center flex-1">
          <div className="text-xs text-chocolate opacity-70">Level</div>
          <div className="text-xl font-bold text-chocolate">{level.id}</div>
        </div>
        <div className="text-center flex-1">
          <div className="text-xs text-chocolate opacity-70">Time</div>
          <div className="text-xl font-bold text-chocolate" id="timer-display">--</div>
        </div>
        <div className="text-center flex-1">
          <div className="text-xs text-chocolate opacity-70">Combo</div>
          <div className="text-xl font-bold text-mint" id="combo-display">0x</div>
        </div>
      </div>

      {/* Desktop: side-by-side cards, Mobile: stacked */}
      <div className="grid md:grid-cols-2 gap-3 mb-4">
        {/* Left shape card */}
        <div className="bg-sunshine rounded-2xl p-3 text-center shadow-lg">
          <div className="text-xs font-bold text-chocolate mb-1">LEFT HAND</div>
          <div className="text-5xl text-chocolate">{getShapeIcon(level.left)}</div>
          <div className="text-xs text-chocolate opacity-70 capitalize mt-1">{level.left}</div>
        </div>

        {/* Right shape card */}
        <div className="bg-skyblue rounded-2xl p-3 text-center shadow-lg">
          <div className="text-xs font-bold text-white mb-2">RIGHT HAND</div>
          <div className="text-5xl text-white">{getShapeIcon(level.right)}</div>
          <div className="text-xs text-white opacity-90 capitalize mt-1">{level.right}</div>
        </div>
      </div>

      {/* Canvas container */}
      <div className="relative">
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
