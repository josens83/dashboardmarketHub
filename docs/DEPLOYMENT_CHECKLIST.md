# Production Deployment Checklist

Quick reference checklist for deploying Dashboard Market Hub to production.

## 🚀 Quick Start (30 minutes)

Follow these steps in order:

### Step 1: Service Accounts (10 min)
- [ ] Create Supabase production project
- [ ] Switch Stripe to live mode
- [ ] Create Sentry production project
- [ ] Get Resend production API key

### Step 2: GitHub Secrets (5 min)
Copy secrets from your `.env` file:
- [ ] Add 2 Supabase secrets
- [ ] Add 7 Stripe secrets
- [ ] Add 4 Sentry secrets
- [ ] Add deployment platform secrets (Vercel or Netlify)

### Step 3: Deploy (10 min)
- [ ] Push to main branch
- [ ] Monitor GitHub Actions
- [ ] Verify deployment success

### Step 4: Verify (5 min)
- [ ] Test login/signup
- [ ] Test Stripe checkout
- [ ] Check Sentry dashboard
- [ ] Verify email delivery

---

## 📝 Detailed Checklist

### Pre-Deployment

**Code Quality:**
- [ ] All 69 tests passing (`npm run test:run`)
- [ ] Test coverage ≥ 80% (Current: 80.71%)
- [ ] E2E tests passing (15 tests)
- [ ] No build errors (`npm run build`)
- [ ] No TypeScript errors (`npm run type-check`)

**GitHub Configuration:**
- [ ] Repository pushed to GitHub
- [ ] GitHub Actions enabled
- [ ] Branch protection on `main` (optional)

---

### Service Setup

#### Supabase
- [ ] Production project created
- [ ] Database migrated
- [ ] Edge Functions deployed:
  - [ ] `create-checkout-session`
  - [ ] `stripe-webhook`
  - [ ] `send-email`
- [ ] Edge Function secrets configured:
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `STRIPE_WEBHOOK_SECRET`
  - [ ] `RESEND_API_KEY`
  - [ ] `RESEND_FROM_EMAIL`

#### Stripe
- [ ] Switched to live mode
- [ ] Created 6 production price IDs:
  - [ ] Basic Monthly
  - [ ] Basic Yearly
  - [ ] Pro Monthly
  - [ ] Pro Yearly
  - [ ] Enterprise Monthly
  - [ ] Enterprise Yearly
- [ ] Webhook endpoint configured
- [ ] Webhook secret copied

#### Sentry
- [ ] Production project created
- [ ] DSN copied
- [ ] Auth token created with scopes:
  - [ ] `project:read`
  - [ ] `project:releases`
  - [ ] `org:read`

#### Resend
- [ ] Production API key created
- [ ] Domain verified (recommended)
- [ ] Sender email configured

---

### GitHub Secrets

Navigate to: **Repository Settings > Secrets and variables > Actions**

#### Required (13 secrets)

**Supabase:**
- [ ] `VITE_SUPABASE_URL`
- [ ] `VITE_SUPABASE_ANON_KEY`

