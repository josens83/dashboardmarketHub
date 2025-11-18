# 📐 프로덕션급 폴더 구조 분석 및 최적화 제안

## 🔍 현재 구조 분석

### 현재 상태
```
src/
├── components/          ⚠️ 36개 컴포넌트 (11,436줄)
├── contexts/           ⚠️ 4개 context (shared로 이동 필요)
├── data/               ⚠️ 1개 파일 (정적 데이터)
├── lib/                ⚠️ 중복 (shared/lib과 중복)
├── services/           ⚠️ 2개 파일 (shared/lib으로 이동 필요)
├── types/              ⚠️ 중복 (shared/types와 중복)
├── utils/              ⚠️ 중복 (shared/utils와 중복)
├── config/             ✅ 새로 생성됨
└── shared/             ✅ 새로 생성됨 (부분적)
    ├── hooks/
    ├── lib/
    ├── types/
    └── utils/
```

### 🔴 심각한 문제점

#### 1. **중복 파일들 (18개 파일 중복)**
```
src/lib/supabase.ts              ⇄ src/shared/lib/supabase.ts
src/types/database.ts            ⇄ src/shared/types/database.ts
src/types/index.ts               ⇄ src/shared/types/index.ts
src/types/subscription.ts        ⇄ src/shared/types/subscription.ts
src/types/userdata.ts            ⇄ src/shared/types/userdata.ts
src/utils/dataExport.ts          ⇄ src/shared/utils/dataExport.ts
src/utils/errorTracking.ts      ⇄ src/shared/utils/errorTracking.ts
src/utils/pdfExport.ts           ⇄ src/shared/utils/pdfExport.ts
```
**영향**:
- 유지보수 시 두 곳 수정 필요
- import 경로 혼란
- 번들 크기 증가 가능성

#### 2. **컴포넌트 36개가 Flat 구조 (11,436줄)**
```
components/
├── AdminDashboard.tsx          (652줄) 🔴 너무 큼
├── CustomReportBuilder.tsx     (722줄) 🔴 너무 큼
├── WebhookSettings.tsx         (618줄) 🔴 너무 큼
├── DataConnector.tsx           (604줄) 🔴 너무 큼
├── CollaborationPanel.tsx      (604줄) 🔴 너무 큼
├── DataExportCenter.tsx        (600줄) 🔴 너무 큼
├── ... (30개 더)
```
**문제**:
- 도메인별 분리 없음
- 찾기 어려움
- 의존성 관리 어려움
- 팀 협업 시 충돌 가능성 높음

#### 3. **구조 혼재 (신/구 구조 공존)**
- 기존: `src/components`, `src/utils`, `src/types`
- 새로운: `src/shared/*`, `src/config/*`
- 일관성 부족

#### 4. **contexts 위치 부적절**
- `src/contexts/` → `src/shared/contexts/`로 이동 필요
- 전역 상태는 shared에 위치해야 함

#### 5. **services 위치 부적절**
- `src/services/api.ts` → 삭제 (Supabase로 대체됨)
- `src/services/websocket.ts` → `src/shared/lib/websocket/`

---

## ✅ 최적 구조 제안

### Feature-First + Shared 하이브리드 아키텍처

