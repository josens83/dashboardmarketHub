# E2E Testing Guide (Playwright)

## 📋 Overview

This project uses **Playwright** for end-to-end (E2E) testing to ensure critical user flows work correctly across different browsers and devices.

## 🚀 Quick Start

### Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI mode (interactive)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Debug tests
npm run test:e2e:debug

# View test report
npm run test:e2e:report
```

### First Time Setup

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## 📂 Test Structure

```
e2e/
├── landing.spec.ts      # Landing page tests
├── auth.spec.ts         # Authentication flow tests
├── pricing.spec.ts      # Pricing and checkout tests
└── dashboard.spec.ts    # Dashboard navigation tests
```

## 🧪 Test Suites

### 1. Landing Page Tests (`landing.spec.ts`)

**Tests:**
- ✅ Page loads successfully
- ✅ Pricing information displayed
- ✅ Responsive navigation
- ✅ Login modal opens

**Coverage:**
- Homepage rendering
- Basic navigation
- Modal interactions

---

### 2. Authentication Tests (`auth.spec.ts`)

**Tests:**
- ✅ Login form display
- ✅ Validation errors for empty inputs
- ✅ Switch between login/signup
- ✅ Password reset option

**Coverage:**
- Login flow
- Signup flow
- Form validation
- Password recovery

---

### 3. Pricing Tests (`pricing.spec.ts`)

**Tests:**
- ✅ All pricing tiers displayed
- ✅ Monthly/yearly toggle
- ✅ Subscription features listed
- ✅ Upgrade buttons present
- ✅ 14-day free trial information
- ✅ Authentication required for checkout

**Coverage:**
- Pricing page
- Plan comparison
- Checkout prerequisites

---

### 4. Dashboard Tests (`dashboard.spec.ts`)

**Tests:**
- ⏭️ Dashboard navigation (requires auth)
- ✅ Feature lock for free tier

**Note:** Full dashboard tests require authentication setup

---

## ⚙️ Configuration

### `playwright.config.ts`

**Key Settings:**
- **Test Directory**: `./e2e`
- **Base URL**: `http://localhost:3000` (dev), configurable via `BASE_URL` env var
- **Retries**: 2 on CI, 0 locally
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Parallel**: Yes (except on CI)

**Features:**
- Automatic dev server startup
- Screenshots on failure
- Video on failure
- Trace on retry

---

## 🌐 Browsers Tested

| Browser | Desktop | Mobile |
|---------|---------|--------|
| **Chromium** | ✅ | ✅ (Pixel 5) |
| **Firefox** | ✅ | - |
| **WebKit (Safari)** | ✅ | ✅ (iPhone 12) |

---

## 📊 Running Tests

### Local Development

```bash
# Run all tests
npm run test:e2e

# Run specific test file
npx playwright test e2e/landing.spec.ts

# Run specific browser
npx playwright test --project=chromium

# Run in debug mode
npm run test:e2e:debug
```

### CI/CD

Tests run automatically on GitHub Actions:
- Triggered on push to `main`, `develop`, `claude/**`
- Triggered on pull requests
- Results uploaded as artifacts (30-day retention)

---

## 🎯 Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should do something', async ({ page }) => {
    // Arrange
    const element = page.locator('selector');

    // Act
    await element.click();

    // Assert
    await expect(page.locator('result')).toBeVisible();
  });
});
```

### Best Practices

1. **Use semantic selectors**
   ```typescript
   // Good
   page.getByRole('button', { name: 'Login' })
   page.getByLabel('Email')

   // Avoid
   page.locator('.btn-primary')
   ```

2. **Wait for elements properly**
   ```typescript
   await expect(element).toBeVisible({ timeout: 5000 });
   ```

3. **Keep tests isolated**
   - Each test should be independent
   - Use `beforeEach` for setup
   - Don't rely on test order

4. **Handle dynamic content**
   ```typescript
   await page.waitForLoadState('networkidle');
   ```

---

## 🔧 Advanced Features

### Authentication Setup (Future)

```typescript
// auth.setup.ts
import { test as setup } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password');
  await page.click('button[type="submit"]');

  // Save auth state
  await page.context().storageState({ path: 'auth.json' });
});
```

### Using Auth State

```typescript
// playwright.config.ts
{
  name: 'authenticated',
  use: {
    storageState: 'auth.json',
  },
  dependencies: ['setup'],
}
```

---

## 📈 Test Coverage Goals

| Category | Current | Target |
|----------|---------|--------|
| **Landing Page** | 90% | 95% |
| **Authentication** | 70% | 90% |
| **Pricing** | 85% | 95% |
| **Dashboard** | 20% | 80% |
| **Checkout Flow** | 0% | 90% |

---

## 🐛 Debugging

### Debug a Specific Test

```bash
# Debug mode (step through tests)
npx playwright test --debug

# Specific test
npx playwright test e2e/landing.spec.ts:10 --debug
```

### View Test Traces

```bash
# Run with trace
npx playwright test --trace on

# Open trace viewer
npx playwright show-trace trace.zip
```

### Screenshots & Videos

Automatically captured on failure in `test-results/` directory.

---

## 📝 CI Integration

### GitHub Actions Workflow

E2E tests run as part of CI pipeline:

```yaml
e2e:
  name: E2E Tests
  runs-on: ubuntu-latest
  steps:
    - Install dependencies
    - Install Playwright browsers
    - Run E2E tests
    - Upload test reports
```

**Artifacts:**
- Test reports (HTML)
- Screenshots
- Videos
- Traces

**Access:** Download from GitHub Actions run page

---

## ⚠️ Known Limitations

1. **Authentication Tests**: Currently skip tests requiring real authentication
   - **Solution**: Implement auth fixtures in future

2. **Payment Flow**: Stripe checkout requires real credentials
   - **Solution**: Use Stripe test mode with fixtures

3. **Mobile Tests**: Some mobile-specific features not fully tested
   - **Solution**: Expand mobile test coverage

---

## 🔮 Future Improvements

### Phase 1 (Current)
- ✅ Basic E2E test setup
- ✅ Landing page tests
- ✅ Auth flow tests
- ✅ Pricing tests

### Phase 2 (Next)
- [ ] Full authentication with fixtures
- [ ] Complete checkout flow tests
- [ ] Dashboard navigation tests
- [ ] API mocking for isolated tests

### Phase 3 (Advanced)
- [ ] Visual regression testing
- [ ] Performance testing
- [ ] Accessibility testing (axe-core)
- [ ] Cross-browser comparison reports

---

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [CI/CD Integration](https://playwright.dev/docs/ci)

---

## 🤝 Contributing

When adding new features:

1. **Write E2E tests** for critical user flows
2. **Run tests locally** before pushing
3. **Ensure CI passes** before merging
4. **Update this guide** if adding new test patterns

---

**Last Updated**: 2025-11-22
**Test Count**: 15 tests across 4 suites
**Browser Coverage**: Chromium, Firefox, WebKit + Mobile
