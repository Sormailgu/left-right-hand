export const LEVELS = [
  // Tutorial (1-5) - Same shape both hands
  { id: 1, left: 'circle', right: 'circle', time: 10, difficulty: 'tutorial' },
  { id: 2, left: 'square', right: 'square', time: 10, difficulty: 'tutorial' },
  { id: 3, left: 'circle', right: 'circle', time: 10, difficulty: 'tutorial' },
  { id: 4, left: 'square', right: 'square', time: 9, difficulty: 'tutorial' },
  { id: 5, left: 'circle', right: 'square', time: 9, difficulty: 'tutorial' },

  // Intermediate (6-10) - Different shapes
  { id: 6, left: 'circle', right: 'square', time: 7, difficulty: 'intermediate' },
  { id: 7, left: 'triangle', right: 'square', time: 7, difficulty: 'intermediate' },
  { id: 8, left: 'circle', right: 'triangle', time: 7, difficulty: 'intermediate' },
  { id: 9, left: 'square', right: 'triangle', time: 6, difficulty: 'intermediate' },
  { id: 10, left: 'triangle', right: 'circle', time: 6, difficulty: 'intermediate' },

  // Advanced (11-15) - Complex shapes, direction
  { id: 11, left: 'circle', right: 'circle', time: 5, difficulty: 'advanced', direction: 'clockwise' },
  { id: 12, left: 'triangle', right: 'square', time: 5, difficulty: 'advanced', direction: 'clockwise' },
  { id: 13, left: 'diamond', right: 'square', time: 5, difficulty: 'advanced', direction: 'any' },
  { id: 14, left: 'circle', right: 'square', time: 4, difficulty: 'advanced', direction: 'any' },
  { id: 15, left: 'circle', right: 'triangle', time: 4, difficulty: 'advanced', direction: 'counter' },

  // Expert (16-20) - Mirror, precision
  { id: 16, left: 'circle', right: 'square', time: 4, difficulty: 'expert', mirror: true },
  { id: 17, left: 'circle', right: 'circle', time: 3, difficulty: 'expert', mirror: true },
  { id: 18, left: 'square', right: 'triangle', time: 3, difficulty: 'expert', precision: true },
  { id: 19, left: 'diamond', right: 'triangle', time: 3, difficulty: 'expert', precision: true },
  { id: 20, left: 'square', right: 'circle', time: 3, difficulty: 'expert', precision: true, mirror: true },
];
