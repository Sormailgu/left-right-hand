# Casual Game Enhancement Design

**Date:** 2025-02-25
**Target Audience:** Casual/Family-friendly players
**Goal:** Make Two Hands - One Challenge accessible and enjoyable for all skill levels

## Problem Statement

The current game is too difficult for casual players:
- Very tight time limits (3-10 seconds)
- Unclear tutorial - Level 1 asks to "draw two shapes with both hands at the same time" without explanation
- Poor mobile UX - small touch targets, cramped canvas
- No feedback on whether drawings are correct until completion

## Design Overview

Transform the game into a casual, family-friendly experience with:
- Generous timing (25-30s for tutorials)
- Sequential tutorial mode (one shape at a time)
- Comprehensive mobile UX improvements
- Real-time and post-drawing feedback system

## 1. Difficulty & Timing Adjustments

### New Time Limits

| Difficulty | Current Time | New Time | Notes |
|------------|--------------|----------|-------|
| Tutorial (1-5) | 9-10s | 25-30s | No failure, just "Try again" |
| Intermediate (6-10) | 6-7s | 15-20s | 3s warning, +5s bonus for first shape |
| Advanced (11-15) | 4-5s | 10-15s | +3s bonus per completed shape |
| Expert (16-20) | 3-4s | 8-12s | Time extends when both hands active |

### New Mechanics

- **Time Bonus System**: Completing a shape adds +3-5 seconds
- **Grace Period**: 2-second buffer after countdown before timer starts
- **Slow-Mo on Progress**: Timer slows to 50% when one shape is recognized
- **No-Fail Mode**: Tutorial levels (1-5) can't be failed, only "completed" or "keep practicing"

## 2. Tutorial Improvements - Sequential Mode

### New Tutorial Progression

| Level | Mode | Goal | Time |
|-------|------|------|------|
| 1 | Single shape | Draw ONE circle with EITHER hand. Learn basic drawing. | No limit |
| 2 | Single shape | Draw ONE square with EITHER hand. | No limit |
| 3 | Sequential | Draw circle with LEFT hand, THEN square with RIGHT hand | 30s |
| 4 | Sequential | Draw triangle with one hand, THEN circle with other | 25s |
| 5 | Simultaneous | Draw circle with LEFT AND square with RIGHT at same time | 25s |

### Visual Guidance

- **Active Hand Highlighting**: Only the relevant side lights up during sequential mode
- **On-Screen Prompts**: "Draw LEFT shape now" / "Great! Now draw RIGHT shape"
- **Shape Preview**: Animated demo of target shape before each level
- **Progress Indicator**: Show which shape(s) remain in sequential mode

## 3. Mobile UX Improvements

### Touch Targets

- Level selector buttons: 60x60px minimum (currently ~44x44px)
- Main action buttons: 56px height minimum
- Visual feedback (scale + color change) on touch

### Canvas Enhancements

- Increase canvas height: `h-96` → `h-[60vh]` on mobile (60% of viewport)
- Add **hand guides**: Visual indicators showing where each hand should be positioned
- **Two-hand indicator**: Show visual cue when both hands are detected on screen

### Responsive Layout

**Desktop (≥768px):**
```
[Header: Level | Time | Combo]
[Left Shape Card] [Right Shape Cards]
[Canvas]
```

**Mobile (<768px):**
```
[Header: Level | Time | Combo]
[Left Shape Card]
[Canvas with Hand Guides]
[Right Shape Card]
```

### Information Hierarchy

- **Playing state**: Hide level selector, minimize combo display
- **Essential only**: Timer + target shapes + progress feedback
- **Result state**: Large, clear visual indicators with detailed breakdown

### Mobile-Specific Features

- **Haptic feedback**: Vibrate on shape recognition (with toggle in settings)
- **Orientation suggestion**: Show message suggesting optimal orientation
- **Hand detection indicator**: Visual cue when both hands are on screen

## 4. Shape Recognition Feedback System

### Real-Time Feedback (While Drawing)

**Confidence Meter:**
- Circular progress around target shape icon showing recognition %
- Updates continuously as user draws
- Color-coded: Red (0-39%), Yellow (40-69%), Green (70-100%)

**Color-Coded Stroke:**
- Drawing path changes color based on accuracy
- Green: On track (70%+ match)
- Yellow: Getting close (40-70%)
- Red: Off track (<40%)

### Post-Drawing Feedback (After Lifting Finger)

**Recognition Overlay:**
- Show expected shape outline vs actual drawing
- Side-by-side comparison with alignment

