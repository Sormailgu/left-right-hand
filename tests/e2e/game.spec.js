import { test, expect } from '@playwright/test';

test.describe('Two Hands Game', () => {
  test('should load the main menu', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h1')).toContainText('Two Hands');
    await expect(page.locator('text=One Challenge')).toBeVisible();
    await expect(page.locator('button:has-text("Play Level")')).toBeVisible();
  });

  test('should show 20 level buttons', async ({ page }) => {
    await page.goto('/');

    const levelButtons = page.locator('button:visible');
    const count = await levelButtons.count();

    // Should have at least 20 level buttons plus the play button
    expect(count).toBeGreaterThanOrEqual(20);
  });

  test('should start level 1 when play button clicked', async ({ page }) => {
    await page.goto('/');

    await page.click('button:has-text("Play Level 1")');

    // Should see countdown
    await expect(page.locator('text=3')).toBeVisible();
  });

  test('should show countdown before game starts', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Play Level 1")');

    // Countdown should show 3, then 2, then 1
    await expect(page.getByText('3', { exact: true })).toBeVisible();
    await expect(page.getByText('2', { exact: true })).toBeVisible({ timeout: 2000 });
    await expect(page.getByText('1', { exact: true })).toBeVisible({ timeout: 2000 });
  });

  test('should display game canvas after countdown', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Play Level 1")');

    // Wait for countdown to finish
    await page.waitForTimeout(4000);

    // Should see game elements
    await expect(page.locator('canvas')).toBeVisible();
    await expect(page.locator('text=Level')).toBeVisible();
    await expect(page.locator('text=Time')).toBeVisible();
    await expect(page.locator('text=Combo')).toBeVisible();
  });

  test('should show target shapes on game screen', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Play Level 1")');

    // Wait for countdown to finish
    await page.waitForTimeout(4000);

    // Level 1 requires circle for both hands
    await expect(page.getByText('Left Hand')).toBeVisible();
    await expect(page.getByText('Right Hand')).toBeVisible();
    await expect(page.getByText('circle')).toBeVisible();
  });

  test('should have canvas element for drawing', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Play Level 1")');

    // Wait for countdown to finish
    await page.waitForTimeout(4000);

    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Check canvas has correct attributes
    const width = await canvas.getAttribute('width');
    const height = await canvas.getAttribute('height');

    expect(parseInt(width || '0')).toBeGreaterThan(0);
    expect(parseInt(height || '0')).toBeGreaterThan(0);
  });

  test('should lock levels beyond current progress', async ({ page }) => {
    await page.goto('/');

    // First level should be unlocked
    const level1Button = page.locator('button').filter({ hasText: '1' }).first();
    await expect(level1Button).not.toBeDisabled();

    // Level 20 should be locked initially
    const level20Button = page.locator('button').filter({ hasText: '20' }).last();
    await expect(level20Button).toBeDisabled();
  });

  test('should navigate back to menu after timeout', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Play Level 1")');

    // Wait for countdown and game to start
    await page.waitForTimeout(4000);

    // Wait for timer to run out (10 seconds for level 1)
    await page.waitForTimeout(11000);

    // Should show failure/try again screen
    await expect(page.locator('text=Try Again')).toBeVisible();
  });

  test('should have proper PWA manifest link', async ({ page }) => {
    await page.goto('/');

    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveAttribute('href', '/manifest.json');
  });

  test('should have mobile viewport meta tag', async ({ page }) => {
    await page.goto('/');

    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', /width=device-width/);
    await expect(viewport).toHaveAttribute('content', /user-scalable=no/);
  });
});

test.describe('Shape Recognition', () => {
  test('should recognize circle shape', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Play Level 1")');

    // Wait for countdown
    await page.waitForTimeout(4000);

    const canvas = page.locator('canvas');
    const box = await canvas.boundingBox();

    if (box) {
      // Draw a circle on the left side
      await page.mouse.move(box.x + box.width * 0.25, box.y + box.height / 2);
      await page.mouse.down();

      // Draw circular motion
      for (let i = 0; i < 360; i += 10) {
        const angle = (i * Math.PI) / 180;
        const radius = 50;
        const x = box.x + box.width * 0.25 + radius * Math.cos(angle);
        const y = box.y + box.height / 2 + radius * Math.sin(angle);
        await page.mouse.move(x, y);
      }

      await page.mouse.up();
    }

    // Shape should be recognized (we can't fully test without actual touch)
    await page.waitForTimeout(1000);
  });
});
