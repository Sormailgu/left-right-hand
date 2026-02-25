# Two-Handed Drawing Game - Design Document

**Date:** 2025-02-25
**Team:** BA, Game Designer, Senior Game Developer, QA
**Platform:** Mobile Web App (iOS/Android browsers)

---

## Game Overview

A mobile web game where players must draw different shapes with both hands simultaneously. The game tests hand independence, coordination, and speed through 20 progressively challenging levels.

### Core Concept
- **Input:** Multi-touch canvas - left finger and right finger draw simultaneously
- **Challenge:** Complete both target shapes within the time limit
- **Progression:** Linear unlock system with 20 levels
- **Style:** Playful cartoon aesthetics with bouncy animations

---

## Core Gameplay Loop

1. **Level Start:** Display target shapes (e.g., "Left: Circle | Right: Square")
2. **Countdown:** 3-second animated countdown (3-2-1-GO!)
3. **Drawing Phase:**
   - Multi-touch canvas activates
   - Timer counts down (5-10 seconds depending on level)
   - Real-time shape recognition feedback
4. **Result:**
   - **Success:** Score calculated, combo updated, next level unlocks
   - **Failure:** Option to retry or continue (lose streak)

### Scoring System
- Base score: 1000 points per level
- Time bonus: +10 points per remaining second
- Accuracy bonus: +500 for perfect recognition (no partial matches)
- Combo multiplier: 1.5x for 3+ consecutive perfect levels

---

## Technical Architecture

### Tech Stack
- **Framework:** React 18 + Vite (fast development, optimized mobile builds)
- **Rendering:** HTML5 Canvas API for drawing and touch tracking
- **Styling:** TailwindCSS for playful cartoon UI
- **State Management:** Zustand (lightweight, fast updates)
- **Build Tool:** Vite (rapid HMR, optimized production bundles)

### Project Structure
```
src/
├── App.jsx                    # Main app, routing
├── components/
│   ├── GameCanvas.jsx         # Multi-touch canvas, gesture tracking
│   ├── ShapeRecognizer.jsx    # Shape detection algorithms
│   ├── GameUI.jsx             # Score, timer, level display
│   ├── LevelCard.jsx          # Level selection screen
│   ├── ResultScreen.jsx       # Win/lose feedback
│   └── Countdown.jsx          # 3-2-1 GO animation
├── game/
│   ├── levels.js              # Level definitions and progression
│   ├── shapes.js              # Shape templates and validation
│   └── gameState.js           # Global state management
├── hooks/
│   ├── useMultiTouch.js       # Touch event handling
│   └── useShapeRecognition.js # Shape detection logic
└── styles/
    └── cartoon.css            # Playful fonts, colors, animations
```

---

## Shape Recognition System

### Detection Algorithms

**Circle Detection:**
1. Calculate bounding box center as potential center point
2. Measure average radius from center to all points
3. Calculate variance from ideal circle
4. Pass if variance < 20% of radius

**Square/Rectangle Detection:**
1. Detect corners: points with sharp direction changes (> 30°)
2. Validate 4 corners
3. Check opposite sides are roughly parallel
4. Validate corner angles are ~90°

**Triangle Detection:**
1. Detect 3 corners using direction change analysis
2. Validate corner angles sum to ~180°
3. Check closure (end point near start point)

**Line Detection:**
1. Calculate distance from start to end point
2. Compare to total path length
3. Pass if path is > 80% of direct distance

### Validation Rules
- **Minimum path length:** 50 pixels (avoid accidental taps)
- **Closure requirement:** Shapes must loop back near start point
- **Touch tracking:** Support up to 5 simultaneous touch points (future-proofing)
- **Confidence threshold:** 70% minimum to recognize shape

---

## Level Design (20 Levels)

### Tutorial (Levels 1-5)
- Same shape both hands
- 10 seconds
- Shapes: circle, square
- Goal: Teach multi-touch drawing

