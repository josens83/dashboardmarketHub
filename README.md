# Dashboard Market Hub

유료 대시보드 구축 서비스 시장 분석을 위한 인터랙티브 플랫폼

## 주요 기능

- 📊 **시장 개요**: 글로벌 및 국내 BI 시장 규모 추이 분석
- 🔍 **서비스 비교**: Tableau, Power BI, Qlik Sense 등 주요 솔루션 비교
- 💰 **가격 분석**: 서비스별 비용 비교 및 ROI 계산
- 🏭 **산업별 분석**: 제조, 금융, 유통, 물류 등 산업별 수요 분석
- 🌙 **다크모드**: 눈의 피로를 줄이는 다크모드 지원
- 📱 **반응형**: 웹, 태블릿, 모바일 모든 기기 지원
- 📄 **PDF 내보내기**: 분석 결과를 PDF로 저장

## 기술 스택

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **PDF Export**: jsPDF + html2canvas

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

### 프로덕션 빌드

```bash
npm run build
```

### 프리뷰

```bash
npm run preview
```

## 프로젝트 구조

```
src/
├── components/       # React 컴포넌트
├── data/            # 시장 데이터 및 상수
├── types/           # TypeScript 타입 정의
├── utils/           # 유틸리티 함수
├── App.tsx          # 메인 앱 컴포넌트
└── main.tsx         # 엔트리 포인트
```

## 라이선스

MIT