**Stripe:**
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY`
- [ ] `VITE_STRIPE_PRICE_BASIC_MONTHLY`
- [ ] `VITE_STRIPE_PRICE_BASIC_YEARLY`
- [ ] `VITE_STRIPE_PRICE_PRO_MONTHLY`
- [ ] `VITE_STRIPE_PRICE_PRO_YEARLY`
- [ ] `VITE_STRIPE_PRICE_ENT_MONTHLY`
- [ ] `VITE_STRIPE_PRICE_ENT_YEARLY`

**Sentry:**
- [ ] `VITE_SENTRY_DSN`
- [ ] `SENTRY_AUTH_TOKEN`
- [ ] `SENTRY_ORG`
- [ ] `SENTRY_PROJECT`

#### Platform-Specific (Optional)

**Vercel:**
- [ ] `VERCEL_TOKEN`
- [ ] `VERCEL_ORG_ID`
- [ ] `VERCEL_PROJECT_ID`

**Or Netlify:**
- [ ] `NETLIFY_AUTH_TOKEN`
- [ ] `NETLIFY_SITE_ID`

---

### Deployment

**Automatic (Recommended):**
```bash
git checkout main
git pull origin main
git merge your-feature-branch
git push origin main
```

**Monitor:**
- [ ] Watch GitHub Actions "Deploy" workflow
- [ ] Verify no errors in build step
- [ ] Verify no errors in test step
- [ ] Confirm deployment success

---

### Post-Deployment Verification

#### Application Health
- [ ] Site loads without errors
- [ ] No console errors (F12)
- [ ] All pages accessible

#### Authentication
- [ ] Sign up works
- [ ] Email verification (if enabled)
- [ ] Login/logout works
- [ ] Password reset works

#### Payments (Test Card: 4242 4242 4242 4242)
- [ ] Pricing page loads
- [ ] Checkout session created
- [ ] Payment processed
- [ ] Subscription visible in Stripe Dashboard
- [ ] Receipt email received

#### Error Tracking
- [ ] Trigger test error
- [ ] Error appears in Sentry dashboard
- [ ] Source maps working (readable stack traces)

#### Email Delivery
- [ ] Welcome email sent
- [ ] Payment receipt sent
- [ ] Emails visible in Resend dashboard

---

### Performance Checks

**Lighthouse Audit:**
- [ ] Performance: 90+
- [ ] Accessibility: 95+
- [ ] Best Practices: 95+
- [ ] SEO: 90+

**Core Web Vitals:**
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1

---

### Security Checks

- [ ] HTTPS enabled
- [ ] No mixed content warnings
- [ ] Secrets not exposed in client code
- [ ] CSP headers configured
- [ ] No console logs with sensitive data
- [ ] Webhook signatures verified

---

### Monitoring Setup

**Day 1:**
- [ ] Monitor Sentry for first 24 hours
- [ ] Check for unexpected errors
- [ ] Monitor Stripe dashboard for subscriptions
- [ ] Verify email delivery rate

**Ongoing:**
- [ ] Set up uptime monitoring (optional)
- [ ] Configure alerts in Sentry
- [ ] Monitor Stripe webhooks
- [ ] Review analytics (optional)

---

## 🚨 Common Issues

### Build Fails
**Symptoms:** GitHub Actions shows red X
**Fix:** Run `npm run build` locally, fix errors

### Deployment Fails
**Symptoms:** Deploy step fails
**Fix:** Check platform logs, verify secrets

### Stripe Not Working
**Symptoms:** Checkout fails
**Fix:**
1. Verify publishable key is `pk_live_`
2. Check webhook delivery in Stripe
3. Verify Edge Function secrets

### Emails Not Sending
**Symptoms:** No emails received
**Fix:**
1. Check Resend dashboard
2. Verify API key in Supabase
3. Check Edge Function logs

### Sentry Not Capturing
**Symptoms:** No errors in Sentry
**Fix:**
1. Verify DSN in GitHub Secrets
2. Check environment is "production"
3. Trigger test error

---

## 📊 Success Metrics

After deployment, verify these metrics:

**Week 1:**
- [ ] Zero critical errors in Sentry
- [ ] >95% uptime
- [ ] All user signups successful
- [ ] All payments processing correctly

**Month 1:**
- [ ] <1% error rate
- [ ] Performance scores maintained
- [ ] No security incidents
- [ ] Email delivery >98%

---

## 🔄 Rollback Plan

If critical issues occur:

1. **Immediate:** Revert via platform dashboard
2. **Or:** `git revert HEAD && git push`
3. **Notify users** (if applicable)
4. **Fix issue** in development
5. **Redeploy** after testing

---

## 📞 Support

**Resources:**
- [Full Deployment Guide](./PRODUCTION_DEPLOYMENT.md)
- [CI/CD Guide](./CI_CD_GUIDE.md)
- [Implementation Summary](../IMPLEMENTATION_SUMMARY.md)

**Dashboards:**
- Vercel/Netlify: Deployment status
- Stripe: Payments & webhooks
- Sentry: Error tracking
- Supabase: Database & Edge Functions
- Resend: Email delivery

---

**Estimated Time:** 30-60 minutes (first deployment)
**Difficulty:** Intermediate
**Prerequisites:** All services configured
