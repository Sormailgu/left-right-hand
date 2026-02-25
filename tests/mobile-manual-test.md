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
