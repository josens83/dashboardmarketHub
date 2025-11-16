import React from 'react';
import { X, Check, Crown, Zap, Building } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../types/subscription';
import { useAuth } from '../contexts/AuthContext';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  const { user, upgradeTier } = useAuth();

  if (!isOpen) return null;

  const handleUpgrade = (tier: 'free' | 'premium' | 'enterprise') => {
    upgradeTier(tier);
    onClose();
  };

  const tierIcons = {
    free: Zap,
    premium: Crown,
    enterprise: Building,
  };

  const tierColors = {
    free: 'text-gray-600',
    premium: 'text-yellow-600',
    enterprise: 'text-purple-600',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full p-6 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">요금제 선택</h2>
          <p className="text-gray-600 dark:text-gray-400">
            비즈니스에 맞는 최적의 플랜을 선택하세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const Icon = tierIcons[plan.id];
            const isCurrentPlan = user?.subscriptionTier === plan.id;
            const isPremiumPlan = plan.id === 'premium';

            return (
              <div
                key={plan.id}
                className={`relative rounded-lg border-2 p-6 ${
                  isPremiumPlan
                    ? 'border-primary-600 shadow-xl scale-105'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {isPremiumPlan && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      인기
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <Icon className={`w-12 h-12 mx-auto mb-3 ${tierColors[plan.id]}`} />
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">
                      {plan.price === 0 ? '무료' : `₩${plan.price.toLocaleString()}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-600 dark:text-gray-400">/월</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={isCurrentPlan}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    isCurrentPlan
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                      : isPremiumPlan
                      ? 'bg-primary-600 hover:bg-primary-700 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {isCurrentPlan ? '현재 플랜' : plan.id === 'free' ? '무료로 시작' : '업그레이드'}
                </button>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-2">
                    이용 한도
                  </p>
                  <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    <p>
                      PDF 내보내기:{' '}
                      {plan.limits.pdfExports === 'unlimited'
                        ? '무제한'
                        : `월 ${plan.limits.pdfExports}회`}
                    </p>
                    <p>
                      데이터 내보내기:{' '}
                      {plan.limits.dataExports === 'unlimited'
                        ? '무제한'
                        : plan.limits.dataExports === 0
                        ? '불가'
                        : `월 ${plan.limits.dataExports}회`}
                    </p>
                    <p>
                      저장된 리포트:{' '}
                      {plan.limits.savedReports === 'unlimited'
                        ? '무제한'
                        : `최대 ${plan.limits.savedReports}개`}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            모든 요금제는 언제든지 변경 가능하며, 환불 정책이 적용됩니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
