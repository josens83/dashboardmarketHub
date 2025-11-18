# Production Readiness Roadmap

## 🎯 목표: 35% → 85% Production Ready

### Phase 1: Critical Blockers (1-2 Weeks) - 출시 차단 요소
**Priority: URGENT**

#### 1.1 Payment Integration
**Status:** ❌ FAKE (setTimeout mock)
**Impact:** Cannot generate revenue
**Effort:** 3 days

**Tasks:**
- [ ] Install Stripe SDK (`@stripe/stripe-js`, `stripe`)
- [ ] Create Stripe Checkout Sessions
- [ ] Implement webhook handling (`/api/webhooks/stripe`)
- [ ] Handle subscription lifecycle events
- [ ] Add invoice generation
- [ ] Test payment flow end-to-end

**Files to modify:**
- `src/features/subscription/CheckoutPage.tsx`
- Create: `src/shared/lib/stripe/client.ts`
- Create: `src/shared/lib/stripe/webhooks.ts`

**Code example:**
```typescript
import { loadStripe } from '@stripe/stripe-js';

const stripe = await loadStripe(process.env.VITE_STRIPE_PUBLISHABLE_KEY);
const { error } = await stripe.redirectToCheckout({
  sessionId: session.id
});
```

---

#### 1.2 Email Service
**Status:** ❌ MISSING
**Impact:** Cannot send password resets, receipts, invites
**Effort:** 2 days

**Tasks:**
- [ ] Choose service (Resend recommended for Next.js/React)
- [ ] Install SDK
- [ ] Create email templates (welcome, password reset, receipt)
- [ ] Implement transactional email functions
- [ ] Add email verification flow
- [ ] Test email delivery

**Recommended:**
```bash
npm install resend
```

**Files to create:**
- `src/shared/lib/email/client.ts`
- `src/shared/lib/email/templates/`

---

#### 1.3 Error Tracking (Sentry)
**Status:** ⚠️ Custom only (not production-grade)
**Impact:** Cannot debug production issues
**Effort:** 1 day

**Tasks:**
- [ ] Create Sentry account
- [ ] Install Sentry SDK
- [ ] Configure Vite plugin for source maps
- [ ] Add error boundaries with Sentry reporting
- [ ] Test error capture
- [ ] Set up alerts

```bash
npm install @sentry/react @sentry/vite-plugin
```

**Files to modify:**
- `vite.config.ts`
- `src/main.tsx`
- `src/shared/components/ErrorBoundary.tsx`

---

#### 1.4 Testing Framework
**Status:** ❌ ZERO tests
**Impact:** Cannot ensure quality
**Effort:** 3 days

**Tasks:**
- [ ] Install Vitest + Testing Library
- [ ] Configure test environment
- [ ] Write unit tests for critical components
- [ ] Write integration tests for auth flow
- [ ] Install Playwright for E2E
- [ ] Write E2E tests for checkout flow
- [ ] Add test coverage reporting

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D @playwright/test
```

**Files to create:**
- `vitest.config.ts`
- `playwright.config.ts`
- `src/**/*.test.tsx` (test files)

---

#### 1.5 CI/CD Pipeline
**Status:** ❌ MISSING
**Impact:** Manual deployments, no automation
**Effort:** 2 days

**Tasks:**
- [ ] Create GitHub Actions workflow
- [ ] Add build step
- [ ] Add test step
- [ ] Add lint step
- [ ] Add deployment step (Vercel/Netlify)
- [ ] Set up environment secrets
- [ ] Configure branch protection

**Files to create:**
- `.github/workflows/ci.yml`
- `.github/workflows/deploy.yml`

**Example CI workflow:**
```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run test
      - run: npm run build
```

---

### Phase 2: Security & Scale (2-3 Weeks) - 보안 및 확장성

#### 2.1 Two-Factor Authentication (2FA)
**Status:** ❌ MISSING
**Impact:** Security vulnerability
**Effort:** 3 days

**Tasks:**
- [ ] Enable Supabase Auth MFA
- [ ] Create 2FA enrollment UI
- [ ] Implement TOTP verification
- [ ] Add backup codes
- [ ] Add "remember this device" option
- [ ] Update AuthContext with MFA support

**Code example:**
```typescript
// Enable MFA for user
const { data, error } = await supabase.auth.mfa.enroll({
  factorType: 'totp',
  friendlyName: 'My Authenticator App'
});

// Verify TOTP code
const { data: verifyData, error: verifyError } =
  await supabase.auth.mfa.verify({
    factorId: factor.id,
    challengeId: challenge.id,
    code: userInputCode
  });
