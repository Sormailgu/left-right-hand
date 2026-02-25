export function HandGuide() {
  return (
    <div className="relative w-full h-full pointer-events-none">
      {/* Left hand guide */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-chocolate opacity-30">
        <div className="text-4xl mb-2">👈</div>
        <div className="text-xs text-center">Left</div>
      </div>

      {/* Right hand guide */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white opacity-30">
        <div className="text-4xl mb-2">👉</div>
        <div className="text-xs text-center">Right</div>
      </div>

      {/* Center divider hint */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-chocolate opacity-20 transform -translate-x-1/2">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-cream px-2 text-xs text-chocolate opacity-50">
          Draw on each side
        </div>
      </div>
    </div>
  );
}
