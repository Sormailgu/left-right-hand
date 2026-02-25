# Casual Game Enhancement Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform Two Hands - One Challenge from a difficult hardcore game into an accessible casual/family-friendly experience with generous timing, clear tutorial, mobile-optimized UI, and comprehensive feedback system

**Architecture:** React 19 + Vite, enhance existing state management with tutorial modes and feedback tracking, upgrade shape recognition with confidence scoring and progressive thresholds, responsive mobile-first UI with larger touch targets

**Tech Stack:** React, Vite, Zustand, TailwindCSS, Canvas API, Touch Events API, Haptic Feedback API

---

## Task 1: Update Level Structure with Tutorial Modes

**Files:**
- Modify: `src/game/levels.js`
- Test: Manual testing in browser

**Step 1: Read current levels structure**

Read: `src/game/levels.js`
Expected: Current 20 levels with left/right shapes and time limits

**Step 2: Add mode field to tutorial levels**

Modify `src/game/levels.js` - replace first 5 levels with:

```javascript
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
```

**Step 3: Test in browser**

Run: `npm run dev`
Visit: http://localhost:5173
Check: Level grid shows all 20 levels, click Level 1-5 to verify new structure

**Step 4: Commit**

```bash
git add src/game/levels.js
git commit -m "feat: add tutorial modes and generous timing to levels"
```

---

## Task 2: Extend Game State for Tutorial and Feedback

**Files:**
- Modify: `src/game/gameState.js`

**Step 1: Read current game state**

Read: `src/game/gameState.js`
Expected: Zustand store with currentLevel, unlockedLevels, score, combo, isPlaying, etc.

**Step 2: Add tutorial and feedback state**

Modify `src/game/gameState.js` - add new state properties to the store:

```javascript
export const useGameStore = create((set) => ({
  // ... existing properties ...

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
```

**Step 3: Test state updates**

Run: `npm run dev`
Open browser console, test state updates with:
```javascript
// In browser console
const store = window.useGameStore.getState();
store.setActiveSide('left');
console.log(store.activeSide); // Should be 'left'
```

**Step 4: Commit**

```bash
git add src/game/gameState.js
git commit -m "feat: extend game state for tutorial modes and feedback system"
```

---

## Task 3: Create TutorialGuide Component

**Files:**
- Create: `src/components/TutorialGuide.jsx`

**Step 1: Write the component**

Create `src/components/TutorialGuide.jsx`:

```javascript
import { useGameStore } from '../game/gameState';
import { SHAPES } from '../game/shapes';

export function TutorialGuide({ level }) {
  const { activeSide, tutorialStep } = useGameStore();

  // Only show for tutorial levels
  if (level.difficulty !== 'tutorial') return null;
  if (level.mode === 'single') {
    return (
      <div className="bg-white rounded-2xl p-4 mb-4 shadow-lg border-2 border-sunshine">
        <div className="text-center">
          <div className="text-2xl mb-2">👆</div>
          <div className="text-lg font-bold text-chocolate mb-1">
            Draw with either hand
          </div>
          <div className="text-sm text-chocolate opacity-70">
            Draw a <span className="font-bold">{SHAPES[level.shape].name}</span>
          </div>
        </div>
      </div>
    );
  }

  if (level.mode === 'sequential') {
    const currentShape = tutorialStep === 0 ? level.left : level.right;
    const currentSide = tutorialStep === 0 ? 'left' : 'right';
    const isComplete = tutorialStep === 1;

    return (
      <div className={`rounded-2xl p-4 mb-4 shadow-lg border-2 ${currentSide === 'left' ? 'bg-sunshine border-chocolate' : 'bg-skyblue border-white'}`}>
        <div className="text-center">
          <div className="text-2xl mb-2">
            {tutorialStep === 0 ? '👈 Left hand first!' : '👉 Now right hand!'}
          </div>
          <div className="text-lg font-bold text-chocolate mb-1">
            Draw a <span className="font-bold">{SHAPES[currentShape].name}</span>
          </div>
          {isComplete && (
            <div className="text-sm text-chocolate opacity-70 mt-2">
              Then draw both at the same time!
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
```

**Step 2: Test component**

Add temporary test to `src/App.jsx`:
```javascript
import { TutorialGuide } from './components/TutorialGuide';

// In App component, before return:
const testLevel = { mode: 'sequential', difficulty: 'tutorial', left: 'circle', right: 'square' };
// Add to JSX: <TutorialGuide level={testLevel} />
```

**Step 3: Remove test and commit**

```bash
git add src/components/TutorialGuide.jsx
git commit -m "feat: create TutorialGuide component for sequential mode"
```

