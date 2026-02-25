import { create } from 'zustand';

export const useGameStore = create((set) => ({
  currentLevel: 1,
  unlockedLevels: 1,
  score: 0,
  combo: 0,
  isPlaying: false,
  isPaused: false,
  gameResult: null, // 'success' | 'failure' | null

  // Tutorial mode
  tutorialStep: 0,                // 0 = first shape, 1 = second shape (for sequential mode)
  activeSide: null,               // 'left' | 'right' | null (which side should draw)

  // Timing enhancements
  gracePeriod: false,             // In 2s grace period before timer starts
  timeBonus: 0,                   // Accumulated time bonus from completed shapes
  slowMotionActive: false,        // Timer at 50% speed when one shape complete

  // Feedback system
  confidence: { left: 0, right: 0 },  // Real-time recognition confidence (0-100)
  currentAttempt: null,           // { points: [], side: 'left'|'right', timestamp }
  attempts: [],                   // History of all attempts in current level
  showFeedback: false,            // Show feedback overlay
  feedbackMessage: '',            // Current hint/tip message
  recognizedShapes: { left: false, right: false },  // Track recognition separately

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

  // Actions for tutorial mode
  setTutorialStep: (step) => set({ tutorialStep: step }),
  setActiveSide: (side) => set({ activeSide: side }),

  // Actions for timing
  setGracePeriod: (active) => set({ gracePeriod: active }),
  addTimeBonus: (bonus) => set((state) => ({ timeBonus: state.timeBonus + bonus })),
  setSlowMotion: (active) => set({ slowMotionActive: active }),

  // Actions for feedback
  updateConfidence: (side, value) => set((state) => ({
    confidence: { ...state.confidence, [side]: value }
  })),
  setCurrentAttempt: (attempt) => set({ currentAttempt: attempt }),
  addAttempt: (attempt) => set((state) => ({
    attempts: [...state.attempts, attempt]
  })),
  setShowFeedback: (show) => set({ showFeedback: show }),
  setFeedbackMessage: (message) => set({ feedbackMessage: message }),
  setRecognizedShape: (side, recognized) => set((state) => ({
    recognizedShapes: { ...state.recognizedShapes, [side]: recognized }
  })),
  clearFeedback: () => set({
    confidence: { left: 0, right: 0 },
    currentAttempt: null,
    attempts: [],
    showFeedback: false,
    feedbackMessage: '',
    recognizedShapes: { left: false, right: false },
    tutorialStep: 0,
    activeSide: null,
  }),
}));
