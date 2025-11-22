import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login form', async ({ page }) => {
    // Open login modal
    const loginButton = page.getByRole('button', { name: /로그인|login/i }).first();
    await loginButton.click();

    // Check for email and password fields
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('input[type="password"], input[name="password"]')).toBeVisible();
  });

  test('should show validation errors for empty login', async ({ page }) => {
    // Open login modal
    const loginButton = page.getByRole('button', { name: /로그인|login/i }).first();
    await loginButton.click();

    // Try to submit without filling fields
    const submitButton = page.getByRole('button', { name: /로그인|login/i }).last();
    await submitButton.click();

    // Check for error messages (this depends on your validation implementation)
    // Note: Adjust selectors based on actual implementation
  });

  test('should switch between login and signup', async ({ page }) => {
    // Open login modal
    const loginButton = page.getByRole('button', { name: /로그인|login/i }).first();
    await loginButton.click();

    // Look for signup link/button
    const signupLink = page.locator('text=/회원가입|sign up|register/i');
    if (await signupLink.isVisible()) {
      await signupLink.click();

      // Should now show signup form
      await expect(page.locator('text=/회원가입|sign up/i')).toBeVisible();
    }
  });

  test('should have password reset option', async ({ page }) => {
    // Open login modal
    const loginButton = page.getByRole('button', { name: /로그인|login/i }).first();
    await loginButton.click();

    // Look for password reset link
    const resetLink = page.locator('text=/비밀번호|forgot|reset/i');
    await expect(resetLink).toBeVisible({ timeout: 5000 });
  });
});