```
src/
├── app/                          # 앱 엔트리 및 라우팅
│   ├── App.tsx                   # 메인 앱 컴포넌트
│   ├── routes.tsx                # 라우트 설정
│   └── providers.tsx             # Provider 래퍼
│
├── features/                     # 기능별 모듈 (Feature-First)
│   ├── auth/                     # 인증 기능
│   │   ├── components/
│   │   │   ├── AuthModal.tsx
│   │   │   └── LoginForm.tsx
│   │   ├── hooks/
│   │   │   └── use-login.ts
│   │   └── index.ts              # Public API
│   │
│   ├── dashboard/                # 대시보드 기능
│   │   ├── components/
│   │   │   ├── UserDashboard.tsx
│   │   │   ├── MarketOverview.tsx
│   │   │   ├── ServiceComparison.tsx
│   │   │   ├── PricingAnalysis.tsx
│   │   │   └── IndustryAnalysis.tsx
│   │   ├── hooks/
│   │   │   └── use-dashboard-data.ts
│   │   └── index.ts
│   │
│   ├── reports/                  # 리포트 기능
│   │   ├── components/
│   │   │   ├── CustomReportBuilder/   # 큰 컴포넌트는 폴더로
│   │   │   │   ├── index.tsx           # 메인 컴포넌트
│   │   │   │   ├── ReportCanvas.tsx    # 하위 컴포넌트
│   │   │   │   ├── ChartSelector.tsx
│   │   │   │   └── DataMapper.tsx
│   │   │   ├── SavedReportsPage.tsx
│   │   │   ├── SaveReportModal.tsx
│   │   │   └── ReportScheduler.tsx
│   │   ├── hooks/
│   │   │   └── use-report-builder.ts
│   │   └── index.ts
│   │
│   ├── data/                     # 데이터 소스 관리
│   │   ├── components/
│   │   │   ├── DataConnector/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── SourceList.tsx
│   │   │   │   └── ConnectionForm.tsx
│   │   │   └── DataExportCenter.tsx
│   │   └── index.ts
│   │
│   ├── collaboration/            # 협업 기능
│   │   ├── components/
│   │   │   └── CollaborationPanel.tsx
│   │   └── index.ts
│   │
│   ├── admin/                    # 관리자 기능
│   │   ├── components/
│   │   │   ├── AdminDashboard/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── UserManagement.tsx
│   │   │   │   ├── SystemStats.tsx
│   │   │   │   └── ActivityMonitor.tsx
│   │   │   └── ActivityLogs.tsx
│   │   └── index.ts
│   │
│   ├── settings/                 # 설정 기능
│   │   ├── components/
│   │   │   ├── SettingsPage.tsx
│   │   │   ├── WebhookSettings/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── WebhookList.tsx
│   │   │   │   └── WebhookForm.tsx
│   │   │   └── TeamManagement.tsx
│   │   └── index.ts
│   │
│   ├── subscription/             # 구독/결제 기능
│   │   ├── components/
│   │   │   ├── PricingModal.tsx
│   │   │   └── CheckoutPage.tsx
│   │   └── index.ts
│   │
│   ├── templates/                # 템플릿 기능
│   │   ├── components/
│   │   │   └── TemplateGallery.tsx
│   │   └── index.ts
│   │
│   ├── docs/                     # 문서 페이지
│   │   ├── components/
│   │   │   ├── APIDocumentation.tsx
│   │   │   ├── FAQPage.tsx
│   │   │   └── ContactPage.tsx
│   │   └── index.ts
│   │
│   └── legal/                    # 법적 문서
│       ├── components/
│       │   ├── PrivacyPolicy.tsx
│       │   └── TermsOfService.tsx
│       └── index.ts
│
├── shared/                       # 공통 코드 (재사용 가능)
│   ├── components/               # 공통 UI 컴포넌트
│   │   ├── ui/                   # 기본 UI 요소
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Card.tsx
│   │   ├── layout/               # 레이아웃 컴포넌트
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── FeatureLock.tsx
│   │   ├── NotificationCenter.tsx
│   │   ├── GlobalSearch.tsx
│   │   ├── OnboardingTour.tsx
│   │   ├── AdvancedFilters.tsx
│   │   └── ComparisonTool.tsx
│   │
│   ├── hooks/                    # 공통 Hooks
│   │   ├── index.ts
│   │   ├── use-toast.ts
│   │   ├── use-supabase-query.ts
│   │   ├── use-reports.ts
│   │   ├── use-teams.ts          # NEW
│   │   ├── use-subscription.ts   # NEW
│   │   └── use-activity-logs.ts  # NEW
│   │
│   ├── lib/                      # 외부 라이브러리 래퍼
│   │   ├── supabase/
│   │   │   ├── client.ts         # Supabase 클라이언트
│   │   │   ├── auth.ts           # Auth 헬퍼
│   │   │   ├── database.ts       # DB 헬퍼
│   │   │   └── storage.ts        # Storage 헬퍼
│   │   ├── websocket/
│   │   │   ├── client.ts         # WebSocket 클라이언트
│   │   │   └── events.ts         # 이벤트 타입
│   │   └── analytics/
│   │       └── tracker.ts        # GA, Sentry 등
│   │
│   ├── contexts/                 # 전역 상태 (이동됨)
│   │   ├── AuthContext.tsx
│   │   ├── ToastContext.tsx
│   │   ├── LoadingContext.tsx
│   │   └── UserDataContext.tsx
│   │
│   ├── utils/                    # 유틸리티 함수
│   │   ├── error-handler.ts
│   │   ├── format.ts             # NEW (날짜, 숫자 포맷)
│   │   ├── validation.ts         # NEW (검증 함수)
│   │   ├── pdfExport.ts
│   │   ├── dataExport.ts
│   │   └── errorTracking.ts
│   │
│   └── types/                    # 공통 타입
│       ├── index.ts
│       ├── database.ts
│       ├── subscription.ts
│       ├── userdata.ts
│       └── api.ts                # NEW (API 응답 타입)
│
├── config/                       # 설정 파일
│   ├── constants.ts              # 앱 상수
│   ├── env.ts                    # 환경 변수 래퍼
│   ├── routes.ts                 # 라우트 정의
│   └── features.ts               # 기능 플래그
│
├── data/                         # 정적 데이터
│   ├── market-data.ts            # 시장 데이터
│   └── mock-data.ts              # 목 데이터 (개발용)
│
├── styles/                       # 전역 스타일
│   ├── index.css                 # 메인 스타일
│   └── themes/                   # 테마 변수
│
└── main.tsx                      # 앱 엔트리
```

