import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Check } from 'lucide-react';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface OnboardingTourProps {
  onComplete: () => void;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const steps: OnboardingStep[] = [
    {
      id: 0,
      title: '환영합니다! 👋',
      description: 'Dashboard Market Hub에 오신 것을 환영합니다. BI 시장 분석의 모든 것을 한곳에서 확인하세요.',
    },
    {
      id: 1,
      title: '시장 개요',
      description: '글로벌 및 국내 BI 시장의 성장 추이와 트렌드를 실시간으로 확인할 수 있습니다.',
      target: 'overview-section',
    },
    {
      id: 2,
      title: '서비스 비교',
      description: 'Tableau, Power BI 등 주요 BI 서비스를 한눈에 비교하고, 비교 도구로 최대 4개까지 동시 분석이 가능합니다.',
      target: 'comparison-section',
    },
    {
      id: 3,
      title: '가격 분석',
      description: 'ROI 계산기로 투자 대비 효과를 미리 계산하고, 사용자 규모별 비용을 비교해보세요.',
      target: 'pricing-section',
    },
    {
      id: 4,
      title: '데이터 내보내기',
      description: '프리미엄 회원은 모든 데이터를 CSV나 Excel로 내보낼 수 있습니다.',
      target: 'export-button',
    },
    {
      id: 5,
      title: '개인 대시보드',
      description: '나만의 대시보드에서 저장된 리포트, 비교 내역, 최근 활동을 확인하세요.',
      target: 'dashboard-link',
    },
    {
      id: 6,
      title: '시작할 준비 완료!',
      description: '이제 Dashboard Market Hub의 모든 기능을 사용할 준비가 되었습니다. 즐거운 분석 되세요!',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem('onboardingCompleted', 'true');
    onComplete();
  };

  if (!isVisible) return null;

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <>
      {/* 오버레이 */}
      <div className="fixed inset-0 bg-black/70 z-[100]" onClick={handleSkip} />

      {/* 투어 카드 */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-lg px-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 relative">
          {/* 닫기 버튼 */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* 진행률 바 */}
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-6">
            <div
              className="h-full bg-primary-600 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* 스텝 카운터 */}
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {currentStep + 1} / {steps.length}
          </div>

          {/* 제목 */}
          <h2 className="text-2xl font-bold mb-3">{step.title}</h2>

          {/* 설명 */}
          <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            {step.description}
          </p>

          {/* 네비게이션 버튼 */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 font-semibold"
            >
              건너뛰기
            </button>

            <div className="flex gap-2">
              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  이전
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    시작하기
                    <Check className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    다음
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 스텝 인디케이터 */}
          <div className="flex justify-center gap-2 mt-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-primary-600'
                    : index < currentStep
                    ? 'w-2 bg-primary-400'
                    : 'w-2 bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default OnboardingTour;