---

## Task 4: Implement Real-Time Confidence Calculation

**Files:**
- Modify: `src/game/shapes.js`

**Step 1: Read current shape recognition**

Read: `src/game/shapes.js`
Expected: recognizeShape function that returns { shape, confidence }

**Step 2: Add progressive confidence calculation**

Modify `src/game/shapes.js` - update recognizeShape to return confidence and add new function:

```javascript
export function recognizeShapeWithProgress(points, targetShape, difficulty = 'tutorial') {
  const baseResult = recognizeShape(points);
  if (!baseResult) return { shape: null, confidence: 0 };

  // Progressive thresholds based on difficulty
  const thresholds = {
    tutorial: 0.50,   // Very forgiving
    intermediate: 0.60,
    advanced: 0.70,
    expert: 0.80,
  };

  const threshold = thresholds[difficulty] || 0.70;
  const adjustedConfidence = baseResult.confidence;

  return {
    shape: baseResult.shape,
    confidence: Math.round(adjustedConfidence * 100),
    recognized: baseResult.shape === targetShape && adjustedConfidence >= threshold,
    threshold: Math.round(threshold * 100),
  };
}

export function calculateRealTimeConfidence(points, targetShape) {
  if (!points || points.length < 5) return { confidence: 0, onTrack: false };

  const result = recognizeShapeWithProgress(points, targetShape, 'tutorial');
  const onTrack = result.confidence >= 40; // Yellow threshold

  return {
    confidence: result.confidence,
    onTrack,
    color: result.confidence >= 70 ? 'green' : result.confidence >= 40 ? 'yellow' : 'red',
  };
}
```

**Step 3: Test confidence calculation**

Add test in browser console:
```javascript
import { calculateRealTimeConfidence } from './src/game/shapes';
// Test with sample points
const testPoints = [{x: 100, y: 100}, {x: 150, y: 100}, {x: 150, y: 150}, {x: 100, y: 150}, {x: 100, y: 100}];
console.log(calculateRealTimeConfidence(testPoints, 'square'));
```

**Step 4: Commit**

```bash
git add src/game/shapes.js
git commit -m "feat: add progressive confidence calculation and real-time feedback"
```

---

## Task 5: Create ConfidenceMeter Component

**Files:**
- Create: `src/components/ConfidenceMeter.jsx`

**Step 1: Write the component**

Create `src/components/ConfidenceMeter.jsx`:

```javascript
import { useGameStore } from '../game/gameState';

export function ConfidenceMeter({ side, shape }) {
  const { confidence } = useGameStore();
  const currentConfidence = confidence[side] || 0;

  // Color based on confidence level
  const getColor = () => {
    if (currentConfidence >= 70) return 'bg-green-500';
    if (currentConfidence >= 40) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  const getTextColor = () => {
    if (currentConfidence >= 70) return 'text-green-600';
    if (currentConfidence >= 40) return 'text-yellow-600';
    return 'text-red-500';
  };

  if (currentConfidence === 0) return null;

  return (
    <div className="flex items-center gap-2">
      {/* Circular progress indicator */}
      <div className="relative w-12 h-12">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeDasharray={`${currentConfidence * 1.26} 126`}
            className={getTextColor()}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold">{currentConfidence}</span>
        </div>
      </div>
      <span className={`text-sm font-bold ${getTextColor()}`}>
        {currentConfidence >= 70 ? '✓' : currentConfidence >= 40 ? '~' : '...'}
      </span>
    </div>
  );
}
```

**Step 2: Test component**

Add temporary test in `src/App.jsx` to verify rendering

**Step 3: Commit**

```bash
git add src/components/ConfidenceMeter.jsx
git commit -m "feat: create ConfidenceMeter component for real-time feedback"
```

---

## Task 6: Create ShapeOverlay Feedback Component

**Files:**
- Create: `src/components/ShapeOverlay.jsx`

**Step 1: Write the component**

Create `src/components/ShapeOverlay.jsx`:

