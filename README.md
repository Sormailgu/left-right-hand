# Two Hands - One Challenge

A challenging web game that tests your brain's ability to control both hands simultaneously! Draw different shapes with each hand at the same time - harder than it sounds!

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
- **Combo multiplier**: 2x when you have 3+ combo streak
- **20 levels total**: From easy tutorials to expert challenges

### Progression

- **Tutorial (1-5)**: Same shape both hands, learn the basics
- **Intermediate (6-10)**: Different shapes, increasing speed
- **Advanced (11-15)**: Complex shapes, directional requirements
- **Expert (16-20)**: Mirror mode, precision challenges, extreme speed

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
- **Real-time feedback**: Visual recognition as you complete each shape
- **Combo system**: Track consecutive successes
- **Level progression**: 20 carefully crafted levels
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
- [ ] Harder difficulty modes
- [ ] Tutorial animations
- [ ] Haptic feedback

---

**Challenge your brain!** 🧠✨

Made with ❤️ using React + Vite
