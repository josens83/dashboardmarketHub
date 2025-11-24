# Production Deployment Guide

Complete guide to deploying Dashboard Market Hub to production.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Service Setup](#service-setup)
3. [GitHub Secrets Configuration](#github-secrets-configuration)
4. [Deployment Platforms](#deployment-platforms)
5. [Environment Variables](#environment-variables)
6. [Deployment Process](#deployment-process)
7. [Post-Deployment Verification](#post-deployment-verification)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying to production, ensure you have:

- ✅ **80%+ test coverage** (Current: 80.71%)
- ✅ **All tests passing** (Current: 69/69 tests)
- ✅ **GitHub Actions CI/CD pipeline** set up
- ✅ **Stripe account** with test mode configured
- ✅ **Supabase project** with database and Edge Functions
- ✅ **Sentry account** for error tracking
- ✅ **Domain name** (optional but recommended)

---

## Service Setup

### 1. Supabase Setup

**Create Production Project:**
1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Create a new project (separate from dev/staging)
3. Note your project URL and anon key
4. Run database migrations
5. Deploy Edge Functions:
   ```bash
   npx supabase functions deploy create-checkout-session
   npx supabase functions deploy stripe-webhook
   npx supabase functions deploy send-email
   ```

**Required Edge Functions:**
- `create-checkout-session` - Stripe checkout
- `stripe-webhook` - Webhook handler
- `send-email` - Email service (Resend)

**Environment Variables for Edge Functions:**
```bash
# In Supabase Dashboard > Settings > Edge Functions
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=Dashboard Market Hub <noreply@yourdomain.com>
```

### 2. Stripe Setup

**Switch to Live Mode:**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Toggle from "Test mode" to "Live mode"
3. Create production price IDs for all tiers:
   - Basic Monthly
   - Basic Yearly
   - Pro Monthly
   - Pro Yearly
   - Enterprise Monthly
   - Enterprise Yearly
4. Configure webhook endpoint:
   - URL: `https://your-project.supabase.co/functions/v1/stripe-webhook`
   - Events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
5. Copy webhook signing secret

**Price Configuration:**
- Ensure 14-day free trial is enabled
- Verify yearly prices have 20% discount
- Test checkout flow in live mode with test card

### 3. Sentry Setup

**Create Production Project:**
1. Go to [Sentry Dashboard](https://sentry.io/)
2. Create new project: "dashboard-market-hub-production"
3. Note DSN, Organization slug, and Project slug
4. Create an Auth Token:
   - Settings > Account > API > Auth Tokens
   - Scopes: `project:read`, `project:releases`, `org:read`

**Configure Source Maps:**
- Source maps are automatically uploaded via Vite plugin
- Ensure `SENTRY_AUTH_TOKEN` is set in GitHub Secrets

### 4. Resend Setup

**Create Production API Key:**
1. Go to [Resend Dashboard](https://resend.com/)
2. Create new API key for production
3. Verify sender domain (for professional emails)
4. Test email delivery

**Domain Verification** (Recommended):
- Add DNS records to your domain
- Verify domain in Resend dashboard
- Update `RESEND_FROM_EMAIL` to use your domain

---

## GitHub Secrets Configuration

Navigate to your repository: **Settings > Secrets and variables > Actions > New repository secret**

### Required Secrets (13 total)

#### Supabase (2 secrets)
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Stripe (7 secrets)
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_STRIPE_PRICE_BASIC_MONTHLY=price_...
VITE_STRIPE_PRICE_BASIC_YEARLY=price_...
VITE_STRIPE_PRICE_PRO_MONTHLY=price_...
VITE_STRIPE_PRICE_PRO_YEARLY=price_...
VITE_STRIPE_PRICE_ENT_MONTHLY=price_...
VITE_STRIPE_PRICE_ENT_YEARLY=price_...
```

#### Sentry (4 secrets)
```
VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_AUTH_TOKEN=sntrys_...
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=dashboard-market-hub-production
```

### Optional Secrets (for automated deployment)

#### Vercel (3 secrets)
```
VERCEL_TOKEN=...
VERCEL_ORG_ID=...
VERCEL_PROJECT_ID=...
```

#### Netlify (2 secrets)
```
NETLIFY_AUTH_TOKEN=...
NETLIFY_SITE_ID=...
```

---

## Deployment Platforms

Choose one deployment platform:

### Option 1: Vercel (Recommended)

**Setup Steps:**
1. Install Vercel CLI: `npm install -g vercel`
2. Login: `vercel login`
3. Link project: `vercel link`
4. Get credentials:
   ```bash
   # In project directory
   vercel --prod
   # Note: ORG_ID and PROJECT_ID from .vercel/project.json
   ```
5. Add GitHub Secrets (see above)

**Automatic Deployment:**
- Push to `main` branch triggers deployment
- GitHub Actions handles build and deployment
- Vercel provides preview URLs for PRs

**Manual Deployment:**
```bash
vercel --prod
```

### Option 2: Netlify

**Setup Steps:**
1. Create account at [Netlify](https://netlify.com/)
2. Create new site from Git
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Get credentials:
   - Auth Token: User Settings > Applications > Personal Access Tokens
   - Site ID: Site Settings > General > Site information

**Automatic Deployment:**
- Push to `main` branch triggers deployment
- GitHub Actions handles deployment

**Manual Deployment:**
```bash
npm run build
npx netlify deploy --prod
```

### Option 3: Other Platforms

The app is a static SPA and can be deployed to:
- **AWS S3 + CloudFront**
- **Google Cloud Storage**
- **Azure Static Web Apps**
- **DigitalOcean App Platform**

Build output is in `dist/` directory after running `npm run build`.

---

## Environment Variables

### Build-time Variables

These are embedded in the build and cannot be changed without rebuilding:

```bash
# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_STRIPE_PRICE_BASIC_MONTHLY=price_...
VITE_STRIPE_PRICE_BASIC_YEARLY=price_...
VITE_STRIPE_PRICE_PRO_MONTHLY=price_...
VITE_STRIPE_PRICE_PRO_YEARLY=price_...
VITE_STRIPE_PRICE_ENT_MONTHLY=price_...
VITE_STRIPE_PRICE_ENT_YEARLY=price_...

# Sentry
VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
VITE_SENTRY_ENVIRONMENT=production
```

### Runtime Variables (Supabase Edge Functions)

Set these in Supabase Dashboard:

```bash
# Stripe (for Edge Functions)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend (for Edge Functions)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=Dashboard Market Hub <noreply@yourdomain.com>
```

---

## Deployment Process

### Method 1: Automatic (GitHub Actions)

**Trigger deployment by pushing to main:**

```bash
# Ensure you're on main branch
git checkout main

# Pull latest changes
git pull origin main

# Merge your feature branch
git merge your-feature-branch

# Push to main (triggers deployment)
git push origin main
```

**Monitor deployment:**
1. Go to GitHub Actions tab
2. Watch "Deploy" workflow
3. Check for successful completion
4. Verify deployment on your hosting platform

### Method 2: Manual Deployment

**Build locally:**

```bash
# Install dependencies
npm ci

# Run tests
npm run test:run

# Build for production
npm run build
```

**Deploy to Vercel:**
```bash
vercel --prod
```

**Deploy to Netlify:**
```bash
npx netlify deploy --prod
```

---

## Post-Deployment Verification

### 1. Health Checks

**✅ Application loads:**
- Visit your production URL
- Check for console errors (F12)
- Verify no Sentry errors

**✅ Authentication works:**
- Sign up with new account
- Verify email (if configured)
- Login/logout flow

**✅ Stripe integration:**
- Navigate to pricing page
- Click "Get Started" on a plan
- Complete test checkout (use test card: 4242 4242 4242 4242)
- Verify subscription in Stripe Dashboard

**✅ Email delivery:**
- Trigger welcome email
- Check Resend dashboard for delivery
- Verify email received

**✅ Error tracking:**
- Trigger an error (e.g., invalid action)
- Check Sentry dashboard for captured error

### 2. Performance Checks

**Lighthouse Audit:**
```bash
# Install Lighthouse
npm install -g lighthouse

# Run audit
lighthouse https://your-production-url.com --view
```

**Target Scores:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+

**Core Web Vitals:**
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

### 3. Security Checks

**✅ HTTPS enabled:**
- All requests use HTTPS
- No mixed content warnings

**✅ Secrets not exposed:**
- Check network tab for API keys
- Verify no sensitive data in client-side code

**✅ CSP headers:**
- Verify Content Security Policy
- Check for XSS protection

---

## Troubleshooting

### Build Failures

**Error: Missing environment variable**
```
Solution: Add the variable to GitHub Secrets
Location: Repository Settings > Secrets and variables > Actions
```

**Error: TypeScript compilation errors**
```
Solution: Run `npm run build` locally to identify errors
Fix TypeScript errors before pushing to main
```

**Error: Tests failing**
```
Solution: Run `npm run test:run` locally
Fix failing tests before deploying
```

### Deployment Failures

**Vercel deployment fails:**
```
Solution: Check Vercel logs
Common issues:
- Build command incorrect
- Environment variables missing
- Node version mismatch (use 18.x)
```

**Netlify deployment fails:**
```
Solution: Check Netlify deploy logs
Common issues:
- Publish directory incorrect (should be 'dist')
- Build command incorrect (should be 'npm run build')
```

### Runtime Issues

**Stripe checkout not working:**
```
Checklist:
1. Verify VITE_STRIPE_PUBLISHABLE_KEY is live key (pk_live_)
2. Check Stripe Dashboard for webhook delivery
3. Verify Edge Function environment variables
4. Test webhook endpoint manually
```

**Emails not sending:**
```
Checklist:
1. Verify RESEND_API_KEY in Supabase Edge Functions
2. Check Resend dashboard for delivery logs
3. Verify sender email/domain is verified
4. Check Edge Function logs in Supabase
```

**Sentry not capturing errors:**
```
Checklist:
1. Verify VITE_SENTRY_DSN is correct
2. Check Sentry project settings
3. Verify environment is set to 'production'
4. Check browser console for Sentry init errors
```

**404 errors on routes:**
```
Solution: Configure redirect rules
Vercel: Add vercel.json
Netlify: Add _redirects or netlify.toml

Example (_redirects):
/*    /index.html   200
```

---

## Rollback Procedure

If deployment fails or introduces critical bugs:

### GitHub Actions Deployment

1. **Revert commit:**
   ```bash
   git revert HEAD
   git push origin main
   ```

2. **Or rollback to previous commit:**
   ```bash
   git reset --hard <previous-commit-hash>
   git push origin main --force
   ```

### Vercel Deployment

1. Go to Vercel Dashboard
2. Select your project
3. Go to "Deployments"
4. Click "..." on previous deployment
5. Click "Promote to Production"

### Netlify Deployment

1. Go to Netlify Dashboard
2. Select your site
3. Go to "Deploys"
4. Click "..." on previous deploy
5. Click "Publish deploy"

---

## Production Checklist

Before going live:

### Pre-Launch
- [ ] All tests passing (69/69)
- [ ] Test coverage ≥ 80% (Current: 80.71%)
- [ ] E2E tests passing (15/15)
- [ ] No console errors in production build
- [ ] All environment variables configured
- [ ] Domain name configured (if applicable)
- [ ] SSL certificate active

### Services
- [ ] Supabase production project created
- [ ] Stripe live mode configured
- [ ] Sentry production project created
- [ ] Resend production API key created
- [ ] All Edge Functions deployed

### Security
- [ ] All secrets in GitHub Actions
- [ ] No sensitive data in client code
- [ ] CORS configured correctly
- [ ] Rate limiting enabled (if applicable)
- [ ] Webhook signatures verified

### Monitoring
- [ ] Sentry error tracking active
- [ ] Performance monitoring configured
- [ ] Uptime monitoring (optional: Pingdom, UptimeRobot)
- [ ] Analytics configured (optional: PostHog, Plausible)

### Documentation
- [ ] README.md updated
- [ ] API documentation current
- [ ] Environment variables documented
- [ ] Deployment process documented

### Post-Launch
- [ ] Smoke tests completed
- [ ] Lighthouse audit passed
- [ ] Test payment processed successfully
- [ ] Error tracking verified
- [ ] Email delivery verified
- [ ] Monitor Sentry for first 24 hours
- [ ] Monitor Stripe dashboard for subscriptions

---

## Support & Resources

### Official Documentation
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com/)
- [Stripe Docs](https://stripe.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Sentry Docs](https://docs.sentry.io/)

### Internal Documentation
- [CI/CD Guide](./CI_CD_GUIDE.md)
- [E2E Testing Guide](./E2E_TESTING_GUIDE.md)
- [Implementation Summary](../IMPLEMENTATION_SUMMARY.md)

### Getting Help
- Check Sentry for error reports
- Review Stripe Dashboard for payment issues
- Check Supabase logs for Edge Function errors
- Review deployment logs in GitHub Actions

---

**Last Updated**: 2025-11-24
**Version**: 1.0.0
**Production Ready**: 85%
