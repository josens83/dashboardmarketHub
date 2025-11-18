import { MarketData, ServiceComparison, IndustryDemand } from '@/shared/types';

// 글로벌 및 국내 시장 규모 데이터 (단위: 십억 달러 / 조원)
export const marketGrowthData: MarketData[] = [
  { year: 2022, global: 27.1, domestic: 2.5 },
  { year: 2023, global: 28.9, domestic: 2.7 },
  { year: 2024, global: 31.99, domestic: 3.1 },
  { year: 2025, global: 35.5, domestic: 3.4 },
  { year: 2026, global: 39.8, domestic: 3.7 },
  { year: 2027, global: 44.5, domestic: 3.97 },
  { year: 2028, global: 49.8, domestic: 4.3 },
  { year: 2029, global: 55.2, domestic: 4.6 },
  { year: 2030, global: 58.5, domestic: 4.9 },
  { year: 2031, global: 61.2, domestic: 5.1 },
  { year: 2032, global: 63.0, domestic: 5.3 },
];

// CAGR (연평균 성장률)
export const marketCAGR = {
  global: 8.9,  // 2024-2032 CAGR
  domestic: 10.2, // 2023-2027 CAGR
};

// 주요 서비스 비교 데이터
export const serviceComparisons: ServiceComparison[] = [
  {
    id: 'tableau',
    name: 'Tableau',
    vendor: 'Salesforce',
    pricingModel: 'subscription',
    monthlyPrice: 70,
    annualPrice: 840,
    userTier: 'Creator',
    features: [
      '고급 데이터 시각화',
      '실시간 대시보드',
      'AI 기반 분석',
      '모바일 앱 지원',
      '1000+ 데이터 소스 연결',
    ],
    pros: [
      '직관적인 드래그 앤 드롭 인터페이스',
      '강력한 시각화 기능',
      '대규모 커뮤니티 및 리소스',
    ],
    cons: [
      '높은 라이선스 비용',
      '복잡한 계산 시 성능 저하',
    ],
    marketShare: 28,
  },
  {
    id: 'powerbi',
    name: 'Power BI',
    vendor: 'Microsoft',
    pricingModel: 'subscription',
    monthlyPrice: 14,
    annualPrice: 168,
    userTier: 'Pro',
    features: [
      'Microsoft 365 통합',
      '자연어 질의',
      'AI 인사이트',
      '실시간 스트리밍',
      'Excel 연동',
    ],
    pros: [
      '저렴한 가격',
      'Microsoft 생태계와 완벽한 통합',
      '쉬운 학습 곡선',
    ],
    cons: [
      '대용량 데이터 처리 제한',
      '커스터마이징 제한',
    ],
    marketShare: 35,
  },
  {
    id: 'qlik',
    name: 'Qlik Sense',
    vendor: 'Qlik',
    pricingModel: 'subscription',
    monthlyPrice: 30,
    annualPrice: 360,
    userTier: 'Professional',
    features: [
      '연관 분석 엔진',
      '셀프 서비스 BI',
      'AI 기반 인사이트',
      '확장 가능한 아키텍처',
      '하이브리드 클라우드 지원',
    ],
    pros: [
      '독특한 연관 데이터 모델',
      '뛰어난 데이터 탐색 기능',
      '유연한 배포 옵션',
    ],
    cons: [
      '상대적으로 복잡한 설정',
      '제한된 시각화 옵션',
    ],
    marketShare: 12,
  },
  {
    id: 'looker',
    name: 'Looker',
    vendor: 'Google Cloud',
    pricingModel: 'subscription',
    monthlyPrice: 50,
    annualPrice: 600,
    userTier: 'Standard',
    features: [
      'LookML 모델링 언어',
      'Google Cloud 통합',
      '임베디드 분석',
      'API 우선 설계',
      '중앙 집중식 거버넌스',
    ],
    pros: [
      '강력한 데이터 모델링',
      '확장성이 뛰어난 아키텍처',
      'Google Cloud와 원활한 통합',
    ],
    cons: [
      '가파른 학습 곡선',
      'LookML 학습 필요',
    ],
    marketShare: 8,
  },
  {
    id: 'domo',
    name: 'Domo',
    vendor: 'Domo Inc.',
    pricingModel: 'subscription',
    monthlyPrice: 83,
    annualPrice: 996,
    userTier: 'Standard',
    features: [
      '1000+ 클라우드 앱 커넥터',
      '실시간 데이터 업데이트',
      'Magic ETL',
      '모바일 우선 설계',
      '협업 기능',
    ],
    pros: [
      '포괄적인 클라우드 통합',
      '사용하기 쉬운 인터페이스',
      '뛰어난 모바일 경험',
    ],
    cons: [
      '높은 비용',
      '제한된 커스터마이징',
    ],
    marketShare: 5,
  },
  {
    id: 'sisense',
    name: 'Sisense',
    vendor: 'Sisense Inc.',
    pricingModel: 'project',
    userTier: 'Enterprise',
    features: [
      '인메모리 큐브 기술',
      '임베디드 분석',
      'AI 기반 인사이트',
      '다중 소스 데이터 결합',
      'White Label 지원',
    ],
    pros: [
      '복잡한 데이터 처리에 강함',
      '우수한 임베디드 분석',
      '확장 가능한 아키텍처',
    ],
    cons: [
      '프로젝트 기반 가격으로 예측 어려움',
      '상대적으로 작은 커뮤니티',
    ],
    marketShare: 4,
  },
];

