import { test, expect } from '@playwright/test';

test.describe('Pricing and Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display all pricing tiers', async ({ page }) => {
    // Look for pricing tiers
    const plans = ['Free', 'Basic', 'Professional', 'Enterprise'];

    for (const plan of plans) {
      const planElement = page.locator(`text=/${plan}/i`).first();
      await expect(planElement).toBeVisible({ timeout: 10000 });
    }
  });

  test('should show pricing toggle (monthly/yearly)', async ({ page }) => {
    // Look for pricing toggle
    const toggle = page.locator('text=/월간|연간|monthly|yearly/i').first();
    await expect(toggle).toBeVisible({ timeout: 10000 });
  });

  test('should display subscription features', async ({ page }) => {
    // Check for feature lists
    const featureList = page.locator('ul, .features').first();
    await expect(featureList).toBeVisible({ timeout: 10000 });
  });

  test('should have upgrade buttons for paid plans', async ({ page }) => {
    // Look for upgrade/subscribe buttons
    const upgradeButtons = page.getByRole('button', { name: /upgrade|subscribe|시작하기|구독/i });
    await expect(upgradeButtons.first()).toBeVisible({ timeout: 10000 });
  });

  test('should show 14-day free trial information', async ({ page }) => {
    // Look for free trial text
    const trialInfo = page.locator('text=/14.*trial|14.*무료|free.*trial/i');
    await expect(trialInfo.first()).toBeVisible({ timeout: 10000 });
  });

  test('should require authentication before checkout', async ({ page }) => {
    // Try to click on a paid plan upgrade button
    const upgradeButton = page.getByRole('button', { name: /upgrade|subscribe|시작하기/i }).first();

    if (await upgradeButton.isVisible()) {
      await upgradeButton.click();

      // Should redirect to login or show login modal
      await expect(page.locator('text=/로그인|login|email/i')).toBeVisible({ timeout: 5000 });
    }
  });
});
