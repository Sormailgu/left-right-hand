export function generateFeedback(shape, confidence, recognized) {
  if (recognized) {
    const successMessages = [
      `Perfect ${shape}!`,
      `Great ${shape}!`,
      `Nice ${shape}!`,
      `Excellent!`,
    ];
    return successMessages[Math.floor(Math.random() * successMessages.length)];
  }

  // Specific hints based on shape and confidence
  const hints = {
    circle: {
      low: 'Try making it more round and smooth',
      medium: 'Good start! Make it more circular',
    },
    square: {
      low: 'Try drawing 4 straight corners',
      medium: 'Almost! Sharpen the corners',
    },
    triangle: {
      low: 'Draw 3 straight lines meeting at points',
      medium: 'Getting there! Make the corners sharper',
    },
    diamond: {
      low: 'Draw a square standing on its corner',
      medium: 'Good! Make the points sharper',
    },
    star: {
      low: 'Draw 5 points going around',
      medium: 'Keep going! Make the points more distinct',
    },
    heart: {
      low: 'Draw two humps at the top and a point at bottom',
      medium: 'Nice! Make it more rounded',
    },
  };

  if (hints[shape]) {
    const level = confidence < 40 ? 'low' : 'medium';
    return hints[shape][level];
  }

  return confidence < 40 ? 'Try again!' : 'Getting close!';
}
