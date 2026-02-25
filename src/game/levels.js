export const LEVELS = [
  // Tutorial (1-5) - Progressive learning
  { id: 1, mode: 'single', shape: 'circle', time: 0, difficulty: 'tutorial', instruction: 'Draw a circle with either hand' },
  { id: 2, mode: 'single', shape: 'square', time: 0, difficulty: 'tutorial', instruction: 'Draw a square with either hand' },
  { id: 3, mode: 'sequential', left: 'circle', right: 'square', time: 30, difficulty: 'tutorial', instruction: 'Draw circle, then square' },
  { id: 4, mode: 'sequential', left: 'triangle', right: 'circle', time: 25, difficulty: 'tutorial', instruction: 'Draw triangle, then circle' },
  { id: 5, mode: 'simultaneous', left: 'circle', right: 'square', time: 25, difficulty: 'tutorial', instruction: 'Draw both at the same time!' },

  // Intermediate (6-10) - Different shapes, generous timing
  { id: 6, mode: 'simultaneous', left: 'circle', right: 'square', time: 20, difficulty: 'intermediate' },
  { id: 7, mode: 'simultaneous', left: 'triangle', right: 'square', time: 20, difficulty: 'intermediate' },
  { id: 8, mode: 'simultaneous', left: 'circle', right: 'triangle', time: 18, difficulty: 'intermediate' },
  { id: 9, mode: 'simultaneous', left: 'square', right: 'triangle', time: 15, difficulty: 'intermediate' },
  { id: 10, mode: 'simultaneous', left: 'triangle', right: 'circle', time: 15, difficulty: 'intermediate' },

  // Advanced (11-15) - Increased time limits
  { id: 11, mode: 'simultaneous', left: 'circle', right: 'circle', time: 15, difficulty: 'advanced', direction: 'clockwise' },
  { id: 12, mode: 'simultaneous', left: 'triangle', right: 'square', time: 12, difficulty: 'advanced', direction: 'clockwise' },
  { id: 13, mode: 'simultaneous', left: 'diamond', right: 'square', time: 12, difficulty: 'advanced', direction: 'any' },
  { id: 14, mode: 'simultaneous', left: 'circle', right: 'square', time: 10, difficulty: 'advanced', direction: 'any' },
  { id: 15, mode: 'simultaneous', left: 'circle', right: 'triangle', time: 10, difficulty: 'advanced', direction: 'counter' },

  // Expert (16-20) - More generous than before
  { id: 16, mode: 'simultaneous', left: 'circle', right: 'square', time: 12, difficulty: 'expert', mirror: true },
  { id: 17, mode: 'simultaneous', left: 'circle', right: 'circle', time: 10, difficulty: 'expert', mirror: true },
  { id: 18, mode: 'simultaneous', left: 'square', right: 'triangle', time: 10, difficulty: 'expert', precision: true },
  { id: 19, mode: 'simultaneous', left: 'diamond', right: 'triangle', time: 8, difficulty: 'expert', precision: true },
  { id: 20, mode: 'simultaneous', left: 'square', right: 'circle', time: 8, difficulty: 'expert', precision: true, mirror: true },
];
