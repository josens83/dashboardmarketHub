import React, { useState } from 'react';
import { CreditCard, Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import { SUBSCRIPTION_PLANS, SubscriptionTier } from '../types/subscription';
import { useToast } from '../contexts/ToastContext';
import LoadingSpinner from './LoadingSpinner';

interface CheckoutPageProps {
  selectedTier: SubscriptionTier;
  onClose: () => void;
  onSuccess: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ selectedTier, onClose, onSuccess }) => {
  const { success } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'simple'>('card');

  const plan = SUBSCRIPTION_PLANS.find(p => p.id === selectedTier);

  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvc: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      success('결제가 성공적으로 완료되었습니다! 이제 모든 프리미엄 기능을 사용하실 수 있습니다.');
      onSuccess();
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.slice(0, 19); // 16 digits + 3 spaces
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  if (!plan) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          뒤로 가기
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                결제 정보
              </h2>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  결제 수단 선택
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      paymentMethod === 'card'
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                    }`}
                  >
                    <CreditCard className="w-6 h-6 mx-auto mb-2 text-gray-700 dark:text-gray-300" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">카드</p>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('bank')}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      paymentMethod === 'bank'
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">🏦</div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">계좌이체</p>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('simple')}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      paymentMethod === 'simple'
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">📱</div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">간편결제</p>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {paymentMethod === 'card' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        카드 번호
                      </label>
                      <input
                        type="text"
                        value={cardData.cardNumber}
                        onChange={(e) => setCardData({ ...cardData, cardNumber: formatCardNumber(e.target.value) })}
                        placeholder="1234 5678 9012 3456"
                        required
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        카드 소유자 이름
                      </label>
                      <input
                        type="text"
                        value={cardData.cardName}
                        onChange={(e) => setCardData({ ...cardData, cardName: e.target.value })}
                        placeholder="HONG GILDONG"
                        required
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          만료일
                        </label>
                        <input
                          type="text"
                          value={cardData.expiryDate}
                          onChange={(e) => setCardData({ ...cardData, expiryDate: formatExpiryDate(e.target.value) })}
                          placeholder="MM/YY"
                          required
                          maxLength={5}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          CVC
                        </label>
                        <input
                          type="text"
                          value={cardData.cvc}
                          onChange={(e) => setCardData({ ...cardData, cvc: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                          placeholder="123"
                          required
                          maxLength={3}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </>
                )}

                {paymentMethod === 'bank' && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      계좌이체를 선택하셨습니다. 다음 단계에서 계좌 정보가 표시됩니다.
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      입금 확인 후 자동으로 구독이 활성화됩니다.
                    </p>
                  </div>
                )}

                {paymentMethod === 'simple' && (
                  <div className="space-y-3">
                    <button
                      type="button"
                      className="w-full p-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="text-xl">💬</span>
                      카카오페이
                    </button>
                    <button
                      type="button"
                      className="w-full p-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="text-xl">N</span>
                      네이버페이
                    </button>
                    <button
                      type="button"
                      className="w-full p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="text-xl">T</span>
                      토스페이
                    </button>
                  </div>
                )}

                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        {plan.price === 0 ? '무료로 시작하기' : `₩${plan.price.toLocaleString()} 결제하기`}
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Lock className="w-4 h-4" />
                  안전한 결제 (Toss Payments)
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                주문 요약
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">플랜</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{plan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">결제 주기</span>
                  <span className="text-gray-900 dark:text-white">월간</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">14일 무료 체험</span>
                  <span className="text-green-600 dark:text-green-400">-₩{plan.price.toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">오늘 결제</span>
                  <span className="text-2xl font-bold text-purple-600">₩0</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  2024년 2월 1일부터 ₩{plan.price.toLocaleString()}/월
                </p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  포함 기능
                </h4>
                <ul className="space-y-2">
                  {plan.features.slice(0, 5).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <p>• 언제든지 취소 가능</p>
                <p>• 14일 무료 체험 기간 내 취소 시 요금 청구 없음</p>
                <p>• 안전한 결제 보장</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
