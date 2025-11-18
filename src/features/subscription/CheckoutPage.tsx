/**
 * Checkout Page - Stripe Integration
 * Redirects users to Stripe Checkout for subscription payments
 */

import React, { useState } from 'react';
import { CreditCard, Lock, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { SUBSCRIPTION_PLANS, SubscriptionTier } from '@/shared/types/subscription';
import { useToast } from '@/shared/contexts/ToastContext';
import { useAuth } from '@/shared/contexts/AuthContext';
import { supabase } from '@/shared/lib/supabase';
import { getPriceId } from '@/shared/lib/stripe/client';

interface CheckoutPageProps {
  selectedTier: SubscriptionTier;
  billingPeriod?: 'monthly' | 'yearly';
  onClose: () => void;
  onSuccess?: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({
  selectedTier,
  billingPeriod = 'monthly',
  onClose
}) => {
  const { error: showError } = useToast();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const plan = SUBSCRIPTION_PLANS.find(p => p.id === selectedTier);

  const handleCheckout = async () => {
    if (!user) {
      showError('로그인이 필요합니다.');
      return;
    }

    if (selectedTier === 'free') {
      showError('무료 플랜은 결제가 필요하지 않습니다.');
      return;
    }

    setIsProcessing(true);

    try {
      // Get Stripe price ID for this tier and billing period
      const priceId = getPriceId(selectedTier, billingPeriod);

      if (!priceId) {
        throw new Error('Price ID not found for selected plan');
      }

      // Call Supabase Edge Function to create checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          priceId,
          customerEmail: user.email,
          userId: user.id,
          tier: selectedTier,
        },
      });

      if (error) throw error;

      if (!data?.url) {
        throw new Error('No checkout URL received');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err: any) {
      console.error('Checkout error:', err);
      showError(err.message || '결제 페이지로 이동하는 중 오류가 발생했습니다.');
      setIsProcessing(false);
    }
  };

  if (!plan) return null;

  const displayPrice = billingPeriod === 'yearly'
    ? Math.floor(plan.price * 12 * 0.8) // 20% discount for yearly
    : plan.price;

  const savings = billingPeriod === 'yearly'
    ? plan.price * 12 - displayPrice
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 mb-6 disabled:opacity-50"
        >
          <ArrowLeft className="w-5 h-5" />
          뒤로 가기
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              {plan.name} 플랜 구독
            </h2>
            <p className="text-purple-100">
              안전하고 빠른 Stripe 결제로 바로 시작하세요
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Plan Summary */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                플랜 요약
              </h3>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {plan.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {billingPeriod === 'yearly' ? '연간 구독' : '월간 구독'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-purple-600">
                      ₩{displayPrice.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {billingPeriod === 'yearly' ? '/ 년' : '/ 월'}
                    </p>
                  </div>
                </div>

                {savings > 0 && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-4">
                    <p className="text-sm text-green-800 dark:text-green-300 font-medium">
                      💰 연간 구독으로 ₩{savings.toLocaleString()} 절약하세요!
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {selectedTier !== 'free' && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      🎉 <strong>14일 무료 체험</strong> - 지금 시작하고 나중에 결제하세요
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Security Features */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                안전한 결제
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      SSL 암호화
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      모든 데이터는 안전하게 암호화됩니다
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Stripe 결제
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      전 세계 수백만 기업이 신뢰하는 결제
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      언제든 취소 가능
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      약정 없이 자유롭게 관리하세요
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  결제 페이지로 이동 중...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  안전하게 결제하기
                </>
              )}
            </button>

            {/* Terms */}
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
              결제를 진행하시면{' '}
              <a href="/terms" className="text-purple-600 hover:underline">
                이용약관
              </a>
              과{' '}
              <a href="/privacy" className="text-purple-600 hover:underline">
                개인정보처리방침
              </a>
              에 동의하는 것으로 간주됩니다.
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            💳 신용카드, 체크카드, Google Pay, Apple Pay 등 다양한 결제 수단을 지원합니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
