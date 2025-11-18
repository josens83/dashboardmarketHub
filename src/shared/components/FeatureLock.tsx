import React, { useState } from 'react';
import { Lock, Crown } from 'lucide-react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { PricingModal } from '@/features/subscription';

interface FeatureLockProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgrade?: boolean;
}

const FeatureLock: React.FC<FeatureLockProps> = ({
  feature,
  children,
  fallback,
  showUpgrade = true,
}) => {
  const { canUseFeature } = useAuth();
  const [showPricing, setShowPricing] = useState(false);

  const hasAccess = canUseFeature(feature);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <>
      <div className="relative">
        <div className="filter blur-sm pointer-events-none">{children}</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md text-center">
            <Lock className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">프리미엄 기능</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              이 기능은 프리미엄 요금제 이상에서 사용 가능합니다.
            </p>
            {showUpgrade && (
              <button
                onClick={() => setShowPricing(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <Crown className="w-5 h-5" />
                업그레이드
              </button>
            )}
          </div>
        </div>
      </div>

      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </>
  );
};

export default FeatureLock;