// 산업별 수요 분석
export const industryDemands: IndustryDemand[] = [
  {
    industry: '제조',
    adoptionRate: 78,
    primaryKPIs: ['생산성', '품질 관리', '재고 최적화', '설비 가동률', '불량률'],
    averageROI: 240,
    implementationTime: 6,
    caseStudies: [
      {
        company: '한국타이어',
        industry: '제조',
        solution: 'Tableau',
        results: [
          '리포트 개발 시간 75% 단축',
          '실시간 생산 모니터링 구현',
          '의사결정 속도 3배 향상',
        ],
        timeReduction: 75,
        costSavings: 35,
      },
    ],
  },
  {
    industry: '금융',
    adoptionRate: 85,
    primaryKPIs: ['리스크 관리', '고객 세그먼트', '거래량 분석', '사기 탐지', 'KYC 준수'],
    averageROI: 320,
    implementationTime: 8,
    caseStudies: [
      {
        company: '글로벌 은행',
        industry: '금융',
        solution: 'Power BI',
        results: [
          '리스크 리포팅 자동화',
          '실시간 거래 모니터링',
          '컴플라이언스 비용 40% 절감',
        ],
        costSavings: 40,
      },
    ],
  },
  {
    industry: '유통',
    adoptionRate: 72,
    primaryKPIs: ['매출 분석', '재고 회전율', '고객 이탈률', '장바구니 분석', '프로모션 효과'],
    averageROI: 280,
    implementationTime: 5,
    caseStudies: [
      {
        company: '대형 마트 체인',
        industry: '유통',
        solution: 'Qlik Sense',
        results: [
          '재고 최적화로 비용 25% 절감',
          '프로모션 효과 분석으로 매출 15% 증가',
          '실시간 매장별 성과 추적',
        ],
        costSavings: 25,
      },
    ],
  },
  {
    industry: '물류',
    adoptionRate: 68,
    primaryKPIs: ['배송 시간', '운송 비용', '재고 정확도', '차량 가동률', '고객 만족도'],
    averageROI: 210,
    implementationTime: 6,
    caseStudies: [
      {
        company: '물류 기업',
        industry: '물류',
        solution: 'Domo',
        results: [
          '배송 시간 20% 단축',
          '운송 비용 18% 절감',
          '실시간 배송 추적 시스템 구축',
        ],
        timeReduction: 20,
        costSavings: 18,
      },
    ],
  },
  {
    industry: '헬스케어',
    adoptionRate: 65,
    primaryKPIs: ['환자 결과', '운영 효율성', '비용 관리', '품질 지표', '규제 준수'],
    averageROI: 190,
    implementationTime: 9,
    caseStudies: [
      {
        company: '종합 병원',
        industry: '헬스케어',
        solution: 'Tableau',
        results: [
          '환자 대기 시간 30% 감소',
          '운영 비용 22% 절감',
          '의료 품질 지표 개선',
        ],
        timeReduction: 30,
        costSavings: 22,
      },
    ],
  },
  {
    industry: 'IT/통신',
    adoptionRate: 82,
    primaryKPIs: ['시스템 가용성', '네트워크 성능', '고객 이탈', '서비스 품질', '매출 분석'],
    averageROI: 300,
    implementationTime: 7,
    caseStudies: [
      {
        company: '통신사',
        industry: 'IT/통신',
        solution: 'Looker',
        results: [
          '네트워크 장애 예측 정확도 85% 향상',
          '고객 이탈률 15% 감소',
          '실시간 서비스 품질 모니터링',
        ],
      },
    ],
  },
];

// 가격 비교 데이터
export const pricingComparison = {
  services: ['Tableau', 'Power BI', 'Qlik Sense', 'Looker', 'Domo'],
  tiers: {
    small: { users: 10, label: '소규모 (10명)' },
    medium: { users: 50, label: '중규모 (50명)' },
    large: { users: 200, label: '대규모 (200명)' },
  },
  calculations: {
    tableau: { small: 840, medium: 4200, large: 16800 },
    powerbi: { small: 168, medium: 840, large: 3360 },
    qlik: { small: 360, medium: 1800, large: 7200 },
    looker: { small: 600, medium: 3000, large: 12000 },
    domo: { small: 996, medium: 4980, large: 19920 },
  },
};