```javascript
import { useGameStore } from '../game/gameState';
import { SHAPES } from '../game/shapes';

export function ShapeOverlay({ show, onClose, attempt }) {
  const { feedbackMessage } = useGameStore();

  if (!show || !attempt) return null;

  const { recognized, confidence, shape } = attempt;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
        <div className="text-center">
          {/* Recognition result */}
          <div className="text-6xl mb-4">
            {recognized ? '✓' : '✗'}
          </div>

          <h3 className={`text-2xl font-bold mb-2 ${recognized ? 'text-mint' : 'text-coral'}`}>
            {recognized ? `Good ${shape}!` : 'Not quite...'}
          </h3>

          {/* Confidence meter */}
          <div className="bg-cream rounded-xl p-4 mb-4">
            <div className="text-sm text-chocolate opacity-70 mb-1">Match Score</div>
            <div className="flex items-center justify-center gap-2">
              <div className="text-4xl font-bold text-chocolate">{confidence}%</div>
              <div className={`text-sm ${confidence >= 70 ? 'text-green-600' : confidence >= 40 ? 'text-yellow-600' : 'text-red-500'}`}>
                {confidence >= 70 ? 'Great!' : confidence >= 40 ? 'Getting there' : 'Keep trying'}
              </div>
            </div>
          </div>

          {/* Specific feedback */}
          {feedbackMessage && (
            <div className="bg-skyblue bg-opacity-20 rounded-xl p-4 mb-4">
              <div className="text-sm text-chocolate font-semibold">Tip:</div>
              <div className="text-sm text-chocolate">{feedbackMessage}</div>
            </div>
          )}

          {/* Action buttons */}
          <button
            onClick={onClose}
            className="w-full bg-mint text-chocolate py-3 rounded-full font-bold shadow-lg active:scale-95 transition-transform"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Test component display**

**Step 3: Commit**

```bash
git add src/components/ShapeOverlay.jsx
git commit -m "feat: create ShapeOverlay component for post-drawing feedback"
```

---

## Task 7: Update GameCanvas with Real-Time Feedback

**Files:**
- Modify: `src/components/GameCanvas.jsx`

**Step 1: Read current GameCanvas**

Read: `src/components/GameCanvas.jsx`
Expected: Canvas with multi-touch handling and shape recognition

**Step 2: Add real-time confidence updates**

Modify `src/components/GameCanvas.jsx` - import and use confidence calculation:

```javascript
import { calculateRealTimeConfidence } from '../game/shapes';
import { useGameStore } from '../game/gameState';

