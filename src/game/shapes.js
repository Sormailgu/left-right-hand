export const SHAPES = {
  circle: {
    name: 'Circle',
    icon: '○',
    minPoints: 20,
    closure: true,
  },
  square: {
    name: 'Square',
    icon: '□',
    minPoints: 20,
    corners: 4,
    closure: true,
  },
  triangle: {
    name: 'Triangle',
    icon: '△',
    minPoints: 15,
    corners: 3,
    closure: true,
  },
  star: {
    name: 'Star',
    icon: '★',
    minPoints: 30,
    corners: 10,
    closure: true,
  },
  heart: {
    name: 'Heart',
    icon: '♥',
    minPoints: 25,
    closure: true,
  },
  diamond: {
    name: 'Diamond',
    icon: '◆',
    minPoints: 20,
    corners: 4,
    closure: true,
  },
};

export function recognizeShape(points) {
  if (!points || points.length < 10) return null;

  // Calculate basic properties
  const boundingBox = getBoundingBox(points);
  const center = {
    x: (boundingBox.minX + boundingBox.maxX) / 2,
    y: (boundingBox.minY + boundingBox.maxY) / 2,
  };

  // Check for circle
  const circleScore = isCircle(points, center);
  if (circleScore > 0.7) return { shape: 'circle', confidence: circleScore };

  // Check for square/rectangle
  const corners = detectCorners(points);
  if (corners === 4) {
    // Differentiate between square and diamond by aspect ratio
    const aspectRatio = (boundingBox.maxX - boundingBox.minX) / (boundingBox.maxY - boundingBox.minY);
    if (aspectRatio > 0.6 && aspectRatio < 1.4) {
      return { shape: 'diamond', confidence: 0.8 };
    }
    return { shape: 'square', confidence: 0.8 };
  }
  if (corners === 3) {
    return { shape: 'triangle', confidence: 0.8 };
  }

  // Star and heart not yet implemented - return null
  return null;
}

function calculatePathLength(points) {
  let length = 0;
  for (let i = 1; i < points.length; i++) {
    length += distance(points[i - 1], points[i]);
  }
  return length;
}

function distance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

function getBoundingBox(points) {
  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  };
}

function isCircle(points, center) {
  let totalRadius = 0;
  const radii = points.map(p => {
    const r = distance(p, center);
    totalRadius += r;
    return r;
  });

  const avgRadius = totalRadius / points.length;
  const variance = radii.reduce((sum, r) => sum + Math.pow(r - avgRadius, 2), 0) / points.length;
  const stdDev = Math.sqrt(variance);

  // Lower stdDev = more circular
  return Math.max(0, 1 - (stdDev / avgRadius));
}

function detectCorners(points) {
  let corners = 0;
  const angleThreshold = 30; // degrees

  for (let i = 5; i < points.length - 5; i++) {
    const prev = points[i - 5];
    const curr = points[i];
    const next = points[i + 5];

    const angle1 = Math.atan2(curr.y - prev.y, curr.x - prev.x);
    const angle2 = Math.atan2(next.y - curr.y, next.x - curr.x);

    let angleDiff = Math.abs(angle2 - angle1) * (180 / Math.PI);
    if (angleDiff > 180) angleDiff = 360 - angleDiff;

    if (angleDiff > angleThreshold) {
      corners++;
      i += 10; // Skip ahead to avoid counting same corner twice
    }
  }

  return corners;
}
