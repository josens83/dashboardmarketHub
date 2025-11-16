export type SubscriptionTier = 'free' | 'premium' | 'enterprise';

export interface User {
  id: string;
  email: string;
  name: string;
  subscriptionTier: SubscriptionTier;
  subscriptionStatus: 'active' | 'trial' | 'expired' | 'cancelled';
  trialEndsAt?: Date;
  subscribedAt?: Date;
  features: string[];
}

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  price: number;
  billingPeriod: 'monthly' | 'annual';
  features: string[];
  limits: {
    pdfExports: number | 'unlimited';
    dataExports: number | 'unlimited';
    savedReports: number | 'unlimited';
    comparisons: number | 'unlimited';
  };
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: '무료',
    price: 0,
    billingPeriod: 'monthly',
    features: [
      '기본 시장 분석 대시보드',
      '주요 서비스 비교 (제한적)',
      '월 3회 PDF 내보내기',
      '기본 차트 및 시각화',
    ],
    limits: {
      pdfExports: 3,
      dataExports: 0,
      savedReports: 3,
      comparisons: 2,
    },
  },
  {
    id: 'premium',
    name: '프리미엄',
    price: 29000,
    billingPeriod: 'monthly',
    features: [
      '모든 무료 기능 포함',
      '고급 분석 및 필터링',
      '무제한 PDF 내보내기',
      'Excel/CSV 데이터 내보내기',
      '무제한 비교 분석',
      '저장된 리포트 관리',
      '우선 고객 지원',
    ],
    limits: {
      pdfExports: 'unlimited',
      dataExports: 'unlimited',
      savedReports: 'unlimited',
      comparisons: 'unlimited',
    },
  },
  {
    id: 'enterprise',
    name: '엔터프라이즈',
    price: 99000,
    billingPeriod: 'monthly',
    features: [
      '모든 프리미엄 기능 포함',
      'API 접근',
      '커스텀 데이터 소스 연동',
      '팀 협업 기능',
      '전담 계정 매니저',
      'SLA 보장',
      '온사이트 교육',
      '커스텀 리포트 개발',
    ],
    limits: {
      pdfExports: 'unlimited',
      dataExports: 'unlimited',
      savedReports: 'unlimited',
      comparisons: 'unlimited',
    },
  },
];