```

---

#### 2.2 Proper RBAC System
**Status:** ⚠️ HARDCODED (admin emails in code)
**Impact:** Cannot scale team permissions
**Effort:** 4 days

**Tasks:**
- [ ] Design permission matrix
- [ ] Create roles table in Supabase
- [ ] Create permissions table
- [ ] Implement RLS policies for role-based access
- [ ] Create RBAC hook (`usePermissions`)
- [ ] Replace hardcoded admin checks
- [ ] Add role management UI

**Current problem:**
```typescript
// AdminDashboard.tsx - HARDCODED
const isAdmin = user && ['admin@example.com'].includes(user.email);
```

**Proper solution:**
```typescript
// usePermissions.ts
const { hasPermission } = usePermissions();
const canAccessAdmin = hasPermission('admin.access');
```

---

#### 2.3 Rate Limiting
**Status:** ❌ MISSING
**Impact:** API abuse, DoS vulnerability
**Effort:** 2 days

**Tasks:**
- [ ] Install rate limiting library
- [ ] Implement client-side rate limiting
- [ ] Add Supabase Edge Functions with rate limits
- [ ] Configure rate limits per plan tier
- [ ] Add rate limit headers to responses
- [ ] Create rate limit exceeded error UI

```bash
npm install @upstash/ratelimit @upstash/redis
```

---

#### 2.4 Skeleton Loaders
**Status:** ❌ MISSING (searched entire codebase: 0 found)
**Impact:** Poor loading UX (like Netflix/Linear)
**Effort:** 2 days

**Tasks:**
- [ ] Install react-loading-skeleton
- [ ] Create skeleton components for each data type
- [ ] Replace `<LoadingSpinner>` with skeletons
- [ ] Add skeleton for tables, cards, charts
- [ ] Implement progressive loading

```bash
npm install react-loading-skeleton
```

**Example:**
```typescript
import Skeleton from 'react-loading-skeleton';

