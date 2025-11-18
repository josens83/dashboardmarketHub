# 🚀 Dashboard Market Hub - 배포 가이드

이 문서는 Dashboard Market Hub를 프로덕션 환경에 배포하는 방법을 설명합니다.

## 📋 목차

1. [사전 요구사항](#사전-요구사항)
2. [환경 설정](#환경-설정)
3. [Docker로 배포](#docker로-배포)
4. [클라우드 플랫폼 배포](#클라우드-플랫폼-배포)
5. [백엔드 연동](#백엔드-연동)
6. [SSL/TLS 설정](#ssltls-설정)
7. [모니터링 및 로깅](#모니터링-및-로깅)

---

## 🔧 사전 요구사항

### 필수

- **Node.js** 18 이상
- **npm** 또는 **yarn**
- **Docker** (Docker 배포 시)
- **Git**

### 권장

- **PostgreSQL** 15 이상 (백엔드 데이터베이스)
- **Redis** 7 이상 (캐시, 세션)
- **Nginx** (리버스 프록시)
- **SSL 인증서** (Let's Encrypt 권장)

---

## ⚙️ 환경 설정

### 1. 환경 변수 파일 생성

```bash
cp .env.example .env
```

### 2. `.env` 파일 수정

필수 환경 변수를 실제 값으로 변경하세요:

```env
# API 설정
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_WS_URL=wss://ws.yourdomain.com

# 에러 추적 (Sentry 등)
VITE_ERROR_TRACKING_ENDPOINT=https://your-sentry-dsn

# 결제 (Stripe 또는 Toss)
STRIPE_PUBLIC_KEY=pk_live_your_key
STRIPE_SECRET_KEY=sk_live_your_key

# 데이터베이스
DATABASE_URL=postgresql://user:password@localhost:5432/dashboard_market_hub
```

---

## 🐳 Docker로 배포

### 로컬 Docker 빌드 및 실행

```bash
# 1. Docker 이미지 빌드
docker build -t dashboard-market-hub:latest .

# 2. 컨테이너 실행
docker run -d -p 80:80 --name dmhub dashboard-market-hub:latest

# 3. 로그 확인
docker logs -f dmhub
```

### Docker Compose로 전체 스택 실행

```bash
# 1. docker-compose.yml 확인
# 백엔드, PostgreSQL, Redis 등 필요한 서비스 주석 해제

# 2. 실행
docker-compose up -d

# 3. 상태 확인
docker-compose ps

# 4. 로그 확인
docker-compose logs -f

# 5. 중지
docker-compose down
```

---

## ☁️ 클라우드 플랫폼 배포

### Vercel 배포

```bash
# 1. Vercel CLI 설치
npm install -g vercel

# 2. 로그인
vercel login

# 3. 배포
vercel --prod
```

**환경 변수 설정:**
- Vercel 대시보드 → Settings → Environment Variables
- `.env.example`의 모든 변수 추가

### Netlify 배포

```bash
# 1. Netlify CLI 설치
npm install -g netlify-cli

# 2. 로그인
netlify login

# 3. 빌드
npm run build

# 4. 배포
netlify deploy --prod --dir=dist
```

**빌드 설정:**
- Build command: `npm run build`
- Publish directory: `dist`

### AWS (EC2 + S3 + CloudFront)

#### S3 + CloudFront (정적 호스팅)

```bash
# 1. 빌드
npm run build

# 2. S3 버킷에 업로드
aws s3 sync dist/ s3://your-bucket-name --delete

# 3. CloudFront 캐시 무효화
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

#### EC2 (Docker)

```bash
# 1. EC2 인스턴스에 SSH 접속
ssh -i your-key.pem ubuntu@your-ec2-ip

# 2. Docker 설치 (없는 경우)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 3. 프로젝트 클론
git clone https://github.com/your-repo/dashboard-market-hub.git
cd dashboard-market-hub

# 4. 환경 변수 설정
nano .env

# 5. Docker Compose 실행
docker-compose up -d
```

### Google Cloud Platform (Cloud Run)

```bash
# 1. gcloud CLI 설치 및 로그인
gcloud auth login

# 2. 프로젝트 설정
gcloud config set project YOUR_PROJECT_ID

# 3. Cloud Build로 이미지 빌드
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/dashboard-market-hub

# 4. Cloud Run에 배포
gcloud run deploy dashboard-market-hub \
  --image gcr.io/YOUR_PROJECT_ID/dashboard-market-hub \
  --platform managed \
  --region asia-northeast1 \
  --allow-unauthenticated
```

---

## 🔌 백엔드 연동

### API 엔드포인트 설정

프론트엔드는 이미 백엔드 연동을 위한 API 클라이언트가 구현되어 있습니다.

**필요한 API 엔드포인트:**

```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/dashboard/market-overview
GET    /api/dashboard/service-comparison
GET    /api/dashboard/pricing-analysis
GET    /api/dashboard/industry-analysis

GET    /api/reports
POST   /api/reports
DELETE /api/reports/:id
POST   /api/reports/:id/export

GET    /api/subscription
POST   /api/subscription/upgrade
DELETE /api/subscription/cancel

GET    /api/team/members
POST   /api/team/invite
DELETE /api/team/members/:id

GET    /api/activity/logs
POST   /api/activity/export

GET    /api/webhooks
POST   /api/webhooks
PUT    /api/webhooks/:id
DELETE /api/webhooks/:id

GET    /api/templates
POST   /api/templates/:id/use

POST   /api/data/export
POST   /api/data/import

GET    /api/admin/stats
GET    /api/admin/users
POST   /api/admin/users/:id/suspend
```

### WebSocket 서버 설정

WebSocket 연결은 `ws://` 또는 `wss://` 프로토콜을 사용합니다.

**필수 이벤트:**

- `notification` - 실시간 알림
- `collaboration` - 협업 이벤트
- `data_update` - 데이터 업데이트
- `user_activity` - 사용자 활동

**백엔드 WebSocket 서버 예시 (Node.js + Socket.IO):**

```javascript
const io = require('socket.io')(server, {
  cors: { origin: process.env.FRONTEND_URL }
});

io.on('connection', (socket) => {
  // 인증 확인
  const token = socket.handshake.query.token;
  // verify token...

  // 메시지 수신
  socket.on('message', (data) => {
    // 메시지 처리 및 브로드캐스트
    io.emit(data.type, data.payload);
  });
});
```

---

## 🔐 SSL/TLS 설정

### Let's Encrypt (Certbot)

```bash
# 1. Certbot 설치
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# 2. SSL 인증서 발급
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 3. 자동 갱신 설정
sudo certbot renew --dry-run
```

### Nginx SSL 설정

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL 설정
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000" always;

    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
}

# HTTP → HTTPS 리다이렉트
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 📊 모니터링 및 로깅

### Sentry (에러 추적)

1. [Sentry.io](https://sentry.io) 가입
2. 프로젝트 생성
3. DSN 복사
4. `.env`에 추가:
   ```env
   VITE_ERROR_TRACKING_ENDPOINT=https://your-dsn@sentry.io/project-id
   ```

### Google Analytics

1. Google Analytics 계정 생성
2. 추적 ID 복사
3. `.env`에 추가:
   ```env
   VITE_GA_TRACKING_ID=G-XXXXXXXXXX
   ```

### Nginx 로그

```bash
# 액세스 로그
tail -f /var/log/nginx/access.log

# 에러 로그
tail -f /var/log/nginx/error.log
```

### Docker 로그

```bash
# 특정 컨테이너 로그
docker logs -f container_name

# 모든 서비스 로그
docker-compose logs -f
```

---

## 🧪 프로덕션 체크리스트

배포 전 확인사항:

- [ ] 환경 변수 모두 설정
- [ ] API 엔드포인트 연결 테스트
- [ ] WebSocket 연결 테스트
- [ ] 결제 게이트웨이 테스트
- [ ] 이메일 전송 테스트
- [ ] SSL 인증서 설정
- [ ] 보안 헤더 설정
- [ ] CORS 설정
- [ ] Rate Limiting 설정
- [ ] 에러 추적 설정 (Sentry)
- [ ] 분석 도구 설정 (GA)
- [ ] 백업 시스템 구축
- [ ] 모니터링 설정
- [ ] 로그 수집 설정
- [ ] 성능 테스트
- [ ] 보안 감사

---

## 📞 지원

문제가 발생하면 다음 리소스를 확인하세요:

- **문서**: [README.md](./README.md)
- **이슈 트래커**: GitHub Issues
- **이메일**: support@yourdomain.com

---

## 📝 라이선스

MIT License - 자세한 내용은 [LICENSE](./LICENSE) 파일 참조
