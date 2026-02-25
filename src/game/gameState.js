import { create } from 'zustand';

export const useGameStore = create((set) => ({
  currentLevel: 1,
  unlockedLevels: 1,
  score: 0,
  combo: 0,
  isPlaying: false,
  isPaused: false,
  gameResult: null, // 'success' | 'failure' | null

  startLevel: (levelId) => set({ currentLevel: levelId, isPlaying: true, isPaused: false, gameResult: null }),
  completeLevel: (points, perfect) => set((state) => ({
    score: state.score + points,
    combo: perfect ? state.combo + 1 : 0,
    gameResult: 'success',
    isPlaying: false,
    unlockedLevels: Math.max(state.unlockedLevels, state.currentLevel + 1),
  })),
  failLevel: () => set({ combo: 0, gameResult: 'failure', isPlaying: false }),
  pauseGame: () => set({ isPaused: true }),
  resumeGame: () => set({ isPaused: false }),
  resetGame: () => set({ currentLevel: 1, unlockedLevels: 1, score: 0, combo: 0, isPlaying: false, gameResult: null }),
}));