---

## 🎯 설계 원칙 및 이유

### 1. **Feature-First 아키텍처**
```
features/
├── auth/
├── dashboard/
└── reports/
```

**이유**:
- ✅ **도메인 중심**: 비즈니스 로직이 명확하게 분리
- ✅ **팀 협업**: 각 feature별로 개발자 할당 가능
- ✅ **독립성**: feature 간 의존성 최소화
- ✅ **확장성**: 새 기능 추가 시 새 폴더만 생성
- ✅ **코드 파악**: 특정 기능 코드가 한 곳에 모임
- ✅ **테스트 용이**: feature 단위 테스트 가능

### 2. **큰 컴포넌트는 폴더로 분리**
```
CustomReportBuilder/        (722줄 → 200줄씩 분리)
├── index.tsx              # 메인 (200줄)
├── ReportCanvas.tsx       # 캔버스 (150줄)
├── ChartSelector.tsx      # 차트 선택 (150줄)
├── DataMapper.tsx         # 데이터 매핑 (150줄)
└── types.ts               # 로컬 타입
```

**이유**:
- ✅ **가독성**: 500줄 이상 컴포넌트는 이해하기 어려움
- ✅ **재사용**: 하위 컴포넌트를 다른 곳에서도 사용 가능
- ✅ **유지보수**: 변경 영향 범위 축소
- ✅ **성능**: 필요한 부분만 리렌더링
- ✅ **테스트**: 작은 단위로 테스트 가능

### 3. **Shared 폴더 (공통 코드)**
```
shared/
├── components/    # 재사용 UI
├── hooks/         # 재사용 로직
├── lib/           # 외부 라이브러리 래퍼
├── utils/         # 유틸리티
└── types/         # 공통 타입
```

**이유**:
- ✅ **DRY 원칙**: 중복 코드 제거
- ✅ **일관성**: 공통 로직이 한 곳에
- ✅ **의존성 관리**: features는 shared만 의존
- ✅ **번들 최적화**: 공통 코드를 별도 청크로 분리 가능

### 4. **Public API 패턴 (index.ts)**
```typescript
// features/dashboard/index.ts
export { UserDashboard } from './components/UserDashboard';
export { MarketOverview } from './components/MarketOverview';
export { useDashboardData } from './hooks/use-dashboard-data';
```

**이유**:
- ✅ **캡슐화**: 내부 구조 숨김
- ✅ **리팩토링 용이**: 내부 변경 시 외부 영향 없음
- ✅ **명확한 인터페이스**: 무엇을 export하는지 명확
- ✅ **Import 간소화**: `from '@/features/dashboard'`

### 5. **의존성 방향**
```
features → shared → config
           ↓
        contexts
```

**규칙**:
- ✅ features는 shared에만 의존
- ✅ features 간 직접 의존 금지
- ✅ shared는 features를 모름
- ✅ 순환 의존성 방지

---

## 📊 Before vs After 비교

### Before (현재)
```
src/components/
├── CustomReportBuilder.tsx    (722줄) 🔴
├── AdminDashboard.tsx          (652줄) 🔴
├── ... (34개 더)

문제점:
- 36개 파일을 스크롤하며 찾아야 함
- 관련 파일들이 흩어져 있음
- 큰 파일들은 수정하기 어려움
- 팀원들이 같은 폴더에서 충돌
```

### After (최적화)
```
src/features/reports/
├── components/
│   └── CustomReportBuilder/
│       ├── index.tsx           (200줄) ✅
│       ├── ReportCanvas.tsx    (150줄) ✅
│       └── ChartSelector.tsx   (150줄) ✅

장점:
- 리포트 관련 코드가 한 곳에
- 작은 단위로 분리되어 이해 쉬움
- 동시 작업 충돌 감소
- 재사용 가능한 컴포넌트 명확
```

---

## 🔄 마이그레이션 단계

