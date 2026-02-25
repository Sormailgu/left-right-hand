# Two-Handed Drawing Game Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a mobile web game where players draw different shapes with both hands simultaneously through 20 progressive levels

**Architecture:** React 18 + Vite for fast mobile builds, HTML5 Canvas API for multi-touch drawing and shape recognition, Zustand for lightweight state management, TailwindCSS for playful cartoon UI

**Tech Stack:** React, Vite, Canvas API, Zustand, TailwindCSS, touch events API

---

## Task 1: Initialize React + Vite Project

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `.gitignore`

**Step 1: Create package.json**

```bash
npm create vite@latest . -- --template react
```

Expected: Creates basic Vite React project structure

**Step 2: Install dependencies**

```bash
npm install zustand
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Expected: All packages installed successfully

**Step 3: Configure TailwindCSS**

Create `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8E7',
        sunshine: '#FFD93D',
        skyblue: '#6BCB77',
        mint: '#95E1D3',
        coral: '#F38181',
        chocolate: '#5D4037',
      },
      fontFamily: {
        rounded: ['Nunito', 'Quicksand', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

**Step 4: Update .gitignore**

```
node_modules
dist
.DS_Store
*.log
.env
```

**Step 5: Commit**

```bash
git add package.json vite.config.js index.html tailwind.config.js postcss.config.js .gitignore
git commit -m "feat: initialize React + Vite project with TailwindCSS"
```

---

## Task 2: Create Project Structure and Base Components

**Files:**
- Create: `src/App.jsx`
- Create: `src/main.jsx`
- Create: `src/index.css`
- Create: `src/game/levels.js`
- Create: `src/game/shapes.js`
- Create: `src/game/gameState.js`

**Step 1: Setup main entry point**

Create `src/main.jsx`:

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**Step 2: Create global styles**

Create `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');

body {
  font-family: 'Nunito', sans-serif;
  background-color: #FFF8E7;
  touch-action: none; /* Prevent zoom/scroll on mobile */
  overscroll-behavior: none;
  user-select: none;
}

* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}
```

**Step 3: Create level definitions**

Create `src/game/levels.js`:

```javascript
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
  { id: 11, left: 'star', right: 'circle', time: 5, difficulty: 'advanced', direction: 'clockwise' },
  { id: 12, left: 'heart', right: 'square', time: 5, difficulty: 'advanced', direction: 'clockwise' },
  { id: 13, left: 'star', right: 'triangle', time: 5, difficulty: 'advanced', direction: 'any' },
  { id: 14, left: 'diamond', right: 'circle', time: 4, difficulty: 'advanced', direction: 'any' },
  { id: 15, left: 'heart', right: 'star', time: 4, difficulty: 'advanced', direction: 'counter' },

  // Expert (16-20) - Mirror, precision
  { id: 16, left: 'star', right: 'star', time: 4, difficulty: 'expert', mirror: true },
  { id: 17, left: 'circle', right: 'circle', time: 3, difficulty: 'expert', mirror: true },
  { id: 18, left: 'square', right: 'triangle', time: 3, difficulty: 'expert', precision: true },
  { id: 19, left: 'star', right: 'heart', time: 3, difficulty: 'expert', precision: true },
  { id: 20, left: 'diamond', right: 'star', time: 3, difficulty: 'expert', precision: true, mirror: true },
];
```

**Step 4: Create shape templates**

Create `src/game/shapes.js`:

```javascript
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

  const pathLength = calculatePathLength(points);
  const startPoint = points[0];
  const endPoint = points[points.length - 1];
  const closure = distance(startPoint, endPoint);

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
    return { shape: 'square', confidence: 0.8 };
  }
  if (corners === 3) {
    return { shape: 'triangle', confidence: 0.8 };
  }

  // Default to unknown
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
```

**Step 5: Create game state store**

Create `src/game/gameState.js`:

```javascript
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
    unlockedLevels: Math.max(state.unlockedLevels, levelId + 1),
  })),
  failLevel: () => set({ combo: 0, gameResult: 'failure', isPlaying: false }),
  pauseGame: () => set({ isPaused: true }),
  resumeGame: () => set({ isPaused: false }),
  resetGame: () => set({ currentLevel: 1, unlockedLevels: 1, score: 0, combo: 0, isPlaying: false, gameResult: null }),
}));
```

**Step 6: Create base App component**

Create `src/App.jsx`:

```javascript
import { useGameStore } from './game/gameState';
import { LEVELS } from './game/levels';

function App() {
  const { currentLevel, isPlaying } = useGameStore();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {!isPlaying ? (
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-chocolate mb-8">
              Two Hands
              <span className="block text-2xl text-skyblue">One Challenge</span>
            </h1>
            <p className="text-lg text-chocolate mb-8">
              Draw shapes with both hands at the same time!
            </p>
            <button className="bg-sunshine text-chocolate px-8 py-4 rounded-full text-xl font-bold shadow-lg active:scale-95 transition-transform">
              Play Level {currentLevel}
            </button>
          </div>
        ) : (
          <div>
            <p>Game Canvas will go here</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
```

**Step 7: Test the basic setup**

```bash
npm run dev
```

Expected: Vite dev server starts, visit http://localhost:5173, see "Two Hands One Challenge" title

**Step 8: Commit**

```bash
git add src/
git commit -m "feat: create base project structure and game state"
```

---

## Task 3: Build Multi-Touch Canvas Component

**Files:**
- Create: `src/components/GameCanvas.jsx`
- Create: `src/hooks/useMultiTouch.js`

**Step 1: Create multi-touch hook**

Create `src/hooks/useMultiTouch.js`:

```javascript
import { useState, useRef, useCallback } from 'react';

export function useMultiTouch(onTouchMove, onTouchEnd) {
  const [touches, setTouches] = useState({});
  const canvasRef = useRef(null);

  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    const newTouches = {};
    for (let touch of e.changedTouches) {
      newTouches[touch.identifier] = {
        x: touch.clientX,
        y: touch.clientY,
        points: [{ x: touch.clientX, y: touch.clientY }],
      };
    }
    setTouches((prev) => ({ ...prev, ...newTouches }));
  }, []);

  const handleTouchMove = useCallback((e) => {
    e.preventDefault();
    const updatedTouches = {};
    for (let touch of e.changedTouches) {
      const existing = touches[touch.identifier];
      if (existing) {
        updatedTouches[touch.identifier] = {
          ...existing,
          x: touch.clientX,
          y: touch.clientY,
          points: [...existing.points, { x: touch.clientX, y: touch.clientY }],
        };
      }
    }
    setTouches((prev) => ({ ...prev, ...updatedTouches }));

    if (onTouchMove) {
      onTouchMove({ ...touches, ...updatedTouches });
    }
  }, [touches, onTouchMove]);

  const handleTouchEnd = useCallback((e) => {
    e.preventDefault();
    const endedTouches = {};
    for (let touch of e.changedTouches) {
      const existing = touches[touch.identifier];
      if (existing) {
        endedTouches[touch.identifier] = existing;
      }
    }
    setTouches((prev) => {
      const next = { ...prev };
      for (let id of Object.keys(endedTouches)) {
        delete next[id];
      }
      return next;
    });

    if (onTouchEnd) {
      onTouchEnd(endedTouches);
    }
  }, [touches, onTouchEnd]);

  const clearCanvas = useCallback(() => {
    setTouches({});
  }, []);

  return {
    canvasRef,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    touches,
    clearCanvas,
  };
}
```

**Step 2: Create GameCanvas component**

Create `src/components/GameCanvas.jsx`:

```javascript
import { useEffect, useRef } from 'react';
import { useMultiTouch } from '../hooks/useMultiTouch';
import { recognizeShape } from '../game/shapes';

export function GameCanvas({ level, onRecognize, onTimerEnd, timeLimit }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const timerRef = useRef(null);
  const [leftRecognized, setLeftRecognized] = useState(false);
  const [rightRecognized, setRightRecognized] = useState(false);

  const { touchHandlers, touches, clearCanvas } = useMultiTouch(
    (activeTouches) => {
      drawCanvas(activeTouches);
    },
    (endedTouches) => {
      checkShapes(endedTouches);
    }
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      ctxRef.current = canvas.getContext('2d');
      resizeCanvas();
    }
  }, []);

  useEffect(() => {
    if (leftRecognized && rightRecognized) {
      onRecognize(true);
      clearInterval(timerRef.current);
    }
  }, [leftRecognized, rightRecognized, onRecognize]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      // Timer logic handled by parent
    }, 100);
    return () => clearInterval(timerRef.current);
  }, []);

  function resizeCanvas() {
    const canvas = canvasRef.current;
    const parent = canvas.parentElement;
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
  }

  function drawCanvas(activeTouches) {
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw dividing line
    ctx.strokeStyle = '#5D4037';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(canvasRef.current.width / 2, 0);
    ctx.lineTo(canvasRef.current.width / 2, canvasRef.current.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw each touch path
    for (let [id, touch] of Object.entries(activeTouches)) {
      const isLeft = touch.x < canvasRef.current.width / 2;
      ctx.strokeStyle = isLeft ? '#FFD93D' : '#6BCB77';
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

  function checkShapes(endedTouches) {
    const touchArray = Object.entries(endedTouches);
    if (touchArray.length === 0) return;

    const canvas = canvasRef.current;

    for (let [id, touch] of touchArray) {
      const isLeft = touch.x < canvas.width / 2;
      const targetShape = isLeft ? level.left : level.right;
      const result = recognizeShape(touch.points);

      if (result && result.shape === targetShape) {
        if (isLeft) setLeftRecognized(true);
        else setRightRecognized(true);
      }
    }

    // Clear completed touches
    setTimeout(() => {
      const remaining = {};
      for (let [id, touch] of Object.entries(touches)) {
        const isLeft = touch.x < canvasRef.current.width / 2;
        if ((isLeft && !leftRecognized) || (!isLeft && !rightRecognized)) {
          remaining[id] = touch;
        }
      }
      // Only keep incomplete paths
    }, 100);
  }

  return (
    <canvas
      ref={(el) => {
        canvasRef.current = el;
        touchHandlers.ref = el;
      }}
      {...touchHandlers}
      className="w-full h-96 bg-white rounded-3xl shadow-lg border-4 border-chocolate"
    />
  );
}
```

**Step 3: Commit**

```bash
git add src/components/GameCanvas.jsx src/hooks/useMultiTouch.js
git commit -m "feat: implement multi-touch canvas component"
```

---

## Task 4: Build Game Loop and Timer

**Files:**
- Create: `src/components/GameLoop.jsx`
- Modify: `src/App.jsx`

**Step 1: Create GameLoop component**

Create `src/components/GameLoop.jsx`:

```javascript
import { useState, useEffect } from 'react';
import { useGameStore } from '../game/gameState';
import { LEVELS } from '../game/levels';
import { GameCanvas } from './GameCanvas';
import { SHAPES } from '../game/shapes';

export function GameLoop() {
  const { currentLevel, startLevel, completeLevel, failLevel, combo } = useGameStore();
  const level = LEVELS.find(l => l.id === currentLevel);
  const [timeLeft, setTimeLeft] = useState(level.time);
  const [phase, setPhase] = useState('countdown'); // 'countdown' | 'playing' | 'result'

  useEffect(() => {
    let countdown = 3;
    setPhase('countdown');

    const countdownInterval = setInterval(() => {
      countdown--;
      if (countdown <= 0) {
        clearInterval(countdownInterval);
        setPhase('playing');
        startLevel(currentLevel);
      }
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [currentLevel, startLevel]);

  useEffect(() => {
    if (phase !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(timer);
          failLevel();
          setPhase('result');
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [phase, failLevel]);

  function handleRecognize(success) {
    if (success) {
      const baseScore = 1000;
      const timeBonus = Math.floor(timeLeft * 10);
      const multiplier = combo >= 3 ? 1.5 : 1;
      const totalScore = Math.floor((baseScore + timeBonus) * multiplier);
      completeLevel(totalScore, combo >= 3);
      setPhase('result');
    }
  }

  if (phase === 'countdown') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-cream z-50">
        <div className="text-center">
          <div className="text-9xl font-extrabold text-chocolate animate-bounce">
            {Math.ceil(timeLeft)}
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'result') {
    return <ResultScreen success={timeLeft > 0} level={level} />;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center bg-white rounded-2xl p-4 shadow-md">
        <div>
          <span className="text-sm text-chocolate opacity-70">Level</span>
          <div className="text-2xl font-bold text-chocolate">{level.id}</div>
        </div>
        <div>
          <span className="text-sm text-chocolate opacity-70">Time</span>
          <div className={`text-2xl font-bold ${timeLeft < 3 ? 'text-coral' : 'text-skyblue'}`}>
            {timeLeft.toFixed(1)}s
          </div>
        </div>
        <div>
          <span className="text-sm text-chocolate opacity-70">Combo</span>
          <div className="text-2xl font-bold text-mint">{combo}x</div>
        </div>
      </div>

      {/* Target Shapes Display */}
      <div className="flex gap-4">
        <div className="flex-1 bg-sunshine rounded-2xl p-4 text-center">
          <div className="text-sm text-chocolate font-semibold mb-2">Left Hand</div>
          <div className="text-6xl">{SHAPES[level.left].icon}</div>
          <div className="text-lg font-bold text-chocolate mt-2">{SHAPES[level.left].name}</div>
        </div>
        <div className="flex-1 bg-skyblue rounded-2xl p-4 text-center">
          <div className="text-sm text-white font-semibold mb-2">Right Hand</div>
          <div className="text-6xl">{SHAPES[level.right].icon}</div>
          <div className="text-lg font-bold text-white mt-2">{SHAPES[level.right].name}</div>
        </div>
      </div>

      {/* Canvas */}
      <GameCanvas
        level={level}
        onRecognize={handleRecognize}
        timeLimit={level.time}
      />
    </div>
  );
}

function ResultScreen({ success, level }) {
  const { currentLevel, score, startLevel, failLevel } = useGameStore();

  return (
    <div className="text-center space-y-6">
      {success ? (
        <>
          <div className="text-6xl">🎉</div>
          <h2 className="text-4xl font-extrabold text-mint">LEVEL COMPLETE!</h2>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-sm text-chocolate opacity-70">Score</div>
            <div className="text-5xl font-bold text-chocolate">{score}</div>
          </div>
        </>
      ) : (
        <>
          <div className="text-6xl">😅</div>
          <h2 className="text-4xl font-extrabold text-coral">Try Again!</h2>
          <p className="text-lg text-chocolate">Keep practicing - you've got this!</p>
        </>
      )}

      <div className="flex gap-4 justify-center">
        <button
          onClick={() => startLevel(currentLevel)}
          className="bg-sunshine text-chocolate px-8 py-4 rounded-full text-xl font-bold shadow-lg active:scale-95 transition-transform"
        >
          {success ? 'Next Level' : 'Retry'}
        </button>
        {!success && (
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

**Step 2: Update App to use GameLoop**

Modify `src/App.jsx`:

```javascript
import { useGameStore } from './game/gameState';
import { LEVELS } from './game/levels';
import { GameLoop } from './components/GameLoop';

function App() {
  const { currentLevel, isPlaying, startLevel } = useGameStore();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cream">
      <div className="w-full max-w-md">
        {!isPlaying ? (
          <div className="text-center space-y-8">
            <div>
              <h1 className="text-5xl font-extrabold text-chocolate mb-2">
                Two Hands
              </h1>
              <p className="text-2xl text-skyblue font-bold">One Challenge</p>
            </div>

            <p className="text-lg text-chocolate opacity-80">
              Draw shapes with both hands at the same time!
            </p>

            <button
              onClick={() => startLevel(currentLevel)}
              className="bg-sunshine text-chocolate px-8 py-4 rounded-full text-xl font-bold shadow-lg active:scale-95 transition-transform"
            >
              Play Level {currentLevel}
            </button>

            <div className="pt-8">
              <h3 className="text-lg font-bold text-chocolate mb-4">Select Level</h3>
              <div className="grid grid-cols-5 gap-2">
                {LEVELS.map((level) => {
                  const { unlockedLevels } = useGameStore.getState();
                  const isUnlocked = level.id <= unlockedLevels;
                  return (
                    <button
                      key={level.id}
                      disabled={!isUnlocked}
                      onClick={() => startLevel(level.id)}
                      className={`aspect-square rounded-xl font-bold text-lg ${
                        isUnlocked
                          ? 'bg-mint text-chocolate'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {level.id}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <GameLoop />
        )}
      </div>
    </div>
  );
}

export default App;
```

**Step 3: Commit**

```bash
git add src/components/GameLoop.jsx src/App.jsx
git commit -m "feat: implement game loop with timer and results"
```

---

## Task 5: Add Animations and Polish

**Files:**
- Create: `src/components/Confetti.jsx`
- Modify: `src/index.css`

**Step 1: Add animation styles to index.css**

```css
/* Add to src/index.css */

@keyframes bounce-in {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-bounce-in {
  animation: bounce-in 0.5s ease-out;
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

/* Button press effect */
button:active {
  transform: scale(0.95);
}
```

**Step 2: Create simple confetti component**

Create `src/components/Confetti.jsx`:

```javascript
import { useEffect, useState } from 'react';

export function Confetti({ active }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!active) return;

    const newParticles = [];
    const colors = ['#FFD93D', '#6BCB77', '#95E1D3', '#F38181'];

    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: -10,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 5,
        speedY: Math.random() * 3 + 2,
        speedX: Math.random() * 4 - 2,
      });
    }

    setParticles(newParticles);

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            y: p.y + p.speedY,
            x: p.x + p.speedX,
          }))
          .filter((p) => p.y < 120)
      );
    }, 50);

    return () => clearInterval(interval);
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  );
}
```

**Step 3: Add confetti to ResultScreen**

Update import in `src/components/GameLoop.jsx`:

```javascript
import { Confetti } from './Confetti';
```

Add to ResultScreen return:

```javascript
<Confetti active={success} />
```

**Step 4: Commit**

```bash
git add src/components/Confetti.jsx src/index.css src/components/GameLoop.jsx
git commit -m "feat: add confetti animations and polish"
```

---

## Task 6: Mobile Optimization and Testing

**Files:**
- Create: `public/manifest.json`
- Modify: `index.html`

**Step 1: Add PWA manifest**

Create `public/manifest.json`:

```json
{
  "name": "Two Hands - One Challenge",
  "short_name": "Two Hands",
  "description": "Draw shapes with both hands simultaneously!",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FFF8E7",
  "theme_color": "#FFD93D",
  "orientation": "portrait"
}
```

**Step 2: Update index.html**

Add to `<head>`:

```html
<link rel="manifest" href="/manifest.json" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
```

**Step 3: Test on mobile devices**

```bash
npm run build
npm run preview
```

Test checklist:
- [ ] Multi-touch works on iOS Safari
- [ ] Multi-touch works on Android Chrome
- [ ] Canvas responds to both fingers
- [ ] Shape recognition is accurate
- [ ] Timer counts down correctly
- [ ] Levels unlock properly
- [ ] Confetti shows on success

**Step 4: Commit**

```bash
git add public/manifest.json index.html
git commit -m "feat: add PWA support and mobile optimization"
```

---

## Task 7: Final Polish and Deploy

**Files:**
- Create: `README.md`
- Modify: `package.json`

**Step 1: Create README**

Create `README.md`:

```markdown
# Two Hands - One Challenge 🎮

A mobile web game where you draw different shapes with both hands simultaneously!

## How to Play

1. Use two fingers (one from each hand)
2. Draw the shown shapes at the same time
3. Complete before time runs out!
4. Progress through 20 increasingly difficult levels

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Tech Stack

- React 18 + Vite
- Canvas API for multi-touch drawing
- Zustand for state management
- TailwindCSS for styling

## Game Mechanics

- 20 levels with progressive difficulty
- Real-time shape recognition
- Combo scoring system
- Playful cartoon design

Enjoy! 🎉
```

**Step 2: Update package.json scripts**

Ensure scripts section has:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

**Step 3: Final commit**

```bash
git add README.md package.json
git commit -m "docs: add README and finalize project"
```

**Step 4: Build and test final version**

```bash
npm run build
npm run preview
```

Test on actual mobile devices if possible.

**Step 5: Tag release**

```bash
git tag -a v1.0.0 -m "Initial release: Two-Handed Drawing Game"
git push origin main --tags
```

---

## Testing Checklist

Before considering the game complete:

✅ All 20 levels are playable
✅ Multi-touch works on iOS Safari
✅ Multi-touch works on Android Chrome
✅ Shape recognition (circle, square, triangle) works reliably
✅ Timer counts down accurately
✅ Score calculation is correct
✅ Combo system works
✅ Level progression unlocks correctly
✅ Confetti animation plays on success
✅ Game is responsive on different screen sizes
✅ No console errors
✅ Build production bundle and test

---

## Success Criteria Met

- ✅ 20 playable levels
- ✅ Multi-touch canvas with dual drawing
- ✅ Shape recognition engine
- ✅ Game loop with timer
- ✅ Scoring and combo system
- ✅ Playful cartoon UI
- ✅ Mobile-optimized
- ✅ PWA-ready

**Game is ready to play! 🎉**
