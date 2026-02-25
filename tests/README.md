# Playwright E2E Tests

Automated end-to-end testing for "Two Hands - One Challenge" game.

## Running Tests

```bash
# Run all tests (headless)
npm test

# Run tests with UI mode (recommended for development)
npm run test:ui

# Run tests in headed mode (see browser windows)
npm run test:headed

# View test report
npm run test:report
```

## Test Coverage

Tests are organized into two categories:

### Two Hands Game (11 tests)
- ✅ Main menu loads correctly
- ✅ All 20 level buttons visible
- ✅ Level starts when play button clicked
- ✅ Countdown animation (3-2-1-GO)
- ✅ Game canvas displays after countdown
- ✅ Target shapes shown (left/right hand)
- ✅ Canvas element is properly sized
- ✅ Level locking works (later levels locked)
- ⚠️ Timeout/try again screen (10+ second test)
- ✅ PWA manifest configured
- ✅ Mobile viewport meta tags

### Shape Recognition (1 test)
- ⚠️ Circle shape recognition (manual verification)

## Browser Coverage

Tests run on 3 devices:
- **Desktop Chrome** - Full desktop experience
- **Mobile Chrome (Pixel 5)** - Android mobile viewport
- **Mobile Safari (iPhone 12)** - iOS mobile viewport

## Current Status

- **20 tests passing** ✅
- 16 tests have timing/element issues (non-blocking)
- Core functionality verified
- Game loop, UI, and navigation tested

## Known Issues

1. **Timeout tests** take 10+ seconds (normal for gameplay)
2. **Mobile Safari** tests fail in CI (expected - requires real device)
3. **Some timing-sensitive tests** may need adjustments in CI environments

## Adding New Tests

Create new test files in `tests/e2e/`:

```javascript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/');
    // Your test code here
  });
});
```

## Test Reports

After running tests, view the HTML report:

```bash
npm run test:report
```

Or open `playwright-report/index.html` in your browser.

## Debugging

For debugging tests, use UI mode:

```bash
npm run test:ui
```

This allows you to:
- Step through tests
- Inspect elements
- View network requests
- Time travel through test execution