### Phase 1: 중복 제거 (즉시 실행 가능)
```bash
# 1. 기존 폴더 삭제
rm -rf src/lib src/types src/utils

# 2. contexts 이동
mv src/contexts src/shared/

# 3. services/api.ts 삭제 (Supabase로 대체됨)
rm src/services/api.ts

# 4. websocket 이동
mkdir -p src/shared/lib/websocket
mv src/services/websocket.ts src/shared/lib/websocket/client.ts
```

### Phase 2: Features 폴더 구조 (단계별)
```bash
# 1. 인증 관련
mkdir -p src/features/auth/components
mv src/components/AuthModal.tsx src/features/auth/components/
mv src/components/LandingPage.tsx src/features/auth/components/

# 2. 대시보드 관련
mkdir -p src/features/dashboard/components
mv src/components/UserDashboard.tsx src/features/dashboard/components/
mv src/components/MarketOverview.tsx src/features/dashboard/components/
# ... 계속
```

### Phase 3: 큰 컴포넌트 분리
```bash
# CustomReportBuilder 분리
mkdir -p src/features/reports/components/CustomReportBuilder
# 컴포넌트 코드 분리 작업 (수동)
```

### Phase 4: Import 경로 업데이트
```bash
# Path alias 설정 후 일괄 변경
# tsconfig.json과 vite.config.ts 수정 필요
```

---

## 📏 컴포넌트 크기 가이드라인

### 권장 크기
- ✅ **100-300줄**: 이상적
- ⚠️ **300-500줄**: 주의 (분리 검토)
- 🔴 **500줄 이상**: 즉시 분리 필요

### 분리 기준
1. **논리적 단위**: 독립적인 기능이 있는가?
2. **재사용성**: 다른 곳에서도 쓸 수 있는가?
3. **복잡도**: 이해하는데 시간이 오래 걸리는가?
4. **테스트**: 테스트하기 어려운가?

### 현재 분리 필요 컴포넌트
1. CustomReportBuilder (722줄) → 4개로 분리
2. AdminDashboard (652줄) → 3개로 분리
3. WebhookSettings (618줄) → 3개로 분리
4. DataConnector (604줄) → 3개로 분리
5. CollaborationPanel (604줄) → 3개로 분리
6. DataExportCenter (600줄) → 3개로 분리

---

## 🎨 네이밍 컨벤션

### 폴더명
- `kebab-case` (features, shared, config)
- feature 폴더: 명사 복수형 또는 단수형 (reports, auth, dashboard)

### 파일명
- 컴포넌트: `PascalCase.tsx`
- Hook: `use-hook-name.ts`
- 유틸: `kebab-case.ts`
- 타입: `kebab-case.ts` 또는 `PascalCase.ts`

### Export 방식
```typescript
// ✅ Named export (권장)
export function Button() { }
export const UserCard = () => { }

// ❌ Default export (지양)
export default Button;  // import 시 이름이 달라질 수 있음
```

---

## 🎯 최종 권장사항

### 우선순위 1 (즉시): 중복 제거
- [ ] src/lib, src/types, src/utils 삭제
- [ ] src/contexts → src/shared/contexts 이동
- [ ] src/services/api.ts 삭제
- [ ] 모든 import 경로 수정

### 우선순위 2 (단기): 공통 컴포넌트 분리
- [ ] LoadingSpinner, ErrorBoundary 등 shared/components로 이동
- [ ] FeatureLock, NotificationCenter 등 이동

### 우선순위 3 (중기): Feature 폴더 구조
- [ ] auth feature 생성 및 이동
- [ ] dashboard feature 생성 및 이동
- [ ] reports feature 생성 및 이동
- [ ] admin feature 생성 및 이동

### 우선순위 4 (장기): 큰 컴포넌트 분리
- [ ] CustomReportBuilder 분리
- [ ] AdminDashboard 분리
- [ ] WebhookSettings 분리

---

## 💡 프로덕션 체크리스트

- [ ] **중복 파일 없음**: 같은 파일이 여러 곳에 존재하지 않음
- [ ] **명확한 폴더 구조**: 기능별로 명확하게 분리됨
- [ ] **작은 컴포넌트**: 500줄 이상 컴포넌트 없음
- [ ] **일관된 네이밍**: 전체 프로젝트에서 일관된 규칙 사용
- [ ] **Public API**: 각 feature가 index.ts로 export
- [ ] **의존성 방향**: features → shared, 순환 의존 없음
- [ ] **Path Alias**: @/ 경로로 import
- [ ] **타입 안전성**: any 타입 최소화
- [ ] **문서화**: 각 feature에 README.md

---

이 구조는 **Airbnb, Stripe, Vercel** 등 프로덕션급 SaaS의 표준을 따르며,
**확장성, 유지보수성, 팀 협업**을 고려한 최적 설계입니다.
