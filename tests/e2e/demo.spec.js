import { test } from '@playwright/test';

test.use({ headless: false, viewport: { width: 1280, height: 720 } });

test('Game Demo - How to Play', async ({ page }) => {
  console.log('🎮 GAME DEMO: How to Play "Two Hands - One Challenge"');

  // 1. Main Menu
  console.log('\n📍 STEP 1: Main Menu');
  await page.goto('/');
  console.log('   - See "Two Hands" title');
  console.log('   - 20 level buttons (only level 1 unlocked)');
  console.log('   - "Play Level 1" button');
  await page.screenshot({ path: 'demo-1-menu.png' });
  await page.waitForTimeout(4000);

  // 2. Start Level 1
  console.log('\n▶️ STEP 2: Starting Level 1');
  await page.click('button:has-text("Play Level 1")');
  console.log('   - Countdown begins: 3... 2... 1... GO!');
  await page.waitForTimeout(6000);

  // 3. Game Screen
  console.log('\n🎮 STEP 3: Game Screen');
  console.log('   - TOP: Level # | Timer | Combo');
  console.log('   - LEFT CARD: Yellow - Draw Circle with left hand');
  console.log('   - RIGHT CARD: Green - Draw Circle with right hand');
  console.log('   - CENTER: Canvas with dashed dividing line');
  console.log('   - Use TWO fingers to draw both shapes at once!');
  await page.screenshot({ path: 'demo-2-game.png' });
  await page.waitForTimeout(5000);

  // 4. Timer Running
  console.log('\n⏱️ STEP 4: Timer Running');
  console.log('   - Timer counting down from 10 seconds');
  console.log('   - Draw circles in both zones simultaneously');
  console.log('   - Yellow zone (left) | Green zone (right)');
  await page.waitForTimeout(4000);

  // 5. Result Screen
  console.log('\n⏰ STEP 5: Time\'s Up!');
  await page.waitForTimeout(2000);
  console.log('   - Shows "Try Again" or "Next Level"');
  console.log('   - Would show score and confetti if completed');
  await page.screenshot({ path: 'demo-3-result.png' });
  await page.waitForTimeout(3000);

  // 6. Try Again
  console.log('\n🔄 STEP 6: Try Again');
  await page.click('button:has-text("Retry")');
  console.log('   - Click "Retry" to practice the level');
  await page.waitForTimeout(5000);

  // 7. Back to Menu
  console.log('\n🏠 STEP 7: Level Selection');
  await page.goto('/');
  console.log('   - Click any level number to play it');
  console.log('   - Green buttons = unlocked');
  console.log('   - Gray buttons = locked (complete previous levels first)');
  await page.screenshot({ path: 'demo-4-levels.png' });
  await page.waitForTimeout(4000);

  console.log('\n✅ DEMO COMPLETE!');
  console.log('\n🎮 HOW TO PLAY:');
  console.log('1. Click "Play Level 1" or select a level');
  console.log('2. Wait for 3-2-1-GO! countdown');
  console.log('3. Use TWO fingers - one for each hand');
  console.log('4. Draw the LEFT shape in the YELLOW zone');
  console.log('5. Draw the RIGHT shape in the GREEN zone');
  console.log('6. Complete BOTH shapes before time runs out!');
  console.log('7. Build combos for 2x score multiplier');
  console.log('8. Progress through 20 increasingly hard levels');

  console.log('\n💡 TIP: This game challenges your brain!');
  console.log('   Drawing different shapes with each hand simultaneously');
  console.log('   tests your bilateral coordination and focus!');

  await page.waitForTimeout(5000);
});
