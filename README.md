# Two Hands - One Challenge

A fun, accessible web game that tests your brain's ability to control both hands simultaneously! Draw different shapes with each hand at the same time - now with casual mode for family-friendly play!

## 🎮 How to Play

1. **Select a level** - Start with Level 1 (tutorial mode)
2. **Watch the countdown** - Get ready as it counts 3-2-1-GO!
3. **Draw with both hands** - Use two fingers (or one on each hand):
   - **Left side**: Draw the yellow shape
   - **Right side**: Draw the blue shape
4. **Beat the timer** - Complete both shapes before time runs out!
5. **Build combos** - Complete 3+ levels in a row for 2x score multiplier

### Game Mechanics

- **Base score**: 1000 points per level
- **Time bonus**: +10 points for each second remaining
- **Shape bonus**: +5 seconds added to timer per completed shape
- **Combo multiplier**: 2x when you have 3+ combo streak
- **Grace period**: 2 seconds before timer starts (get ready!)
- **Slow motion**: Timer runs at 50% when one shape is complete
- **20 levels total**: From beginner tutorials to expert challenges

### Progression

- **Tutorial (1-5)**: Single-shape and sequential learning, no time pressure
- **Intermediate (6-10)**: Different shapes, generous timing
- **Advanced (11-15)**: Complex shapes, directional requirements
- **Expert (16-20)**: Mirror mode, precision challenges

## 🌟 Casual Mode Features

### Enhanced Tutorial System
- **Level 1-2**: Draw single shapes with no time limit
- **Level 3-4**: Sequential mode - one shape at a time with clear guidance
- **Level 5**: First simultaneous drawing challenge (25 seconds)
- **No-fail mode**: Tutorial levels encourage learning without punishment
- **Progressive difficulty**: Each level builds naturally on previous skills

### Accessibility Improvements
- **Generous timing**: 25-30 seconds for tutorial levels (vs. 9-10s before)
- **Forgiving recognition**: 50% confidence threshold in tutorials
- **Real-time feedback**: Color-coded strokes show how you're doing
- **Specific hints**: Context-aware tips for each shape type
- **Grace period**: 2-second buffer before timer starts
- **Time bonus**: +5 seconds added per completed shape
- **Slow motion**: Timer slows to 50% speed when one shape is complete

### Mobile Optimization
- **Larger touch targets**: 60px minimum for all buttons
- **Responsive canvas**: 50vh height on mobile, 24rem on desktop
- **Stacked layout**: Shape cards stack vertically on small screens
- **Hand guides**: Visual indicators showing where to draw
- **Haptic feedback**: Vibration on supported devices (Android)
- **No accidental zoom**: Optimized touch handling

### Feedback System
- **Real-time confidence meter**: Circular progress indicator (0-100%)
- **Color-coded strokes**: Red (getting started) → Yellow (on track) → Green (almost there!)
- **Post-drawing feedback**: Overlay with specific hints and encouragement
- **Shape-specific tips**: Tailored advice for circles, squares, triangles, etc.
- **Progressive thresholds**: Recognition gets stricter as you advance (50% → 80%)

## 🛠️ Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Canvas API** - Drawing surface
- **Touch Events API** - Multi-touch support
- **Custom Shape Recognition** - Geometric algorithm

## 📦 Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd left-right-hand

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run E2E tests
npm test

# Run tests with UI
npm run test:ui
```

## 🧪 Testing

The project includes automated E2E tests using Playwright:

```bash
# Run all tests headlessly
npm test

# Run tests with UI mode (recommended for development)
npm run test:ui

# Run tests in headed mode
npm run test:headed

# View test report
npm run test:report
```

**Test Coverage:**
- ✅ Main menu and navigation
- ✅ Level selection and progression
- ✅ Game loop and countdown
- ✅ Canvas rendering and multi-touch
- ✅ PWA manifest and mobile viewport
- ✅ Shape recognition basics

Tests run on Chromium, Mobile Chrome, and Mobile Safari.

See [tests/README.md](tests/README.md) for detailed testing documentation.

## 🚀 Deployment

The game is production-ready and can be deployed to any static hosting service:

- **Netlify**: `npm run build` and deploy the `dist` folder
- **Vercel**: Connect your repo and auto-deploy
- **GitHub Pages**: Use `npm run build` and push `dist` folder
- **Any static host**: Upload the `dist` folder contents

## 📱 PWA Support

The game includes Progressive Web App support:

- Installable on mobile devices
- Works offline (once loaded)
- Optimized for touch and multi-touch
- Portrait orientation locked
- Fullscreen experience

## 🎨 Features

- **Multi-touch canvas**: Draw with both hands simultaneously
- **Shape recognition**: Detects circles, squares, triangles, stars, hearts, diamonds
- **Real-time confidence feedback**: Color-coded strokes show progress (red/yellow/green)
- **Progressive difficulty**: 50% recognition threshold in tutorials, 80% in expert
- **Tutorial mode**: Step-by-step learning from single shapes to two-handed play
- **Generous timing**: Grace periods, time bonuses, and slow motion
- **No-fail tutorials**: Encouraging feedback without punishment
- **Combo system**: Track consecutive successes
- **Level progression**: 20 carefully crafted levels
- **Mobile-optimized**: Large touch targets, responsive layout, haptic feedback
- **Hand positioning guides**: Visual indicators for left/right drawing areas
- **Confetti celebrations**: Reward animations for success
- **Responsive design**: Works on phones, tablets, and desktops
- **PWA ready**: Install as an app on mobile devices

## 🧠 The Science

This game is based on **corpus callosum research** - the brain structure that connects left and right hemispheres. Drawing different shapes with each hand simultaneously challenges your brain's ability to:

- Process independent motor commands
- Coordinate bilateral movements
- Overcome neural interference between hemispheres

Regular practice can improve:
- Bimanual coordination
- Brain plasticity
- Motor cortex efficiency
- Focus and concentration

## 📄 License

MIT License - feel free to use and modify!

## 🤝 Contributing

Contributions welcome! Areas for improvement:

- Additional shape types
- More levels and challenges
- Sound effects and music
- Leaderboards
- Multiplayer mode
- Accessibility features

## 🎯 Future Enhancements

- [ ] Sound effects and background music
- [ ] Leaderboard system
- [ ] Daily challenges
- [ ] Achievement system
- [ ] More shape types
- [ ] Harder difficulty modes (for players who want challenge!)
- [ ] Animated tutorial demonstrations
- [ ] Voice guidance for accessibility

---

**Challenge your brain!** 🧠✨

Made with ❤️ using React + Vite
