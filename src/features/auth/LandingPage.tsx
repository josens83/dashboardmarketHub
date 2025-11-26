import React from 'react';
import { BarChart3, TrendingUp, Shield, Zap, CheckCircle, Star, ArrowRight, Users, Clock, Award, Sparkles } from 'lucide-react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { Button, Card } from '@/shared/components';

interface LandingPageProps {
  onGetStarted: () => void;
  onViewPricing: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onViewPricing }) => {
  const { user } = useAuth();

  const features = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: '실시간 시장 분석',
      description: 'BI 대시보드 시장의 최신 트렌드와 성장률을 실시간으로 확인하세요.',
      gradient: 'from-brand-500 to-pink-500',
      featured: true
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: '경쟁사 비교',
      description: 'Tableau, Power BI, Qlik 등 주요 서비스를 한눈에 비교하고 분석하세요.',
      gradient: 'from-sapphire-500 to-cyan-500'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: '신뢰할 수 있는 데이터',
      description: '검증된 시장 조사 데이터를 기반으로 정확한 인사이트를 제공합니다.',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: '빠른 리포트 생성',
      description: 'PDF, Excel로 즉시 내보내기하여 프레젠테이션에 바로 활용하세요.',
      gradient: 'from-amber-500 to-orange-500'
    }
  ];

  const stats = [
    { icon: <Users className="w-5 h-5" />, value: '10,000+', label: '활성 사용자' },
    { icon: <BarChart3 className="w-5 h-5" />, value: '50+', label: '분석된 서비스' },
    { icon: <Clock className="w-5 h-5" />, value: '24/7', label: '실시간 업데이트' },
    { icon: <Award className="w-5 h-5" />, value: '99%', label: '고객 만족도' }
  ];

  const testimonials = [
    {
      name: '김민수',
      role: 'CTO, TechCorp',
      content: '대시보드 마켓 허브 덕분에 우리 회사에 맞는 BI 솔루션을 빠르게 선택할 수 있었습니다.',
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

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Hero Section - Premium */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background patterns & effects */}
        <div className="absolute inset-0 bg-grid-pattern opacity-50" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-radial-brand opacity-40 blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sapphire-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 backdrop-blur-sm mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span className="text-sm font-medium text-brand-300">96% Production Ready</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-5xl md:text-7xl lg:text-display-1 font-bold mb-6 leading-[1.1] tracking-tight animate-fade-in">
              <span className="text-neutral-900 dark:text-white">BI 대시보드 시장을</span>
              <br />
              <span className="text-gradient-brand">한눈에 파악하세요</span>
            </h1>

            {/* Subheadline */}
            <p className="text-body-lg md:text-body-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Tableau, Power BI, Qlik 등 주요 BI 서비스를 비교하고 시장 트렌드를 분석하는 전문 플랫폼
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {user ? (
                <Button
                  variant="primary"
                  size="xl"
                  onClick={onGetStarted}
                  icon={<ArrowRight className="w-5 h-5" />}
                  iconPosition="right"
                >
                  대시보드로 이동
                </Button>
              ) : (
                <>
                  <Button
                    variant="primary"
                    size="xl"
                    onClick={onGetStarted}
                    icon={<ArrowRight className="w-5 h-5" />}
                    iconPosition="right"
                  >
                    무료로 시작하기
                  </Button>
                  <Button
                    variant="secondary"
                    size="xl"
                    onClick={onViewPricing}
                  >
                    요금제 보기
                  </Button>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 mb-3">
                    {stat.icon}
                  </div>
                  <div className="font-display text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-neutral-950 to-transparent" />
      </section>

      {/* Features Section - Bento Grid */}
      <section className="relative section-spacing-lg px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-h2 md:text-h1 font-bold text-neutral-900 dark:text-white mb-4">
              강력한 기능으로 <span className="text-gradient-brand">완벽한 분석</span>
            </h2>
            <p className="text-body-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              실시간 데이터 연동부터 AI 기반 인사이트까지, 모든 것을 한 곳에서
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                variant="glass"
                interactive
                glowOnHover={index === 0}
                className={`group ${
                  index === 0 ? 'md:col-span-2 lg:row-span-2' : ''
                }`}
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} p-3 mb-6 text-white shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="font-display text-h5 font-bold text-neutral-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {feature.description}
                </p>
                {feature.featured && (
                  <div className="mt-8 pt-8 border-t border-neutral-200/50 dark:border-white/10">
                    <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-semibold group-hover:gap-3 transition-all">
                      자세히 보기
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof - Testimonials */}
      <section className="relative section-spacing-lg px-4 sm:px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-h2 md:text-h1 font-bold text-neutral-900 dark:text-white mb-4">
              고객들이 <span className="text-gradient-brand">말하는 성공 스토리</span>
            </h2>
            <p className="text-body-lg text-neutral-600 dark:text-neutral-400">
              전 세계 10,000+ 기업이 신뢰하는 플랫폼
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                variant="premium"
                interactive
                className="h-full"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-sapphire-500 flex items-center justify-center text-white font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative section-spacing-xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card variant="premium" className="text-center relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-sapphire-500/10 blur-3xl" />

            <div className="relative">
              <h2 className="font-display text-h2 md:text-h1 font-bold text-neutral-900 dark:text-white mb-4">
                지금 바로 시작하세요
              </h2>
              <p className="text-body-lg text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">
                14일 무료 체험으로 모든 프리미엄 기능을 경험해보세요. 신용카드 등록 불필요.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={onGetStarted}
                  icon={<ArrowRight className="w-5 h-5" />}
                  iconPosition="right"
                >
                  무료로 시작하기
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={onViewPricing}
                >
                  요금제 자세히 보기
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-700">
                <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-neutral-600 dark:text-neutral-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success-600" />
                    <span>신용카드 불필요</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success-600" />
                    <span>14일 무료 체험</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success-600" />
                    <span>언제든 취소 가능</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
