import { useCallback } from 'react';

export function useHapticFeedback() {
  const triggerHaptic = useCallback((pattern = 'light') => {
    // Check if haptic feedback is supported
    if (!navigator.vibrate) return;

    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30],
      success: [10, 50, 10],
      error: [30, 50, 30],
      double: [10, 30, 10],
    };

    navigator.vibrate(patterns[pattern] || patterns.light);
  }, []);

  return { triggerHaptic };
}
