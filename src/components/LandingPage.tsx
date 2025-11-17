import React, { useState } from 'react';
import { BarChart3, TrendingUp, Shield, Zap, CheckCircle, Star, ArrowRight, Users, Clock, Award } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { SUBSCRIPTION_PLANS } from '../types/subscription';

interface LandingPageProps {
  onGetStarted: () => void;
  onViewPricing: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onViewPricing }) => {
  const { user } = useAuth();
  const [activePlan, setActivePlan] = useState<number>(1);

  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: '실시간 시장 분석',
      description: 'BI 대시보드 시장의 최신 트렌드와 성장률을 실시간으로 확인하세요.'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: '경쟁사 비교',
      description: 'Tableau, Power BI, Qlik 등 주요 서비스를 한눈에 비교하고 분석하세요.'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: '신뢰할 수 있는 데이터',
      description: '검증된 시장 조사 데이터를 기반으로 정확한 인사이트를 제공합니다.'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: '빠른 리포트 생성',
      description: 'PDF, Excel로 즉시 내보내기하여 프레젠테이션에 바로 활용하세요.'
    }
  ];

  const benefits = [
    '전 세계 BI 시장 트렌드 파악',
    '데이터 기반 의사결정',
    '경쟁 우위 확보',
    '비용 절감 및 ROI 향상'
  ];

  const testimonials = [
    {
      name: '김민수',
      role: 'CTO, TechCorp',
      content: '대시보드 마켓 허브 덕분에 우리 회사에 맞는 BI 솔루션을 빠르게 선택할 수 있었습니다. 시장 분석 리포트가 정말 유용했어요.',
      rating: 5
    },
    {
      name: '이지은',
      role: '데이터 분석가, StartupCo',
      content: '여러 BI 도구를 비교하느라 시간이 많이 걸렸는데, 여기서 모든 정보를 한 번에 확인할 수 있어서 정말 편리합니다.',
      rating: 5
    },
    {
      name: '박준형',
      role: '프로덕트 매니저, DataLabs',
      content: '산업별 분석 기능이 특히 마음에 듭니다. 우리 산업에 최적화된 대시보드를 찾는 데 큰 도움이 되었습니다.',
      rating: 5
    }
  ];

  const stats = [
    { icon: <Users className="w-6 h-6" />, value: '10,000+', label: '활성 사용자' },
    { icon: <BarChart3 className="w-6 h-6" />, value: '50+', label: '분석된 서비스' },
    { icon: <Clock className="w-6 h-6" />, value: '24/7', label: '실시간 업데이트' },
    { icon: <Award className="w-6 h-6" />, value: '99%', label: '고객 만족도' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              BI 대시보드 시장을<br />
              <span className="text-purple-200">한눈에 파악하세요</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100 max-w-3xl mx-auto">
              데이터 기반 의사결정을 위한 가장 강력한 BI 시장 분석 플랫폼
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {user ? (
                <button
                  onClick={onGetStarted}
                  className="px-8 py-4 bg-white text-purple-700 rounded-lg font-semibold text-lg hover:bg-purple-50 transition-all transform hover:scale-105 shadow-xl"
                >
                  대시보드로 이동
                </button>
              ) : (
                <>
                  <button
                    onClick={onGetStarted}
                    className="px-8 py-4 bg-white text-purple-700 rounded-lg font-semibold text-lg hover:bg-purple-50 transition-all transform hover:scale-105 shadow-xl flex items-center gap-2 justify-center"
                  >
                    무료로 시작하기
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={onViewPricing}
                    className="px-8 py-4 bg-purple-500/20 backdrop-blur-sm border-2 border-white/30 text-white rounded-lg font-semibold text-lg hover:bg-purple-500/30 transition-all"
                  >
                    요금제 보기
                  </button>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex justify-center mb-2 text-purple-200">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-purple-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              왜 대시보드 마켓 허브인가요?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              복잡한 BI 시장을 단순하고 명확하게 분석합니다
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
              >
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-purple-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                비즈니스 성장을 위한<br />핵심 인사이트
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                대시보드 마켓 허브는 BI 시장의 복잡한 데이터를 분석하여
                여러분의 비즈니스 의사결정을 지원합니다.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <span className="text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl">
                <div className="text-5xl font-bold mb-2">₩29,000</div>
                <div className="text-purple-200 mb-6">월 구독료로 모든 기능 이용</div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    무제한 데이터 내보내기
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    고급 비교 도구
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    우선 고객 지원
                  </li>
                </ul>
                <button
                  onClick={onViewPricing}
                  className="w-full py-3 bg-white text-purple-700 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
                >
                  지금 시작하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              고객들의 이야기
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              이미 수천 명의 전문가들이 사용하고 있습니다
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              투명하고 합리적인 가격
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              비즈니스 규모에 맞는 최적의 플랜을 선택하세요
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {SUBSCRIPTION_PLANS.map((plan, index) => (
              <div
                key={plan.id}
                onMouseEnter={() => setActivePlan(index)}
                className={`bg-white dark:bg-gray-900 rounded-xl p-8 border-2 transition-all cursor-pointer ${
                  activePlan === index
                    ? 'border-purple-600 shadow-xl scale-105'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-400'
                }`}
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    ₩{plan.price.toLocaleString()}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">/ 월</div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.slice(0, 5).map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={onGetStarted}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    activePlan === index
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {plan.price === 0 ? '무료로 시작' : '14일 무료 체험'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            14일 무료 체험으로 모든 프리미엄 기능을 경험해보세요. 신용카드 정보 없이 시작할 수 있습니다.
          </p>
          <button
            onClick={onGetStarted}
            className="px-10 py-5 bg-white text-purple-700 rounded-lg font-bold text-xl hover:bg-purple-50 transition-all transform hover:scale-105 shadow-2xl inline-flex items-center gap-3"
          >
            무료로 시작하기
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
