# Dashboard Market Hub

> Production-ready SaaS platform for BI dashboard market analysis

[![Production Ready](https://img.shields.io/badge/Production%20Ready-95%25-success)](./IMPLEMENTATION_SUMMARY.md)
[![Tests](https://img.shields.io/badge/Tests-69%20passing-success)](./docs/CI_CD_GUIDE.md)
[![Coverage](https://img.shields.io/badge/Coverage-80.71%25-success)](./docs/CI_CD_GUIDE.md)
[![License](https://img.shields.io/badge/License-MIT-blue)](./LICENSE)

유료 대시보드 구축 서비스 시장 분석을 위한 프로덕션 SaaS 플랫폼. Stripe 결제, 이메일 자동화, 에러 트래킹, CI/CD 파이프라인을 갖춘 엔터프라이즈급 애플리케이션입니다.

---

## ✨ 주요 기능

### 📊 Market Analysis
- **시장 개요**: 글로벌/국내 BI 시장 규모 추이 분석
- **서비스 비교**: Tableau, Power BI, Qlik Sense 등 주요 솔루션 비교
- **가격 분석**: 서비스별 비용 비교 및 ROI 계산
- **산업별 분석**: 제조, 금융, 유통, 물류 등 산업별 수요 분석

### 💳 Production Features
- **Real Payments**: Stripe 통합 (14일 무료 체험)
- **Email Automation**: Resend를 통한 트랜잭션 이메일
- **Error Tracking**: Sentry 실시간 모니터링
- **Authentication**: Supabase Auth (소셜 로그인 지원)
- **Subscription Management**: 3개 티어 (Basic, Pro, Enterprise)

### 🎨 User Experience
- **Dark Mode**: 다크/라이트 모드 전환
- **Responsive**: 모바일, 태블릿, 데스크톱 최적화
- **PDF Export**: 분석 결과 PDF 다운로드
- **Real-time Collaboration**: 팀 기능 및 실시간 업데이트

### 🔐 Enterprise Ready
- **Role-based Access Control**: User/Admin 권한 관리
- **Audit Logs**: 관리자 활동 추적
- **Webhooks**: 외부 시스템 통합
- **API Documentation**: OpenAPI 3.0 스펙

---

## 🏗️ 기술 스택

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: React Context API

### Backend & Services
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Email**: Resend
- **Monitoring**: Sentry
- **Hosting**: Vercel / Netlify ready

### Development & CI/CD
- **Testing**: Vitest + Playwright
- **E2E Tests**: 15 tests across 5 browsers
- **Test Coverage**: 80.71%
- **CI/CD**: GitHub Actions
- **Linting**: ESLint + TypeScript

---

## 📊 Production Readiness: 95%

### ✅ Completed Features
- ✅ Real Stripe payment integration (Phase 1.1)
- ✅ Transactional email system (Phase 1.2)
- ✅ Sentry error tracking (Phase 1.3)
- ✅ 69 unit tests with 80.71% coverage (Phase 1.4, 1.7)
- ✅ GitHub Actions CI/CD pipeline (Phase 1.5)
- ✅ E2E testing with Playwright (Phase 1.6)
- ✅ Production deployment configuration (Phase 2.1)
- ✅ Performance optimization - 55% bundle reduction (Phase 2.2)

### 📈 Performance Metrics
- **Bundle Size**: 624 KB (gzipped: 185 KB)
- **Lighthouse Score**: 90+ (all categories)
- **Load Time**: < 2s (on 3G)
- **Code Splitting**: 25+ lazy-loaded pages

See [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) for detailed progress.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account (test mode)
- Sentry account (optional)
- Resend account (optional)

### Installation

```bash
# Clone repository
git clone https://github.com/josens83/dashboardmarketHub.git
cd dashboardmarketHub

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

### Environment Setup

Configure your `.env` file with the following:

```bash
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Stripe (test mode)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_STRIPE_PRICE_BASIC_MONTHLY=price_...
VITE_STRIPE_PRICE_BASIC_YEARLY=price_...
VITE_STRIPE_PRICE_PRO_MONTHLY=price_...
VITE_STRIPE_PRICE_PRO_YEARLY=price_...
VITE_STRIPE_PRICE_ENT_MONTHLY=price_...
VITE_STRIPE_PRICE_ENT_YEARLY=price_...

# Sentry (optional)
VITE_SENTRY_DSN=https://...@sentry.io/...
```

See [.env.example](./.env.example) for complete configuration.

### Development

```bash
# Start development server (port 3000)
npm run dev

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Lint code
npm run lint

# Build for production
npm run build
```

---

## 🧪 Testing

### Unit Tests
```bash
# Run once
npm run test:run

# Watch mode
npm run test

# Coverage report
npm run test:coverage
```

**Current Stats:**
- 69 tests passing
- 80.71% coverage
- 5 test suites

### E2E Tests
```bash
# Run E2E tests
npm run test:e2e

# Interactive UI
npm run test:e2e:ui

# Debug mode
npm run test:e2e:debug
```

**Browser Coverage:**
- Chromium, Firefox, WebKit
- Mobile Chrome, Mobile Safari

---

## 📦 Deployment

### Quick Deploy (30 minutes)

1. **Configure Services** (10 min)
   - Set up Supabase production project
   - Switch Stripe to live mode
   - Create Sentry production project
   - Get Resend production API key

2. **Set GitHub Secrets** (5 min)
   - Add 13 required secrets
   - See [DEPLOYMENT_CHECKLIST.md](./docs/DEPLOYMENT_CHECKLIST.md)

3. **Deploy** (10 min)
   - Push to `main` branch
   - GitHub Actions auto-deploys to Vercel/Netlify

4. **Verify** (5 min)
   - Test authentication
   - Test checkout flow
   - Verify email delivery
   - Check Sentry dashboard

### Deployment Platforms

**Vercel (Recommended)**
```bash
npm install -g vercel
vercel --prod
```

**Netlify**
```bash
npm run build
npx netlify deploy --prod
```

**Manual Deploy**
- Build output: `dist/`
- Compatible with: AWS S3, Google Cloud, Azure, DigitalOcean

See full deployment guide: [docs/PRODUCTION_DEPLOYMENT.md](./docs/PRODUCTION_DEPLOYMENT.md)

---

## 📚 Documentation

### Main Docs
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md) - Complete feature timeline
- [Production Deployment](./docs/PRODUCTION_DEPLOYMENT.md) - Deployment guide
- [Deployment Checklist](./docs/DEPLOYMENT_CHECKLIST.md) - Quick reference
- [CI/CD Guide](./docs/CI_CD_GUIDE.md) - GitHub Actions setup
- [E2E Testing](./docs/E2E_TESTING_GUIDE.md) - Playwright tests

### API Documentation
- OpenAPI 3.0 spec available at `/api-docs` (when running)
- Supabase Edge Functions in `supabase/functions/`

---

## 🗂️ Project Structure

```
dashboardmarketHub/
├── .github/
│   └── workflows/          # CI/CD pipelines
│       ├── ci.yml          # Main CI workflow
│       ├── deploy.yml      # Production deployment
│       └── pr-checks.yml   # PR analytics
├── docs/                   # Documentation
│   ├── PRODUCTION_DEPLOYMENT.md
│   ├── DEPLOYMENT_CHECKLIST.md
│   ├── CI_CD_GUIDE.md
│   └── E2E_TESTING_GUIDE.md
├── e2e/                    # Playwright E2E tests
│   ├── landing.spec.ts
│   ├── auth.spec.ts
│   ├── pricing.spec.ts
│   └── dashboard.spec.ts
├── src/
│   ├── features/           # Feature modules
│   │   ├── auth/           # Authentication
│   │   ├── dashboard/      # Dashboard pages
│   │   ├── reports/        # Report management
│   │   ├── settings/       # Settings & admin
│   │   └── subscription/   # Stripe integration
│   ├── shared/
│   │   ├── components/     # Shared UI components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # External integrations
│   │   │   ├── stripe/     # Stripe client
│   │   │   ├── email/      # Resend templates
│   │   │   └── sentry.ts   # Error tracking
│   │   └── utils/          # Utilities
│   ├── test/               # Test setup
│   ├── App.tsx             # Main app
│   └── main.tsx            # Entry point
├── supabase/
│   └── functions/          # Edge Functions
│       ├── create-checkout-session/
│       ├── stripe-webhook/
│       └── send-email/
├── .env.example            # Environment template
├── package.json
├── tsconfig.json
├── vite.config.ts          # Vite + code splitting
├── vitest.config.ts        # Vitest configuration
└── playwright.config.ts    # Playwright E2E config
```

---

## 🔧 Configuration

### Environment Variables

Required for production:
- **Supabase**: URL, Anon Key (2)
- **Stripe**: Publishable Key + 6 Price IDs (7)
- **Sentry**: DSN, Auth Token, Org, Project (4)

Optional:
- **Vercel/Netlify**: Deployment tokens
- **Resend**: API key (for Edge Functions)

See [.env.example](./.env.example) for complete list.

### Supabase Edge Functions

Deploy Edge Functions to Supabase:

```bash
npx supabase functions deploy create-checkout-session
npx supabase functions deploy stripe-webhook
npx supabase functions deploy send-email
```

Set secrets in Supabase Dashboard:
```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

---

## 🎯 Subscription Tiers

### Basic ($29/mo or $290/year)
- Market overview access
- Basic reporting
- PDF export
- Email support

### Pro ($79/mo or $790/year)
- Everything in Basic
- Custom reports
- Advanced analytics
- Team collaboration (5 users)
- Priority support

### Enterprise ($199/mo or $1,990/year)
- Everything in Pro
- Unlimited users
- White-label options
- API access
- Dedicated support
- Custom integrations

All plans include 14-day free trial.

---

## 🤝 Contributing

### Development Workflow

1. Create feature branch
2. Write tests first (TDD)
3. Implement feature
4. Ensure all tests pass
5. Run linter
6. Submit PR

### Code Quality Standards
- Test coverage ≥ 80%
- No console.logs in production
- TypeScript strict mode
- ESLint compliance
- Component documentation

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

---

## 📞 Support

### Resources
- [Sentry Dashboard](https://sentry.io/) - Error tracking
- [Stripe Dashboard](https://dashboard.stripe.com/) - Payments
- [Supabase Dashboard](https://app.supabase.com/) - Database
- [Resend Dashboard](https://resend.com/) - Email delivery

### Documentation
- Full deployment guide available
- API documentation at `/api-docs`
- E2E testing guide included

### Issues
Report issues at: https://github.com/josens83/dashboardmarketHub/issues

---

## 🎉 Achievements

**From 35% to 95% Production Ready**

- ✅ Real payment system (Stripe)
- ✅ Email automation (Resend)
- ✅ Error tracking (Sentry)
- ✅ 69 passing tests (80.71% coverage)
- ✅ CI/CD pipeline (GitHub Actions)
- ✅ E2E tests (15 tests, 5 browsers)
- ✅ Production deployment ready
- ✅ Performance optimized (55% bundle reduction)

**Ready for production deployment** 🚀

---

Made with ❤️ using React + TypeScript + Supabase + Stripe
