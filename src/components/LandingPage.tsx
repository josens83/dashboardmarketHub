import React from 'react';
import { BarChart3, TrendingUp, Shield, Zap, CheckCircle, Star, ArrowRight, Users, Clock, Award, Sparkles, Database } from 'lucide-react';
import { useAuth } from '@/shared/contexts/AuthContext';

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
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: '경쟁사 비교',
      description: 'Tableau, Power BI, Qlik 등 주요 서비스를 한눈에 비교하고 분석하세요.',
      gradient: 'from-blue-500 to-cyan-500'
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
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
      {/* Hero Section - Linear 스타일 */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* 배경 그리드 패턴 */}
        <div className="absolute inset-0 bg-grid-pattern opacity-50" />

        {/* 그러데이션 글로우 효과 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-radial opacity-40 blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* 배지 */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">프로덕션 런칭 완료</span>
            </div>

            {/* 메인 헤드라인 */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.1] tracking-tight animate-fade-in">
              <span className="text-gray-900 dark:text-white">BI 대시보드 시장을</span>
              <br />
              <span className="text-gradient-purple">한눈에 파악하세요</span>
            </h1>

            {/* 서브헤드라인 */}
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Tableau, Power BI, Qlik 등 주요 BI 서비스를 비교하고 시장 트렌드를 분석하는 전문 플랫폼
            </p>

            {/* CTA 버튼 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {user ? (
                <button
                  onClick={onGetStarted}
                  className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-lg"
                >
                  대시보드로 이동
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <>
                  <button
                    onClick={onGetStarted}
                    className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-lg"
                  >
                    무료로 시작하기
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={onViewPricing}
                    className="btn-secondary inline-flex items-center gap-2 px-8 py-4 text-lg"
                  >
                    요금제 보기
                  </button>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 mb-3">
                    {stat.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 하단 그러데이션 페이드 */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-[#0a0a0a] to-transparent" />
      </section>

      {/* Features Section - Bento Grid */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              강력한 기능으로 <span className="text-gradient-purple">완벽한 분석</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              실시간 데이터 연동부터 AI 기반 인사이트까지, 모든 것을 한 곳에서
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`glass-card p-8 hover:scale-[1.02] transition-all duration-300 group ${
                  index === 0 ? 'md:col-span-2 lg:row-span-2' : ''
                }`}
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} p-3 mb-6 text-white shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
                {index === 0 && (
                  <div className="mt-8 pt-8 border-t border-gray-200/50 dark:border-white/10">
                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold group-hover:gap-3 transition-all">
                      자세히 보기
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof - Testimonials */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              고객들이 <span className="text-gradient-purple">말하는 성공 스토리</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              전 세계 10,000+ 기업이 신뢰하는 플랫폼
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="card p-8 hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4 pt-4 border-t border-gray-200/50 dark:border-white/10">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* 배경 효과 */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-pink-600/10" />
        <div className="absolute inset-0 bg-dot-pattern opacity-30" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="glass-card p-12 md:p-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              지금 바로 시작하세요
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              무료 플랜으로 시작하여 필요에 따라 언제든 업그레이드하세요
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onGetStarted}
                className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-lg"
              >
                <Sparkles className="w-5 h-5" />
                무료로 시작하기
              </button>
              <button
                onClick={onViewPricing}
                className="btn-secondary inline-flex items-center gap-2 px-8 py-4 text-lg"
              >
                <Database className="w-5 h-5" />
                요금제 보기
              </button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>신용카드 불필요</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>언제든 취소 가능</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