export function GameCanvas({ level, onRecognize, timeLimit }) {
  // ... existing imports ...
  const { updateConfidence, setRecognizedShape } = useGameStore();

  // In drawCanvas function, add real-time confidence calculation:
  function drawCanvas(activeTouches) {
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw dividing line
    // ... existing code ...

    // Draw each touch path with color-coded feedback
    for (let [id, touch] of Object.entries(activeTouches)) {
      const isLeft = touch.x < canvasRef.current.width / 2;
      const side = isLeft ? 'left' : 'right';
      const targetShape = isLeft ? level.left : level.right;

      // Calculate real-time confidence
      const feedback = calculateRealTimeConfidence(touch.points, targetShape);
      updateConfidence(side, feedback.confidence);

      // Color based on confidence
      const strokeColor = feedback.confidence >= 70 ? '#22c55e' :  // green
                          feedback.confidence >= 40 ? '#facc15' :  // yellow
                          '#ef4444';  // red

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      touch.points.forEach((point, i) => {
        if (i === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    }
  }

  // Update checkShapes to use progressive thresholds
  function checkShapes(endedTouches) {
    const touchArray = Object.entries(endedTouches);
    if (touchArray.length === 0) return;

    const canvas = canvasRef.current;

    for (let [id, touch] of touchArray) {
      const isLeft = touch.x < canvas.width / 2;
      const side = isLeft ? 'left' : 'right';
      const targetShape = isLeft ? level.left : level.right;

      // Use progressive recognition
      const result = recognizeShapeWithProgress(
        touch.points,
        targetShape,
        level.difficulty
      );

      if (result.recognized) {
        setRecognizedShape(side, true);
      }

      // Store attempt for feedback
      const attempt = {
        shape: result.shape,
        confidence: result.confidence,
        recognized: result.recognized,
        side,
        timestamp: Date.now(),
      };
      // Use game state to store attempt
    }
  }

  // ... rest of component ...
}
```

**Step 3: Test color-coded drawing**

Run: `npm run dev`
Test: Draw shapes and observe color changes (red → yellow → green)

**Step 4: Commit**

```bash
git add src/components/GameCanvas.jsx
git commit -m "feat: add real-time confidence feedback with color-coded strokes"
```

---

## Task 8: Implement Grace Period and Time Bonus System

**Files:**
- Modify: `src/components/GameLoop.jsx`

**Step 1: Read current GameLoop**

Read: `src/components/GameLoop.jsx`
Expected: Game loop with countdown, playing, and result phases

**Step 2: Add grace period logic**

Modify `src/components/GameLoop.jsx`:

```javascript
import { useGameStore } from '../game/gameState';

export function GameLoop() {
  const { gracePeriod, setGracePeriod, addTimeBonus, setSlowMotion, recognizedShapes } = useGameStore();
  // ... existing code ...

  // Update countdown phase to include grace period
  useEffect(() => {
    if (phase === 'countdown') {
      let countdown = 3;
      setPhase('countdown');

      const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown <= 0) {
          clearInterval(countdownInterval);
          setPhase('playing');
          // Activate grace period
          setGracePeriod(true);
          // Deactivate grace period after 2 seconds
          setTimeout(() => setGracePeriod(false), 2000);
        }
        setCountdown(countdown);
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [phase]);

  // Update timer to include slow motion and bonuses
  useEffect(() => {
    if (phase === 'playing' && !gracePeriod) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          // Check if one shape is complete - activate slow motion
          const oneComplete = (recognizedShapes.left && !recognizedShapes.right) ||
                            (!recognizedShapes.left && recognizedShapes.right);
          if (oneComplete && !slowMotionActive) {
            setSlowMotion(true);
          }

          // Timer runs at 50% speed in slow motion
          const decrement = slowMotionActive ? 0.05 : 0.1;

          if (prev <= 0.1) {
            clearInterval(timer);
            setPhase('result');
            failLevel();
            return 0;
          }
          return prev - decrement;
        });
      }, 100);

      return () => clearInterval(timer);
    }
  }, [phase, gracePeriod, slowMotionActive, recognizedShapes]);

  // Add time bonus when shape is recognized
  useEffect(() => {
    const previousRecognized = useRef({ left: false, right: false });

    const leftBonus = recognizedShapes.left && !previousRecognized.current.left ? 5 : 0;
    const rightBonus = recognizedShapes.right && !previousRecognized.current.right ? 5 : 0;

    if (leftBonus || rightBonus) {
      const totalBonus = leftBonus + rightBonus;
      setTimeLeft((prev) => Math.min(prev + totalBonus, level.time)); // Cap at original time
    }

    previousRecognized.current = recognizedShapes;
  }, [recognizedShapes]);

  // ... rest of component ...
}
```

**Step 3: Test timing mechanics**

Test: Start level 1, verify 2s grace period before timer starts
Test: Complete one shape, verify timer slows to 50%
Test: Complete each shape, verify +5s time bonus

**Step 4: Commit**

```bash
git add src/components/GameLoop.jsx
git commit -m "feat: add grace period, slow motion, and time bonus system"
```

---

## Task 9: Create MobileLayout Component

**Files:**
- Create: `src/components/MobileLayout.jsx`

**Step 1: Write responsive layout component**

Create `src/components/MobileLayout.jsx`:

```javascript
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
```

**Step 2: Test responsive layout**

Test: Resize browser window, verify layout switches from side-by-side to stacked

**Step 3: Commit**

```bash
git add src/components/MobileLayout.jsx
git commit -m "feat: create responsive MobileLayout component"
```

---

## Task 10: Increase Touch Target Sizes

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/index.css`

**Step 1: Update button sizes in App.jsx**

Modify `src/App.jsx` - update level selector buttons:

```javascript
<button
  key={level.id}
  disabled={!isUnlocked}
  onClick={() => startLevel(level.id)}
  className={`aspect-square rounded-xl font-bold text-lg min-w-[60px] min-h-[60px] ${
    isUnlocked
      ? 'bg-mint text-chocolate hover:scale-105 active:scale-95 transition-transform'
      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
  }`}
>
  {level.id}
</button>
```

Update main play button:
```javascript
<button
  onClick={() => startLevel(currentLevel)}
  className="bg-sunshine text-chocolate px-8 py-4 min-h-[56px] rounded-full text-xl font-bold shadow-lg active:scale-95 transition-transform"
>
  Play Level {currentLevel}
</button>
```

**Step 2: Add touch feedback styles**

Modify `src/index.css` - add:

```css
/* Touch feedback */
button:active {
  transform: scale(0.95);
  transition: transform 0.1s ease-out;
}

/* Ensure minimum touch targets */
@media (pointer: coarse) {
  button, a, .touch-target {
    min-height: 44px;
    min-width: 44px;
  }
}

/* Touch feedback for mobile */
@media (hover: none) {
  button:active {
    background-color: var(--tw-color-sunshine-dark);
    transform: scale(0.95);
  }
}
```

**Step 3: Test touch targets**

Test: On mobile device, verify all buttons are easily tappable

**Step 4: Commit**

```bash
git add src/App.jsx src/index.css
git commit -m "feat: increase touch target sizes for mobile accessibility"
```

---

## Task 11: Increase Canvas Size on Mobile

**Files:**
- Modify: `src/components/GameCanvas.jsx`
- Modify: `tailwind.config.js`

