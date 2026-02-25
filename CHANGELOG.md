# Changelog

All notable changes to Two Hands - One Challenge will be documented in this file.

## [2.0.0] - 2025-02-25

### Added - Casual Game Enhancement

#### Tutorial System
- **Tutorial mode levels 1-5**: Progressive learning from single shapes to two-handed simultaneous drawing
  - Level 1-2: Single-shape practice with no time limit
  - Level 3-4: Sequential mode (draw one shape, then the other)
  - Level 5: First simultaneous challenge with generous timing
- **TutorialGuide component**: Visual instructions for each tutorial level
- **No-fail mode**: Tutorial levels show "Keep Practicing!" instead of failure
- **Hand positioning guides**: Visual indicators showing left/right drawing areas

#### Feedback System
- **Real-time confidence meter**: Circular progress indicator showing 0-100% match
- **Color-coded drawing strokes**: Red (starting) → Yellow (on track) → Green (almost there!)
- **ConfidenceMeter component**: Visual feedback for each hand's progress
- **ShapeOverlay component**: Post-drawing feedback with specific hints
- **Feedback message generator**: Context-aware tips for each shape type
  - Circle: "Try making it more round and smooth"
  - Square: "Try drawing 4 straight corners"
  - Triangle: "Draw 3 straight lines meeting at points"
  - And more...

#### Timing Enhancements
- **Grace period**: 2-second delay before timer starts (gives time to prepare)
- **Time bonus system**: +5 seconds added to timer per completed shape
- **Slow motion mode**: Timer runs at 50% speed when one shape is complete
- **Extended time limits**: 2-3x more time across all levels
  - Tutorial levels: 25-30 seconds (was 9-10 seconds)
  - Intermediate levels: 15-20 seconds (was 5-8 seconds)
  - Advanced/Expert: 8-12 seconds (was 3-6 seconds)

#### Progressive Recognition
- **Difficulty-based thresholds**: Shape recognition gets more precise as you advance
  - Tutorial: 50% threshold (very forgiving)
  - Intermediate: 60% threshold
  - Advanced: 70% threshold
  - Expert: 80% threshold
- **Real-time confidence calculation**: Updates continuously while drawing
- **Progressive feedback**: Colors and messages adapt to skill level

#### Mobile Optimization
- **MobileLayout component**: Responsive design with stacked cards on small screens
- **Larger touch targets**: All buttons minimum 60px (60% larger than before)
- **Responsive canvas**: 50vh height on mobile, 24rem on desktop
- **Haptic feedback**: Vibration on touch and shape recognition (Android devices)
- **useHapticFeedback hook**: Cross-platform haptic API
- **Touch feedback styles**: Visual feedback on button press (scale animation)

#### State Management
- **Tutorial state tracking**: `tutorialStep`, `activeSide` for sequential mode
- **Confidence tracking**: Real-time confidence for left and right hands
- **Recognition tracking**: `recognizedShapes` tracks completion separately
- **Attempt history**: Stores all drawing attempts for feedback
- **Timing state**: `gracePeriod`, `timeBonus`, `slowMotionActive`

### Changed

#### Level Structure
- **Reworked levels 1-5**: Complete redesign with tutorial mode
  - Added `mode` field: 'single', 'sequential', 'simultaneous'
  - Added `difficulty` field: 'tutorial', 'intermediate', 'advanced', 'expert'
  - Added `instruction` field: Clear guidance for each level
- **Updated timing**: All levels now have generous time limits
- **Better progression**: Smaller difficulty jumps between levels

#### User Interface
- **Main menu improvements**:
  - Added "How to Play" section with step-by-step instructions
  - Larger, more tappable level selector buttons (60px minimum)
  - Play button increased to 56px minimum height
  - Added difficulty indicator for tutorial levels
- **Game canvas improvements**:
  - Increased height on mobile (50vh vs. fixed)
  - Added hand guide overlays
  - Color-coded stroke feedback during drawing
- **Result screen improvements**:
  - Different messages for success / "keep practicing" / failure
  - Tutorial levels show encouraging feedback instead of failure

### Fixed

#### Mobile UX Issues
- Fixed small touch targets (were ~40px, now 60px minimum)
- Fixed cramped drawing area on mobile (increased to 50vh)
- Fixed layout issues on small screens (now uses stacked layout)
- Fixed lack of visual feedback during drawing (now color-coded)

#### Tutorial Experience
- Fixed unclear instructions (now has explicit TutorialGuide component)
- Fixed punishing time limits (now has 2-3x more time)
- Fixed lack of guidance (now has hand position indicators)
- Fixed discouraging failure (tutorials have no-fail mode)

#### Feedback System
- Fixed lack of real-time feedback (now has confidence meter)
- Fixed generic recognition (now has progressive thresholds)
- Fixed no improvement hints (now has shape-specific tips)

### Technical Changes

#### New Files Created
- `src/components/TutorialGuide.jsx` - Tutorial instructions display
- `src/components/ConfidenceMeter.jsx` - Real-time confidence visualization
- `src/components/ShapeOverlay.jsx` - Post-drawing feedback overlay
- `src/components/MobileLayout.jsx` - Responsive layout wrapper
- `src/components/HandGuide.jsx` - Hand position indicators
- `src/hooks/useHapticFeedback.js` - Haptic feedback abstraction
- `src/utils/feedbackGenerator.js` - Shape-specific hint generation
- `tests/mobile-manual-test.md` - Mobile testing checklist

#### Modified Files
- `src/game/levels.js` - Added tutorial modes and generous timing
- `src/game/gameState.js` - Extended state for tutorial and feedback
- `src/game/shapes.js` - Added progressive confidence calculation
- `src/components/GameCanvas.jsx` - Real-time confidence updates and haptic feedback
- `src/components/GameLoop.jsx` - Grace period, slow motion, tutorial integration
- `src/App.jsx` - Improved menu UX and larger touch targets
- `src/index.css` - Touch feedback styles and mobile optimizations
- `tailwind.config.js` - Added custom height classes for canvas
- `README.md` - Updated with casual mode features
- `CHANGELOG.md` - This file!

### Performance Improvements
- Optimized real-time confidence calculation (runs at 60fps)
- Reduced re-renders in canvas component
- Efficient state updates for confidence tracking

### Testing
- Added comprehensive mobile test checklist
- Verified multi-touch handling on iOS and Android
- Tested responsive behavior across device sizes
- Validated accessibility improvements (touch targets, contrast)

---

## [1.0.0] - Initial Release

### Features
- Multi-touch canvas drawing
- Shape recognition (circles, squares, triangles, stars, hearts, diamonds)
- 20 levels with increasing difficulty
- Combo system and scoring
- PWA support
- Basic mobile support
- Playwright E2E tests
