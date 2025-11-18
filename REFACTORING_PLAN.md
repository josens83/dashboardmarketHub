# 🔄 프로덕션급 SaaS 리팩토링 계획

## 📊 현재 상태 분석

### 문제점
1. **디렉토리 구조**: 46개 컴포넌트가 flat하게 한 폴더에 존재
2. **중복 코드**: API 호출, 에러 핸들링 패턴이 반복됨
3. **타입 일관성**: Supabase 타입과 기존 타입이 혼재
4. **hooks 부재**: 재사용 가능한 로직이 컴포넌트에 산재
5. **설정 분산**: 상수와 설정이 여러 파일에 분산

## 🎯 개선 목표

### 1. 디렉토리 구조 (Feature-First)
```
src/
├── features/              # Feature 단위 모듈화
│   ├── auth/             # 인증
│   ├── dashboard/        # 대시보드
│   ├── reports/          # 리포트
│   ├── admin/            # 관리자
│   ├── settings/         # 설정
│   └── subscription/     # 구독
├── shared/               # 공통 코드
│   ├── components/       # 공통 컴포넌트
│   ├── hooks/            # Custom hooks
│   ├── lib/              # 라이브러리 래퍼
│   ├── utils/            # 유틸리티
│   └── types/            # 공통 타입
├── config/               # 설정
└── App.tsx
```

### 2. Custom Hooks
- `useSupabase()` - Supabase 통합 hook
- `useToast()` - 토스트 알림
- `useAuth()` - 인증 (기존 개선)
- `useSubscription()` - 구독 관리
- `useReports()` - 리포트 CRUD
- `useTeams()` - 팀 관리
- `useActivityLogs()` - 활동 로그

### 3. API 레이어 통일
```typescript
// lib/supabase/client.ts - Supabase 클라이언트
// lib/supabase/database.ts - DB 헬퍼
// lib/supabase/auth.ts - Auth 헬퍼
// lib/supabase/storage.ts - Storage 헬퍼
```

### 4. 에러 핸들링
```typescript
// utils/error-handler.ts - 통합 에러 처리
// utils/logger.ts - 로깅
```

### 5. 상수 관리
```typescript
// config/constants.ts - 앱 상수
// config/features.ts - 기능 플래그
// config/routes.ts - 라우트 정의
```

## 📝 작업 순서

1. ✅ 새 디렉토리 구조 생성
2. ✅ Custom hooks 작성
3. ✅ API 레이어 통합
4. ✅ 에러 핸들링 시스템
5. ✅ 상수 및 설정 정리
6. ✅ 컴포넌트 이동 및 리팩토링
7. ✅ Import 경로 업데이트
8. ✅ 테스트 및 검증

## 🎨 코딩 컨벤션

### 네이밍
- 컴포넌트: PascalCase (UserDashboard)
- Hooks: camelCase + use 접두사 (useAuth)
- 유틸: camelCase (formatDate)
- 상수: UPPER_SNAKE_CASE (MAX_RETRIES)
- 타입/인터페이스: PascalCase (UserProfile)

### 파일 구조
- 기능별 폴더: kebab-case (user-dashboard/)
- 컴포넌트 파일: PascalCase.tsx
- Hook 파일: use-hook-name.ts
- 유틸 파일: kebab-case.ts

### Import 순서
1. React 관련
2. 외부 라이브러리
3. 내부 모듈 (@/)
4. 상대 경로
5. 타입 import (type)