**Step 1: Add custom height class**

Modify `tailwind.config.js`:

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ... existing colors ...
      },
      height: {
        'canvas-mobile': '50vh',
        'canvas-desktop': '24rem',
      },
    },
  },
  plugins: [],
}
```

**Step 2: Update canvas className**

Modify `src/components/GameCanvas.jsx`:

```javascript
<canvas
  ref={canvasRef}
  {...touchHandlers}
  className="w-full h-canvas-mobile md:h-canvas-desktop bg-white rounded-3xl shadow-lg border-4 border-chocolate"
/>
```

**Step 3: Test canvas size**

Test: On mobile, canvas should be 50% of viewport height
Test: On desktop, canvas should be fixed height (24rem)

**Step 4: Commit**

```bash
git add src/components/GameCanvas.jsx tailwind.config.js
git commit -m "feat: increase canvas height on mobile for better drawing space"
```

---

## Task 12: Add Hand Guide Indicators

**Files:**
- Create: `src/components/HandGuide.jsx`

**Step 1: Create hand guide component**

Create `src/components/HandGuide.jsx`:

```javascript
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
```

**Step 2: Integrate into GameCanvas**

Modify `src/components/GameCanvas.jsx`:

```javascript
import { HandGuide } from './HandGuide';

// In the component return, wrap canvas:
<div className="relative">
  <canvas ref={canvasRef} {...touchHandlers} className="..." />
  <HandGuide />
</div>
```

**Step 3: Test hand guides**

Test: Load game, verify hand guides appear on canvas

**Step 4: Commit**

```bash
git add src/components/HandGuide.jsx src/components/GameCanvas.jsx
git commit -m "feat: add hand guide indicators to canvas"
```

---

## Task 13: Add Haptic Feedback

**Files:**
- Create: `src/hooks/useHapticFeedback.js`
- Modify: `src/components/GameCanvas.jsx`

**Step 1: Create haptic feedback hook**

Create `src/hooks/useHapticFeedback.js`:

```javascript
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
```

**Step 2: Integrate haptic feedback**

Modify `src/components/GameCanvas.jsx`:

```javascript
import { useHapticFeedback } from '../hooks/useHapticFeedback';

