import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should load the landing page successfully', async ({ page }) => {
    await page.goto('/');

    // Check if the main heading is visible
    await expect(page.locator('h1, h2').first()).toBeVisible();

    // Check if login button exists
    const loginButton = page.getByRole('button', { name: /로그인|login/i });
    await expect(loginButton).toBeVisible();
  });

  test('should display pricing information', async ({ page }) => {
    await page.goto('/');

    // Look for pricing related text
    const pricingSection = page.locator('text=/Basic|Professional|Enterprise/i').first();
    await expect(pricingSection).toBeVisible();
  });

  test('should have responsive navigation', async ({ page }) => {
    await page.goto('/');

    // Check if navigation elements exist
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
  });

  test('should allow opening login modal', async ({ page }) => {
    await page.goto('/');

    // Click on login button
    const loginButton = page.getByRole('button', { name: /로그인|login/i }).first();
    await loginButton.click();

    // Check if login modal appears
    await expect(page.locator('text=/이메일|email/i')).toBeVisible({ timeout: 5000 });
  });
});