**Specific Feedback Messages:**
```
✓ Circle detected! (92% match)
✗ Triangle not recognized - try making sharper corners
```

**Shape Health Bar:**
- Visual indicator of how close each attempt was
- Shows progress toward recognition threshold

**Retry Hints:**
- "Make your circle more round"
- "Close the square completely"
- "Sharpen the triangle's corners"

## 5. Technical Architecture

### New Components

```
src/components/
├── TutorialGuide.jsx      # Sequential mode instructions
├── ConfidenceMeter.jsx    # Real-time recognition feedback
├── ShapeOverlay.jsx       # Post-drawing comparison view
├── MobileLayout.jsx       # Responsive wrapper
├── HandGuide.jsx          # Visual hand positioning guides
└── FeedbackMessage.jsx    # Specific hints and tips
```

### State Management Changes

Add to game state (`gameState.js`):

```javascript
{
  // Tutorial mode
  sequentialMode: true,           // Levels 1-4
  activeSide: 'left' | 'right' | 'both',  // Which hand to use
  tutorialStep: 1,                // Current step in sequential mode

  // Timing enhancements
  gracePeriod: false,             // In 2s grace period
  timeBonus: 0,                   // Accumulated time bonus
  slowMotionActive: false,        // Timer at 50% speed

  // Feedback system
  confidence: { left: 0, right: 0 },  // Real-time recognition %
  currentAttempt: null,           // Current drawing data
  attempts: [],                   // Track all attempts for feedback
  showFeedback: false,            // Show feedback overlay
  feedbackMessage: ''             // Current hint/tip
}
```

### Level Structure Updates

Add to levels (`levels.js`):

```javascript
{ id: 1, mode: 'single', shape: 'circle', time: 0, difficulty: 'tutorial' },
{ id: 2, mode: 'single', shape: 'square', time: 0, difficulty: 'tutorial' },
{ id: 3, mode: 'sequential', left: 'circle', right: 'square', time: 30, difficulty: 'tutorial' },
{ id: 4, mode: 'sequential', left: 'triangle', right: 'circle', time: 25, difficulty: 'tutorial' },
{ id: 5, mode: 'simultaneous', left: 'circle', right: 'square', time: 25, difficulty: 'tutorial' },
// ... rest of levels with mode: 'simultaneous'
```

### Shape Recognition Enhancements

**Confidence Threshold:**
- Tutorial: Recognize at 50% (very forgiving)
- Intermediate: Recognize at 60%
- Advanced: Recognize at 70%
- Expert: Recognize at 80% (original threshold)

**Progressive Recognition:**
- More forgiving in tutorial levels
- Adjust based on player's attempt count
- Provide specific feedback on what went wrong

**Attempt Tracking:**
```javascript
{
  shape: 'circle',
  points: [...],
  confidence: 0.82,
  recognized: true,
  timestamp: Date.now(),
  feedback: 'Great circle! Very round.'
}
```

## 6. Implementation Phases

### Phase 1: Timing & Difficulty (1-2 days)
- Update time limits in levels.js
- Implement grace period
- Add time bonus system
- Implement slow-motion on progress
- Add no-fail mode for tutorials

### Phase 2: Sequential Tutorial (2-3 days)
- Add `mode` field to level structure
- Create TutorialGuide component
- Implement active side logic
- Add visual guidance for active hand
- Update level progression logic

### Phase 3: Mobile UX (2-3 days)
- Increase touch target sizes
- Implement responsive canvas sizing
- Create MobileLayout wrapper
- Add hand guide indicators
- Implement haptic feedback (with toggle)
- Optimize information hierarchy

### Phase 4: Feedback System (3-4 days)
- Implement real-time confidence calculation
- Create ConfidenceMeter component
- Add color-coded stroke drawing
- Create ShapeOverlay component
- Implement feedback message system
- Add attempt tracking and history

### Phase 5: Polish & Testing (1-2 days)
- Test on various mobile devices
- Adjust recognition thresholds
- Refine timing based on playtesting
- Add animation polish
- Update tests for new features

**Total Estimated Time: 9-14 days**

## Success Criteria

- Tutorial completion rate > 80% (currently unknown)
- Average session length > 5 minutes (engagement)
- Player retention: 50% return after first day
- Mobile bounce rate < 30%
- Positive feedback on clarity of instructions

## Future Enhancements (Out of Scope)

- Sound effects and background music
- Leaderboard system
- Daily challenges
- Achievement system
- More shape types
- Accessibility features (screen reader, color blind modes)