export function GameCanvas({ level, onRecognize, timeLimit }) {
  const { triggerHaptic } = useHapticFeedback();

  // In checkShapes function, add haptic feedback:
  function checkShapes(endedTouches) {
    // ... existing code ...

    if (result.recognized) {
      setRecognizedShape(side, true);
      triggerHaptic('success');
    } else if (result.confidence < 30) {
      triggerHaptic('error');
    }

    // ... rest of code ...
  }

  // Add haptic on touch start
  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    triggerHaptic('light');
    // ... existing touch start code ...
  }, [triggerHaptic]);

  // ... rest of component ...
}
```

**Step 3: Test haptic feedback**

Test: On Android device, verify vibration on touch and shape recognition

**Step 4: Commit**

```bash
git add src/hooks/useHapticFeedback.js src/components/GameCanvas.jsx
git commit -m "feat: add haptic feedback for touch and shape recognition"
```

---

## Task 14: Create FeedbackMessage Generator

**Files:**
- Create: `src/utils/feedbackGenerator.js`

**Step 1: Create feedback message utility**

Create `src/utils/feedbackGenerator.js`:

```javascript
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
```

**Step 2: Test feedback generation**

```javascript
import { generateFeedback } from './src/utils/feedbackGenerator';
console.log(generateFeedback('circle', 85, true)); // "Great circle!"
console.log(generateFeedback('square', 35, false)); // "Try drawing 4 straight corners"
```

**Step 3: Commit**

```bash
git add src/utils/feedbackGenerator.js
git commit -m "feat: add feedback message generator for shape hints"
```

---

## Task 15: Integrate All Components into GameLoop

**Files:**
- Modify: `src/components/GameLoop.jsx`

**Step 1: Import all new components**

Modify `src/components/GameLoop.jsx` imports:

```javascript
import { TutorialGuide } from './TutorialGuide';
import { ConfidenceMeter } from './ConfidenceMeter';
import { ShapeOverlay } from './ShapeOverlay';
import { MobileLayout } from './MobileLayout';
import { HandGuide } from './HandGuide';
import { generateFeedback } from '../utils/feedbackGenerator';
```

**Step 2: Wrap content with MobileLayout**

Modify `src/components/GameLoop.jsx` return:

```javascript
return (
  <MobileLayout level={level}>
    {/* Tutorial guide */}
    <TutorialGuide level={level} />

    {/* Countdown */}
    {phase === 'countdown' && (
      <div className="text-center py-12">
        <div className="text-9xl font-extrabold text-chocolate animate-bounce">
          {countdown > 0 ? countdown : 'GO!'}
        </div>
      </div>
    )}

    {/* Game Canvas with confidence meters */}
    {phase === 'playing' && (
      <div className="space-y-4">
        <div className="flex justify-between px-4">
          <ConfidenceMeter side="left" shape={level.left} />
          <ConfidenceMeter side="right" shape={level.right} />
        </div>
        <GameCanvas level={level} onRecognize={handleRecognize} timeLimit={level.time} />
      </div>
    )}

    {/* Result Screen */}
    {phase === 'result' && (
      <div className="text-center py-8">
        {/* ... existing result screen ... */}
      </div>
    )}

    {/* Feedback overlay */}
    <ShapeOverlay
      show={showFeedback}
      onClose={() => setShowFeedback(false)}
      attempt={currentAttempt}
    />
  </MobileLayout>
);
```

**Step 3: Test full integration**

Test: Complete level, verify all new components work together
Test: Tutorial levels show sequential guide
Test: Confidence meters update in real-time
Test: Feedback overlay shows after each attempt

**Step 4: Commit**

```bash
git add src/components/GameLoop.jsx
git commit -m "feat: integrate all tutorial and feedback components"
```

---

## Task 16: Update Main Menu with Improved UX

**Files:**
- Modify: `src/App.jsx`

**Step 1: Add instruction text**

Modify `src/App.jsx`:

```javascript
function App() {
  const { currentLevel, isPlaying, unlockedLevels, startLevel } = useGameStore();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {!isPlaying ? (
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-chocolate mb-4">
              Two Hands
              <span className="block text-2xl text-skyblue">One Challenge</span>
            </h1>

            <p className="text-lg text-chocolate mb-2">
              Draw shapes with both hands at the same time!
            </p>

            {/* New: How to play section */}
            <div className="bg-white rounded-2xl p-4 mb-6 shadow-lg">
              <h3 className="text-sm font-bold text-chocolate mb-2">How to Play:</h3>
              <div className="text-xs text-chocolate opacity-80 text-left space-y-1">
                <div>👆 Use two fingers (one from each hand)</div>
                <div>✏️ Draw the shown shapes on each side</div>
                <div>⏱️ Complete before time runs out!</div>
              </div>
            </div>

            <button
              onClick={() => startLevel(currentLevel)}
              className="w-full bg-sunshine text-chocolate px-8 py-4 min-h-[56px] rounded-full text-xl font-bold shadow-lg active:scale-95 transition-transform mb-6"
            >
              Play Level {currentLevel}
            </button>

            <div className="pt-4">
              <h3 className="text-lg font-bold text-chocolate mb-4">Select Level</h3>
              <div className="grid grid-cols-5 gap-2">
                {LEVELS.map((level) => {
                  const isUnlocked = level.id <= unlockedLevels;
                  return (
                    <button
                      key={level.id}
                      disabled={!isUnlocked}
                      onClick={() => startLevel(level.id)}
                      className={`aspect-square rounded-xl font-bold text-lg min-w-[60px] min-h-[60px] ${
                        isUnlocked
                          ? 'bg-mint text-chocolate hover:scale-105 active:scale-95 transition-transform'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {level.id}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty indicator */}
            {currentLevel <= 5 && (
              <div className="mt-6 text-sm text-chocolate opacity-70">
                📚 Tutorial Mode - Learn the basics!
              </div>
            )}
          </div>
        ) : (
          <GameLoop />
        )}
      </div>
    </div>
  );
}
```

**Step 2: Test updated menu**

Test: Verify "How to Play" section displays
Test: Verify level buttons are larger and easier to tap

**Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: improve main menu UX with instructions and larger buttons"
```

---

## Task 17: Add No-Fail Mode for Tutorial Levels

**Files:**
- Modify: `src/components/GameLoop.jsx`

**Step 1: Modify timer logic for tutorials**

Modify `src/components/GameLoop.jsx`:

```javascript
// In the timer useEffect:
useEffect(() => {
  if (phase === 'playing' && !gracePeriod) {
    // Check if tutorial level with no time limit
    if (level.mode === 'single' || level.time === 0) {
      return; // No timer for single-shape tutorial levels
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        // ... existing timer logic ...

        // For tutorial levels, don't fail - just show "Keep practicing" message
        if (prev <= 0.1 && level.difficulty === 'tutorial') {
          clearInterval(timer);
          setPhase('result');
          // Don't call failLevel for tutorials
          return 0;
        }

        if (prev <= 0.1) {
          clearInterval(timer);
          setPhase('result');
          failLevel();
          return 0;
        }

        return prev - decrement;
      });
    }, 100);

    return () => clearInterval(timer);
  }
}, [phase, gracePeriod, slowMotionActive, recognizedShapes, level]);

// Update result screen to handle tutorial "keep practicing"
function ResultScreen({ success, level }) {
  const { currentLevel, startLevel } = useGameStore();
  const isTutorial = level.difficulty === 'tutorial';

  return (
    <div className="text-center space-y-6">
      {success ? (
        <>
          <div className="text-6xl">🎉</div>
          <h2 className="text-4xl font-extrabold text-mint">Great Job!</h2>
        </>
      ) : isTutorial ? (
        <>
          <div className="text-6xl">💪</div>
          <h2 className="text-4xl font-extrabold text-sunshine">Keep Practicing!</h2>
          <p className="text-lg text-chocolate">You're doing great - try again!</p>
        </>
      ) : (
        <>
          <div className="text-6xl">😅</div>
          <h2 className="text-4xl font-extrabold text-coral">Time's Up!</h2>
        </>
      )}

      <div className="flex gap-4 justify-center">
        <button
          onClick={() => startLevel(currentLevel)}
          className="bg-sunshine text-chocolate px-8 py-4 rounded-full text-xl font-bold shadow-lg active:scale-95 transition-transform"
        >
          {success || isTutorial ? 'Try Again' : 'Retry'}
        </button>
        {success && (
          <button
            onClick={() => startLevel(currentLevel + 1)}
            className="bg-mint text-chocolate px-8 py-4 rounded-full text-xl font-bold shadow-lg active:scale-95 transition-transform"
          >
            Next Level →
          </button>
        )}
        {!success && !isTutorial && (
          <button
            onClick={() => startLevel(currentLevel + 1)}
            className="bg-skyblue text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg active:scale-95 transition-transform"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
```

**Step 2: Test no-fail mode**

Test: Play Level 1, let timer run out, verify "Keep Practicing" instead of failure
Test: Complete Level 1, verify positive feedback

**Step 3: Commit**

```bash
git add src/components/GameLoop.jsx
git commit -m "feat: add no-fail mode for tutorial levels"
```

---

## Task 18: Comprehensive Testing on Mobile Devices

**Files:**
- Test across all components
- Create: `tests/mobile-manual-test.md`

**Step 1: Create mobile test checklist**

Create `tests/mobile-manual-test.md`:

```markdown
# Mobile Manual Test Checklist

## Tutorial Levels (1-5)

- [ ] Level 1: Single circle - No time limit, clear instructions
- [ ] Level 2: Single square - No time limit, clear instructions
- [ ] Level 3: Sequential mode - Left then right, 30s timer
- [ ] Level 4: Sequential mode - Triangle then circle, 25s timer
- [ ] Level 5: Simultaneous mode - Both at once, 25s timer

## Touch & Drawing

- [ ] Multi-touch works with two fingers
- [ ] Canvas responds correctly to touch input
- [ ] Drawing lines are smooth and follow finger
- [ ] Color-coded feedback works (red → yellow → green)
- [ ] Hand guides are visible and helpful

## Feedback System

- [ ] Confidence meter updates in real-time while drawing
- [ ] Shape recognition is forgiving (50% threshold in tutorial)
- [ ] Feedback overlay shows after each attempt
- [ ] Feedback messages are helpful and specific
- [ ] Haptic feedback works on Android (vibrates)

## Timing & Difficulty

- [ ] Grace period works (2s before timer starts)
- [ ] Time bonus adds +5s per completed shape
- [ ] Slow motion activates when one shape complete (50% speed)
- [ ] Tutorial levels don't fail (show "Keep practicing")

## Mobile UX

- [ ] All buttons are easily tappable (min 44px)
- [ ] Canvas height is adequate (50vh on mobile)
- [ ] Layout is responsive (stacked on mobile, side-by-side on desktop)
- [ ] Text is readable without zooming
- [ ] No accidental zoom or scroll during gameplay

## Progressive Levels

- [ ] Levels get progressively harder
- [ ] Intermediate levels (6-10) feel challenging but fair
- [ ] Advanced levels (11-15) test skills
- [ ] Expert levels (16-20) are achievable with practice

## Cross-Browser

- [ ] Works on iOS Safari
- [ ] Works on Android Chrome
- [ ] Works on desktop Chrome
- [ ] Works on desktop Safari

## Performance

- [ ] No lag during drawing
- [ ] Smooth animations
- [ ] No console errors
```

**Step 2: Run through test checklist**

Run: `npm run build && npm run preview`
Test: Open on mobile devices and go through checklist

**Step 3: Fix any issues found**

Document any issues found and create fixes as separate commits

**Step 4: Commit test checklist**

```bash
git add tests/mobile-manual-test.md
git commit -m "test: add mobile manual test checklist"
```

---

## Task 19: Final Polish and Documentation

**Files:**
- Modify: `README.md`
- Create: `CHANGELOG.md`

**Step 1: Update README with new features**

Modify `README.md` - add sections:

```markdown
## Casual Mode Features

### Enhanced Tutorial
- **Level 1-2**: Draw single shapes with no time limit
- **Level 3-4**: Sequential mode - one shape at a time
- **Level 5**: First simultaneous drawing challenge

### Accessibility Improvements
- Generous timing (25-30s for tutorials)
- No-fail mode for tutorial levels
- Forgiving shape recognition (50% threshold)
- Real-time confidence feedback
- Specific hints and tips

### Mobile Optimization
- Larger touch targets (60px minimum)
- Responsive canvas (50vh on mobile)
- Stacked layout for small screens
- Haptic feedback on supported devices
- Hand positioning guides

### Feedback System
- Real-time confidence meter (color-coded)
- Post-drawing feedback overlay
- Specific tips for improvement
- Progressive difficulty curve
```

**Step 2: Create changelog**

Create `CHANGELOG.md`:

```markdown
# Changelog

## [2.0.0] - 2025-02-25

### Added
- Tutorial mode with single-shape and sequential levels
- Real-time confidence feedback with color-coded strokes
- Post-drawing feedback overlay with specific hints
- Grace period (2s) before timer starts
- Time bonus system (+5s per completed shape)
- Slow motion when one shape complete
- No-fail mode for tutorial levels
- Mobile-optimized layout with larger touch targets
- Haptic feedback on supported devices
- Hand positioning guides on canvas
- Responsive canvas sizing (50vh mobile, 24rem desktop)
- Progressive recognition thresholds by difficulty

### Changed
- Increased time limits across all levels (2-3x more time)
- Tutorial levels (1-5) completely reworked
- Level selector buttons increased to 60px minimum
- Canvas height increased on mobile devices
- Shape recognition now uses progressive thresholds

### Fixed
- Mobile UX issues with small touch targets
- Unclear tutorial instructions
- Lack of feedback during drawing
- Cramped drawing area on mobile
```

**Step 3: Final commit**

```bash
git add README.md CHANGELOG.md
git commit -m "docs: update documentation for casual game enhancement"
```

---

## Task 20: Final Build and Verification

**Files:**
- Build production bundle
- Test on multiple devices

**Step 1: Build production version**

```bash
npm run build
```

Expected: Build completes without errors, output in `dist/`

**Step 2: Preview production build**

```bash
npm run preview
```

Test: Visit preview URL and verify all features work

**Step 3: Deploy and test**

Choose deployment method:
- Netlify: Drag `dist/` folder to Netlify drop
- Vercel: Connect repo and deploy
- GitHub Pages: Push `dist/` folder to gh-pages branch

**Step 4: Tag release**

```bash
git tag -a v2.0.0 -m "Casual Game Enhancement: Tutorial modes, mobile UX, feedback system"
git push origin main --tags
```

**Step 5: Final verification**

Test checklist:
- [ ] Tutorial levels guide players clearly
- [ ] Timing feels generous not punishing
- [ ] Mobile experience is smooth
- [ ] Feedback is helpful and actionable
- [ ] Game is fun and accessible

**Step 6: Create summary commit**

```bash
git add .
git commit -m "release: v2.0.0 - Casual game enhancement complete"
```

---

## Success Criteria Met

✅ **Tutorial Improvements**
- Single-shape levels (1-2) teach basics
- Sequential levels (3-4) introduce two-handed play
- Clear instructions and hand guides

✅ **Difficulty Adjustments**
- 25-30s for tutorials (was 9-10s)
- Time bonus system (+5s per shape)
- Grace period and slow motion
- No-fail mode for tutorials

✅ **Mobile UX**
- 60px minimum touch targets
- 50vh canvas height on mobile
- Responsive stacked layout
- Haptic feedback
- Hand positioning guides

✅ **Feedback System**
- Real-time confidence meters (color-coded)
- Post-drawing feedback overlay
- Specific hints per shape
- Progressive recognition thresholds

✅ **Overall Experience**
- Game is now casual/family-friendly
- Clear progression path
- Encouraging rather than punishing
- Works well on mobile devices

**Game is ready to play! 🎉**