{isLoading ? (
  <Skeleton count={5} height={80} />
) : (
  data.map(item => <Card key={item.id} {...item} />)
)}
```

---

#### 2.5 Analytics Integration
**Status:** ❌ MISSING (VITE_GA_TRACKING_ID exists but not implemented)
**Impact:** Cannot measure user behavior
**Effort:** 2 days

**Tasks:**
- [ ] Choose analytics (PostHog recommended)
- [ ] Install SDK
- [ ] Track page views
- [ ] Track custom events (signup, upgrade, export)
- [ ] Create analytics dashboard
- [ ] Set up conversion funnels

```bash
npm install posthog-js
```

---

### Phase 3: User Experience (3-4 Weeks) - 사용자 경험

#### 3.1 Internationalization (i18n)
**Status:** ❌ ALL KOREAN HARDCODED
**Impact:** Cannot serve international users
**Effort:** 5 days

**Tasks:**
- [ ] Install react-i18next
- [ ] Extract all Korean strings to translation files
- [ ] Create English translations
- [ ] Add language switcher
- [ ] Handle date/number formatting
- [ ] Test RTL languages

```bash
npm install react-i18next i18next
```

---

#### 3.2 File Upload System
**Status:** ❌ MISSING (AWS_S3 in .env but not used)
**Impact:** Cannot upload reports, logos, data files
**Effort:** 3 days

**Tasks:**
- [ ] Set up Supabase Storage buckets
- [ ] Create upload component with drag-drop
- [ ] Add file validation (type, size)
- [ ] Implement image optimization
- [ ] Add progress indicators
- [ ] Create file management UI

---

#### 3.3 Live Chat Support
**Status:** ❌ MISSING
**Impact:** Poor customer support experience
**Effort:** 1 day (integration)

**Tasks:**
- [ ] Choose provider (Intercom, Crisp, or Zendesk)
- [ ] Install widget
- [ ] Configure chat routing
- [ ] Add user context to chats
- [ ] Set up automated responses

```bash
npm install react-live-chat-loader
```

---

#### 3.4 Help Center & Documentation
**Status:** ⚠️ Only FAQ page exists
**Impact:** Users cannot self-serve
**Effort:** 5 days (content creation)

**Tasks:**
- [ ] Set up documentation platform (GitBook, Docusaurus)
- [ ] Write getting started guide
- [ ] Create video tutorials
- [ ] Add searchable help center
- [ ] Create changelog page
- [ ] Add in-app help tooltips

---

#### 3.5 Advanced Keyboard Shortcuts
**Status:** ⚠️ Only Cmd+K implemented
**Impact:** Power users cannot work efficiently
**Effort:** 2 days

**Tasks:**
- [ ] Install react-hotkeys-hook
- [ ] Implement shortcuts (see table below)
- [ ] Create shortcuts help modal (? key)
- [ ] Add visual indicators for shortcuts
- [ ] Make shortcuts customizable

**Recommended shortcuts:**
| Shortcut | Action |
|----------|--------|
| Cmd/Ctrl + K | Global search (✅ done) |
| Cmd/Ctrl + / | Show shortcuts help |
| Cmd/Ctrl + N | New report |
| Cmd/Ctrl + S | Save |
| Cmd/Ctrl + E | Export |
| Cmd/Ctrl + , | Settings |
| Cmd/Ctrl + D | Toggle dark mode |
| Esc | Close modal |
| ? | Help |

```bash
npm install react-hotkeys-hook
```

---

### Phase 4: Polish & Growth (4-6 Weeks) - 완성도 및 성장

#### 4.1 Session Recording
**Tools:** LogRocket, FullStory, or Hotjar
**Purpose:** Debug user issues, understand behavior

#### 4.2 Feature Flags
**Tools:** LaunchDarkly, Unleash, or PostHog
**Purpose:** Gradual rollouts, A/B testing

#### 4.3 GDPR Compliance
**Tasks:**
- [ ] Cookie consent banner
- [ ] Data export functionality
- [ ] Account deletion flow
- [ ] Privacy center
- [ ] Consent management

#### 4.4 Performance Monitoring
**Tasks:**
- [ ] Track Core Web Vitals
- [ ] Add bundle analysis
- [ ] Implement image optimization
- [ ] Set up CDN
- [ ] Monitor response times

#### 4.5 Advanced Security
**Tasks:**
- [ ] Add Helmet.js for security headers
- [ ] Implement CSP
- [ ] Add CSRF protection
- [ ] Set up dependency scanning (Dependabot)
- [ ] Add secret scanning
- [ ] Implement audit logging UI

---

## 📊 Timeline Summary

| Phase | Duration | Deliverables | Production Ready % |
|-------|----------|--------------|-------------------|
| Current | - | Architecture refactored | 35% |
| Phase 1 | 1-2 weeks | Payments, Email, Sentry, Tests, CI/CD | 60% |
| Phase 2 | 2-3 weeks | 2FA, RBAC, Rate Limiting, Analytics, Skeletons | 75% |
| Phase 3 | 3-4 weeks | i18n, File Upload, Chat, Help Center, Shortcuts | 85% |
| Phase 4 | 4-6 weeks | Session Replay, Feature Flags, GDPR, Performance | 95% |

---

## 💰 Cost Estimates (Monthly)

**Production SaaS Infrastructure:**
- Supabase Pro: $25/month
- Vercel Pro (or similar): $20/month
- Sentry Team: $26/month
- Resend Email: $20/month (10k emails)
- Stripe: 2.9% + $0.30 per transaction
- PostHog (Analytics): $0-$450/month (usage-based)
- Intercom (Chat): $74/month
- **Total: ~$185-600/month** (excluding Stripe fees)

---

## 🎯 Key Metrics to Track (Once Analytics is Set Up)

1. **Activation:** % of signups that create first report
2. **Engagement:** DAU/MAU ratio
3. **Retention:** 7-day, 30-day retention rates
4. **Conversion:** Free → Paid conversion rate
5. **Revenue:** MRR, ARR, ARPU
6. **Churn:** Monthly churn rate
7. **NPS:** Net Promoter Score
8. **Performance:** Page load time, Web Vitals
9. **Support:** Ticket volume, resolution time
10. **Errors:** Error rate, mean time to resolution

---

## 🚀 Quick Wins (Can be done immediately)

1. **Add Sentry** (1 hour)
2. **Create CI/CD workflow** (2 hours)
3. **Add skeleton loaders to 3 key pages** (3 hours)
4. **Replace hardcoded admin check with DB query** (1 hour)
5. **Add PostHog analytics** (2 hours)

---

## ⚠️ Technical Debt to Address

1. **WebSocket:** Not using Supabase Realtime (should migrate)
2. **Error Tracking:** Custom implementation should be replaced with Sentry
3. **Service Worker:** Cache-first strategy may cause stale data
4. **Admin Check:** Hardcoded email addresses
5. **Payment:** Entire checkout is simulated
6. **Webhook Delivery:** UI exists but no backend

---

## 📚 References & Best Practices

**Stripe Integration:**
- https://stripe.com/docs/payments/checkout
- https://stripe.com/docs/billing/subscriptions/webhooks

**Supabase MFA:**
- https://supabase.com/docs/guides/auth/auth-mfa

**Testing:**
- https://vitest.dev/guide/
- https://playwright.dev/docs/intro

**Security:**
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Supabase RLS: https://supabase.com/docs/guides/auth/row-level-security

**Performance:**
- Web Vitals: https://web.dev/vitals/
- Lighthouse: https://developers.google.com/web/tools/lighthouse

---

## 🎬 Next Steps

**Option A: Full Production Push (Recommended)**
1. Start with Phase 1 (Critical Blockers)
2. Complete in 1-2 weeks
3. Deploy to staging
4. Move to Phase 2

**Option B: Quick Launch (MVP)**
1. Implement only: Stripe + Sentry + Email
2. Deploy with limited features
3. Iterate based on user feedback

**Option C: Continue Refactoring**
1. Complete remaining component splits (Phase 4)
2. Then tackle production blockers

---

## 📞 Decision Required

Which path would you like to take?
1. **Full Production** - Follow all phases sequentially
2. **Quick Launch** - Implement critical features only
3. **Custom** - Cherry-pick specific features

Let me know and I can start implementing immediately!
