# 🚀 Supabase 설정 가이드

Dashboard Market Hub을 Supabase 백엔드로 구동하는 방법입니다.

## 📋 목차

1. [Supabase 프로젝트 생성](#1-supabase-프로젝트-생성)
2. [데이터베이스 스키마 설정](#2-데이터베이스-스키마-설정)
3. [환경 변수 설정](#3-환경-변수-설정)
4. [인증 설정](#4-인증-설정)
5. [Row Level Security (RLS) 확인](#5-row-level-security-확인)
6. [실시간 기능 활성화](#6-실시간-기능-활성화)
7. [테스트](#7-테스트)

---

## 1. Supabase 프로젝트 생성

### 1.1 Supabase 계정 만들기
1. [Supabase](https://supabase.com) 접속
2. **Start your project** 클릭
3. GitHub 또는 이메일로 가입

### 1.2 새 프로젝트 생성
1. Dashboard에서 **New Project** 클릭
2. 프로젝트 정보 입력:
   - **Name**: `dashboard-market-hub` (또는 원하는 이름)
   - **Database Password**: 강력한 비밀번호 생성 (복사해두기!)
   - **Region**: `Northeast Asia (Seoul)` 선택 (한국)
   - **Pricing Plan**: Free 플랜으로 시작 가능
3. **Create new project** 클릭
4. 프로젝트 생성 완료까지 1-2분 대기

---

## 2. 데이터베이스 스키마 설정

### 2.1 SQL Editor에서 스키마 실행
1. Supabase 대시보드 좌측 메뉴에서 **SQL Editor** 클릭
2. **New query** 클릭
3. 프로젝트의 `supabase-schema.sql` 파일 내용을 복사
4. SQL Editor에 붙여넣기
5. 우측 하단 **Run** 버튼 클릭 (또는 `Ctrl/Cmd + Enter`)

### 2.2 생성된 테이블 확인
1. 좌측 메뉴에서 **Table Editor** 클릭
2. 다음 테이블들이 생성되었는지 확인:
   - ✅ `users` - 사용자 프로필
   - ✅ `subscriptions` - 구독 정보
   - ✅ `reports` - 저장된 리포트
   - ✅ `teams` - 팀
   - ✅ `team_members` - 팀 멤버
   - ✅ `activity_logs` - 활동 로그
   - ✅ `payment_history` - 결제 내역
   - ✅ `webhooks` - 웹훅
   - ✅ `dashboard_templates` - 대시보드 템플릿

---

## 3. 환경 변수 설정

### 3.1 API 키 가져오기
1. Supabase 대시보드에서 **Settings** (⚙️) 클릭
2. **API** 메뉴 선택
3. 다음 정보 복사:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public** key: `eyJhbGc...` (긴 JWT 토큰)

### 3.2 .env 파일 생성
프로젝트 루트에서:

```bash
# .env.example을 복사하여 .env 생성
cp .env.example .env
```

### 3.3 .env 파일 수정
`.env` 파일을 열고 Supabase 정보 입력:

```env
# Supabase 설정
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**⚠️ 중요**: `.env` 파일은 절대 Git에 커밋하지 마세요! (이미 `.gitignore`에 추가됨)

---

## 4. 인증 설정

### 4.1 이메일 인증 설정
1. Supabase 대시보드에서 **Authentication** 클릭
2. **Settings** → **Auth Providers** 선택
3. **Email** 활성화 확인
4. 선택사항:
   - **Confirm email**: 이메일 확인 필요 여부 (개발 중에는 OFF 권장)
   - **Secure email change**: 이메일 변경 시 확인 필요

### 4.2 소셜 로그인 추가 (선택사항)
Google, GitHub 등 소셜 로그인을 추가하려면:

1. **Auth Providers**에서 원하는 제공자 선택
2. OAuth 설정:
   - Google: [Google Cloud Console](https://console.cloud.google.com)에서 OAuth 클라이언트 생성
   - GitHub: [GitHub Developer Settings](https://github.com/settings/developers)에서 OAuth App 생성
3. Client ID와 Secret을 Supabase에 입력

### 4.3 Redirect URLs 설정
1. **URL Configuration** 섹션에서 다음 URL 추가:
   ```
   http://localhost:5173
   https://yourdomain.com
   ```
2. **Save** 클릭

---

## 5. Row Level Security (RLS) 확인

### 5.1 RLS 정책 확인
스키마에 이미 포함되어 있지만, 확인 방법:

1. **Authentication** → **Policies** 선택
2. 각 테이블에 정책이 설정되었는지 확인
3. 예시 (users 테이블):
   - ✅ "Users can view own profile"
   - ✅ "Users can update own profile"

### 5.2 RLS 활성화 확인
1. **Table Editor**에서 각 테이블 선택
2. 우측 상단 **...** 메뉴 → **View Policies**
3. "Row Level Security" 토글이 **ON** 상태인지 확인

---

## 6. 실시간 기능 활성화

### 6.1 Realtime 설정
1. **Database** → **Replication** 선택
2. 실시간으로 모니터링할 테이블 선택:
   - `reports` ✅
   - `activity_logs` ✅
   - `team_members` ✅
3. 각 테이블의 **Enable Realtime** 토글 ON

### 6.2 확인
```javascript
// 프론트엔드에서 테스트
import { realtimeHelpers } from './lib/supabase';

realtimeHelpers.subscribeToTable('reports', (payload) => {
  console.log('실시간 변경:', payload);
});
```

---

## 7. 테스트

### 7.1 로컬 개발 서버 시작
```bash
npm run dev
```

### 7.2 회원가입 테스트
1. 브라우저에서 `http://localhost:5173` 접속
2. 회원가입 폼에서 테스트 계정 생성:
   - 이메일: `test@example.com`
   - 비밀번호: 최소 6자 이상
   - 이름: `테스트 사용자`
3. 회원가입 성공 시:
   - `users` 테이블에 새 레코드 생성 확인
   - `subscriptions` 테이블에 무료 구독 생성 확인

### 7.3 로그인 테스트
1. 같은 계정으로 로그인
2. 브라우저 개발자 도구 → Application → Local Storage 확인
3. Supabase 세션 정보가 저장되었는지 확인

### 7.4 데이터 확인
1. Supabase 대시보드 → **Table Editor**
2. `users` 테이블에서 생성된 사용자 확인
3. `activity_logs` 테이블에서 로그인 활동 확인

---

## 🔧 문제 해결

### "Invalid API key" 오류
- `.env` 파일에 올바른 `VITE_SUPABASE_ANON_KEY` 입력 확인
- 개발 서버 재시작: `npm run dev`

### "Row Level Security policy violation" 오류
- RLS 정책이 올바르게 설정되었는지 확인
- SQL Editor에서 `supabase-schema.sql` 재실행

### 회원가입 후 이메일이 오지 않음
- **Authentication** → **Email Templates**에서 템플릿 확인
- 개발 중에는 이메일 확인 비활성화 권장

### 실시간 기능이 작동하지 않음
- **Database** → **Replication**에서 Realtime 활성화 확인
- 브라우저 콘솔에서 WebSocket 연결 에러 확인

---

## 📊 다음 단계

### Stripe 결제 연동
1. [Stripe](https://stripe.com) 계정 생성
2. API 키 가져오기
3. `.env`에 Stripe 키 추가
4. Webhook 설정 (구독 상태 업데이트)

### 프로덕션 배포
1. 환경 변수를 프로덕션 플랫폼에 설정 (Vercel, Netlify 등)
2. Supabase에서 프로덕션 도메인을 Redirect URLs에 추가
3. RLS 정책 재확인
4. 성능 모니터링 설정

---

## 📞 지원

- **Supabase 문서**: https://supabase.com/docs
- **Supabase Discord**: https://discord.supabase.com
- **프로젝트 이슈**: GitHub Issues

---

## ✅ 체크리스트

배포 전 확인:

- [ ] Supabase 프로젝트 생성 완료
- [ ] 데이터베이스 스키마 실행 완료
- [ ] 환경 변수 (.env) 설정 완료
- [ ] 회원가입/로그인 테스트 완료
- [ ] RLS 정책 확인 완료
- [ ] Realtime 기능 활성화 완료
- [ ] 프로덕션 Redirect URLs 추가 완료
- [ ] Stripe 연동 완료 (선택사항)
- [ ] 백업 설정 완료
- [ ] 모니터링 설정 완료

---

축하합니다! 🎉 이제 Supabase 백엔드가 준비되었습니다.