### Intermediate (Levels 6-10)
- Different shapes each hand
- 7 seconds
- Shapes: + triangle, rectangle
- Introduces hand independence

### Advanced (Levels 11-15)
- Complex shapes: star, heart, diamond
- 5 seconds
- Direction requirements (clockwise/counter-clockwise)
- Tests speed and precision

### Expert (Levels 16-20)
- Mirror challenges (symmetric shapes)
- 3-4 seconds
- Precision mode (must stay within guide lines)
- Ultimate coordination test

---

## Visual Design: Playful Cartoon Style

### Color Palette
- **Background:** Soft cream `#FFF8E7`
- **Left hand zone:** Sunshine yellow `#FFD93D`
- **Right hand zone:** Sky blue `#6BCB77`
- **Success:** Mint green `#95E1D3`
- **Failure:** Coral pink `#F38181`
- **Text:** Chocolate brown `#5D4037`

### Typography
- **Headings:** Nunito or Quicksand (rounded, friendly font)
- **Body:** System fonts with fallback to sans-serif
- **Touch targets:** Minimum 44px (mobile best practice)

### Animations
- **Transitions:** Spring physics (bouncy, playful)
- **Success:** Confetti particle explosion
- **Failure:** Shake animation with sad face
- **Countdown:** Scale-in with bounce (3 → 2 → 1 → GO!)
- **Progress:** Smooth fill animations on shape borders

---

## User Interface Flow

### Main Menu
- Game title with animated logo
- "Play" button (start current level)
- "Select Level" button (level picker)
- Current level display

### Level Selection
- Grid of 20 level cards
- Locked levels show padlock icon
- Completed levels show star rating (1-3 stars)
- Current level highlighted

### Game Screen
- Top bar: Level number, timer (counting down), score
- Center: Split canvas (left/right zones marked)
- Bottom: Target shapes display with mini previews
- Pause button (top right)

### Result Screen
**Success:**
- Large "LEVEL COMPLETE!" message
- Score breakdown with animated numbers
- Stars awarded
- "Next Level" and "Replay" buttons

**Failure:**
- Encouraging "Try Again!" message
- What went wrong hint
- "Retry" and "Continue" buttons

---

## Technical Requirements

### Performance Targets
- 60 FPS on all modern mobile devices
- < 100ms touch-to-visual feedback latency
- < 3 second initial page load
- Touch sampling rate: Match device refresh rate

### Browser Support
- iOS Safari 12+
- Chrome Mobile (Android 8+)
- Samsung Internet
- Progressive Web App (PWA) ready for offline play

### Accessibility
- High contrast mode option
- Adjustable time limit (accessibility setting)
- Touch target sizes meet WCAG 2.1 AAA
- Clear visual feedback for all actions

---

## Success Metrics

### MVP Goals
✅ 20 playable levels with smooth progression
✅ Reliable shape recognition (> 95% accuracy)
✅ 60 FPS performance on mid-range devices
✅ Engaging difficulty curve (players complete level 10)

### Post-Launch Metrics
- Level completion rate per level (identify difficulty spikes)
- Average session length
- Replay rate (players replaying completed levels)
- Share rate (if social features added)

---

## Future Enhancements (Post-MVP)

1. **Multiplayer Mode:** Race against friends in real-time
2. **Daily Challenges:** Special levels with leaderboard
3. **Custom Levels:** Players create and share challenges
4. **Achievement System:** Badges for milestones
5. **Sound Effects & Music:** Toggle-able audio feedback
6. **More Shapes:** Infinity symbol, spiral, alphabet letters

---

## Development Timeline Estimate

- **Phase 1:** Project setup + basic canvas (2 hours)
- **Phase 2:** Shape recognition engine (3 hours)
- **Phase 3:** Game loop + level system (2 hours)
- **Phase 4:** UI + visual polish (2 hours)
- **Phase 5:** Testing + mobile optimization (1 hour)

**Total:** ~10 hours for playable MVP

---

*Design approved by: BA, Game Designer, Senior Developer, QA*
*Ready for implementation planning →*
