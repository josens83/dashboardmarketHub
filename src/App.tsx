import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Moon, Sun, Download, Menu, X, User, LogIn, LogOut, Crown, Settings, HelpCircle, Mail, FileText, Shield, Bell, Search, Users, Calendar, Code, Activity as ActivityIcon, Database, Webhook, LayoutGrid, Loader2, Link as LinkIcon } from 'lucide-react';
import { AuthProvider, useAuth } from '@/shared/contexts/AuthContext';
import { UserDataProvider } from '@/shared/contexts/UserDataContext';
import { ToastProvider } from '@/shared/contexts/ToastContext';
import { LoadingProvider } from '@/shared/contexts/LoadingContext';
import { ErrorBoundary, GlobalSearch, NotificationCenter, OnboardingTour } from '@/shared/components';
import { LandingPage, AuthModal } from '@/features/auth';
import { MarketOverview, ServiceComparison, PricingAnalysis, IndustryAnalysis, UserDashboard } from '@/features/dashboard';





import { PricingModal } from '@/features/subscription';
import { exportToPDF } from '@/shared/utils/pdfExport';
import { SubscriptionTier } from '@/shared/types/subscription';

// 코드 스플리팅 - 성능 최적화를 위한 Lazy Loading
const SavedReportsPage = lazy(() => import('@/features/reports/SavedReportsPage'));
const TeamManagement = lazy(() => import('@/features/settings/TeamManagement'));
const ReportScheduler = lazy(() => import('@/features/reports/ReportScheduler'));
const APIDocumentation = lazy(() => import('@/features/pages/APIDocumentation'));
const AdminDashboard = lazy(() => import('@/features/admin/AdminDashboard'));
const ActivityLogs = lazy(() => import('@/features/admin/ActivityLogs'));
const DataExportCenter = lazy(() => import('@/features/reports/DataExportCenter'));
const WebhookSettings = lazy(() => import('@/features/settings/WebhookSettings'));
const CustomReportBuilder = lazy(() => import('@/features/reports/CustomReportBuilder'));
const TemplateGallery = lazy(() => import('@/features/reports/TemplateGallery'));
const FAQPage = lazy(() => import('@/features/pages/FAQPage'));
const ContactPage = lazy(() => import('@/features/pages/ContactPage'));
const SettingsPage = lazy(() => import('@/features/settings/SettingsPage'));
const TermsOfService = lazy(() => import('@/features/pages/TermsOfService'));
const PrivacyPolicy = lazy(() => import('@/features/pages/PrivacyPolicy'));
const CheckoutPage = lazy(() => import('@/features/subscription/CheckoutPage'));
const DataConnector = lazy(() => import('@/features/settings/DataConnector'));

// 로딩 Fallback 컴포넌트
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">로딩 중...</p>
      </div>
    </div>
  );
}

function AppContent() {
  const { user, isAuthenticated, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('landing');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [checkoutTier, setCheckoutTier] = useState<SubscriptionTier | null>(null);
  const [unreadNotifications] = useState(2); // 데모: 읽지 않은 알림 수

  // 다크모드 및 초기화
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // 로그인된 사용자는 대시보드로, 아니면 랜딩 페이지
    if (isAuthenticated) {
      setActiveSection('dashboard');

      // 온보딩 체크 (로그인된 사용자만)
      const onboardingCompleted = localStorage.getItem('onboardingCompleted');
      if (!onboardingCompleted) {
        setShowOnboarding(true);
      }
    } else {
      setActiveSection('landing');
    }
  }, [isAuthenticated]);

  // Cmd+K 또는 Ctrl+K로 전역 검색 열기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowGlobalSearch(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 다크모드 토글
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', (!darkMode).toString());
  };

  // PDF 내보내기
  const handleExportPDF = () => {
    exportToPDF('main-content', `dashboard-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleNavigate = useCallback((page: string) => {
    setActiveSection(page);
  }, []);

  const appMenuItems = [
    { id: 'dashboard', label: '대시보드', icon: '🏠', requiresAuth: true },
    { id: 'templates', label: '템플릿', icon: '📋', requiresAuth: false },
    { id: 'overview', label: '시장 개요', icon: '📊', requiresAuth: false },
    { id: 'comparison', label: '서비스 비교', icon: '🔍', requiresAuth: false },
    { id: 'pricing', label: '가격 분석', icon: '💰', requiresAuth: false },
    { id: 'industry', label: '산업별 분석', icon: '🏭', requiresAuth: false },
    { id: 'reports', label: '저장된 리포트', icon: '📁', requiresAuth: true },
  ];

  const footerMenuItems = [
    { id: 'plans', label: '요금제', icon: '💎' },
    { id: 'faq', label: 'FAQ', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'contact', label: '문의하기', icon: <Mail className="w-4 h-4" /> },
    { id: 'terms', label: '이용약관', icon: <FileText className="w-4 h-4" /> },
    { id: 'privacy', label: '개인정보처리방침', icon: <Shield className="w-4 h-4" /> },
  ];

  const getTierBadge = (tier: string) => {
    const badges = {
      free: { label: '무료', color: 'bg-gray-500' },
      premium: { label: '프리미엄', color: 'bg-yellow-500' },
      enterprise: { label: '엔터프라이즈', color: 'bg-purple-500' },
    };
    return badges[tier as keyof typeof badges] || badges.free;
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      setActiveSection('dashboard');
    } else {
      setShowAuthModal(true);
    }
  };

  const handleViewPricing = () => {
    setShowPricingModal(true);
  };

  const handleCheckout = (tier: SubscriptionTier) => {
    setCheckoutTier(tier);
    setActiveSection('checkout');
  };

  const handleCheckoutSuccess = () => {
    setCheckoutTier(null);
    setActiveSection('dashboard');
  };

  // 랜딩 페이지는 헤더/푸터가 다름
  const isLandingPage = activeSection === 'landing';
  const isFullPageView = ['landing', 'terms', 'privacy', 'faq', 'contact', 'checkout', 'settings', 'team', 'scheduler', 'api-docs', 'admin', 'activity', 'data', 'webhooks', 'report-builder', 'templates', 'data-connector'].includes(activeSection);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* 헤더 - 랜딩 페이지가 아닐 때만 표시 */}
      {!isLandingPage && !isFullPageView && (
        <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <button
                onClick={() => setActiveSection(isAuthenticated ? 'dashboard' : 'landing')}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl font-bold">DM</span>
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                    Dashboard Market Hub
                  </h1>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                    BI 대시보드 시장 분석 플랫폼
                  </p>
                </div>
              </button>

              <div className="flex items-center gap-2">
                {/* 전역 검색 버튼 */}
                <button
                  onClick={() => setShowGlobalSearch(true)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  title="검색 (Cmd+K)"
                >
                  <Search className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>

                {/* 알림 버튼 */}
                {isAuthenticated && (
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    title="알림"
                  >
                    <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadNotifications}
                      </span>
                    )}
                  </button>
                )}

                {/* PDF 내보내기 버튼 */}
                {isAuthenticated && (
                  <button
                    onClick={handleExportPDF}
                    className="hidden md:flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>PDF 내보내기</span>
                  </button>
                )}

                {/* 사용자 메뉴 */}
                {isAuthenticated && user ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <User className="w-5 h-5" />
                      <span className="hidden md:inline text-sm font-semibold">{user.name}</span>
                      <span className={`hidden md:inline text-xs px-2 py-0.5 rounded-full text-white ${getTierBadge(user.subscriptionTier).color}`}>
                        {getTierBadge(user.subscriptionTier).label}
                      </span>
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{user.email}</p>
                        </div>
                        <button
                          onClick={() => {
                            setActiveSection('settings');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                        >
                          <Settings className="w-4 h-4" />
                          <span>설정</span>
                        </button>
                        {user?.subscriptionTier === 'enterprise' && (
                          <button
                            onClick={() => {
                              setActiveSection('team');
                              setShowUserMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                          >
                            <Users className="w-4 h-4" />
                            <span>팀 관리</span>
                          </button>
                        )}
                        {(user?.subscriptionTier === 'professional' || user?.subscriptionTier === 'enterprise') && (
                          <button
                            onClick={() => {
                              setActiveSection('scheduler');
                              setShowUserMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                          >
                            <Calendar className="w-4 h-4" />
                            <span>리포트 스케줄링</span>
                          </button>
                        )}
                        {(user?.subscriptionTier === 'professional' || user?.subscriptionTier === 'enterprise') && (
                          <button
                            onClick={() => {
                              setActiveSection('report-builder');
                              setShowUserMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                          >
                            <LayoutGrid className="w-4 h-4" />
                            <span>리포트 빌더</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setActiveSection('data');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700"
                        >
                          <Database className="w-4 h-4" />
                          <span>데이터 관리</span>
                        </button>
                        <button
                          onClick={() => {
                            setActiveSection('data-connector');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                        >
                          <LinkIcon className="w-4 h-4" />
                          <span>데이터 커넥터</span>
                        </button>
                        {(user?.subscriptionTier === 'professional' || user?.subscriptionTier === 'enterprise') && (
                          <button
                            onClick={() => {
                              setActiveSection('activity');
                              setShowUserMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                          >
                            <ActivityIcon className="w-4 h-4" />
                            <span>활동 로그</span>
                          </button>
                        )}
                        {(user?.subscriptionTier === 'professional' || user?.subscriptionTier === 'enterprise') && (
                          <button
                            onClick={() => {
                              setActiveSection('webhooks');
                              setShowUserMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                          >
                            <Webhook className="w-4 h-4" />
                            <span>Webhook 설정</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setActiveSection('api-docs');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                        >
                          <Code className="w-4 h-4" />
                          <span>API 문서</span>
                        </button>
                        {user?.email === 'admin@bimarket.com' && (
                          <button
                            onClick={() => {
                              setActiveSection('admin');
                              setShowUserMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-purple-600 border-t border-gray-200 dark:border-gray-700"
                          >
                            <Shield className="w-4 h-4" />
                            <span>관리자 대시보드</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setShowPricingModal(true);
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                        >
                          <Crown className="w-4 h-4 text-yellow-500" />
                          <span>요금제 관리</span>
                        </button>
                        <button
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                            setActiveSection('landing');
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600 border-t border-gray-200 dark:border-gray-700 mt-1 pt-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>로그아웃</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="hidden md:inline">로그인</span>
                  </button>
                )}

                {/* 다크모드 토글 */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  aria-label="다크모드 토글"
                >
                  {darkMode ? (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-700" />
                  )}
                </button>

                {/* 모바일 메뉴 토글 */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
                  aria-label="메뉴 토글"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* 데스크톱 네비게이션 */}
            <nav className="hidden md:flex gap-1 pb-2 border-b border-gray-200 dark:border-gray-700">
              {appMenuItems
                .filter(item => !item.requiresAuth || isAuthenticated)
                .map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      activeSection === item.id
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
            </nav>

            {/* 모바일 네비게이션 */}
            {mobileMenuOpen && (
              <nav className="md:hidden pb-4 space-y-2">
                {appMenuItems
                  .filter(item => !item.requiresAuth || isAuthenticated)
                  .map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition-colors ${
                        activeSection === item.id
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
              </nav>
            )}
          </div>
        </header>
      )}

      {/* 간단한 헤더 - full page 뷰용 */}
      {isFullPageView && !isLandingPage && (
        <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <button
                onClick={() => setActiveSection(isAuthenticated ? 'dashboard' : 'landing')}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl font-bold">DM</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">Dashboard Market Hub</span>
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-700" />}
              </button>
            </div>
          </div>
        </header>
      )}

      {/* 메인 컨텐츠 */}
      <main id="main-content" className={isFullPageView ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}>
        <Suspense fallback={<LoadingFallback />}>
          {activeSection === 'landing' && <LandingPage onGetStarted={handleGetStarted} onViewPricing={handleViewPricing} />}
          {activeSection === 'dashboard' && <UserDashboard />}
          {activeSection === 'templates' && <TemplateGallery />}
          {activeSection === 'overview' && <MarketOverview />}
          {activeSection === 'comparison' && <ServiceComparison />}
          {activeSection === 'pricing' && <PricingAnalysis />}
          {activeSection === 'industry' && <IndustryAnalysis />}
          {activeSection === 'reports' && <SavedReportsPage />}
          {activeSection === 'team' && <TeamManagement />}
          {activeSection === 'scheduler' && <ReportScheduler />}
          {activeSection === 'api-docs' && <APIDocumentation />}
          {activeSection === 'admin' && <AdminDashboard />}
          {activeSection === 'activity' && <ActivityLogs />}
          {activeSection === 'data' && <DataExportCenter />}
          {activeSection === 'data-connector' && <DataConnector />}
          {activeSection === 'webhooks' && <WebhookSettings />}
          {activeSection === 'report-builder' && <CustomReportBuilder />}
          {activeSection === 'plans' && <PricingModal isOpen={true} onClose={() => setActiveSection(isAuthenticated ? 'dashboard' : 'landing')} onCheckout={handleCheckout} />}
          {activeSection === 'faq' && <FAQPage />}
          {activeSection === 'contact' && <ContactPage />}
          {activeSection === 'settings' && <SettingsPage />}
          {activeSection === 'terms' && <TermsOfService onClose={() => setActiveSection(isAuthenticated ? 'dashboard' : 'landing')} />}
          {activeSection === 'privacy' && <PrivacyPolicy onClose={() => setActiveSection(isAuthenticated ? 'dashboard' : 'landing')} />}
          {activeSection === 'checkout' && checkoutTier && (
            <CheckoutPage
              selectedTier={checkoutTier}
              onClose={() => setActiveSection('plans')}
              onSuccess={handleCheckoutSuccess}
            />
          )}
        </Suspense>
      </main>

      {/* 모달들 */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      {activeSection !== 'plans' && (
        <PricingModal
          isOpen={showPricingModal}
          onClose={() => setShowPricingModal(false)}
          onCheckout={handleCheckout}
        />
      )}

      {/* Global Search */}
      <GlobalSearch
        isOpen={showGlobalSearch}
        onClose={() => setShowGlobalSearch(false)}
        onNavigate={handleNavigate}
      />

      {/* Notification Center */}
      {showNotifications && (
        <NotificationCenter
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
          onNavigate={handleNavigate}
        />
      )}

      {/* 온보딩 투어 */}
      {showOnboarding && isAuthenticated && <OnboardingTour onComplete={() => setShowOnboarding(false)} />}

      {/* 푸터 - full page가 아닐 때만 표시 */}
      {!isFullPageView && (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl font-bold">DM</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">Dashboard Market Hub</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  BI 대시보드 시장을 분석하고 비교하는 가장 강력한 플랫폼. 데이터 기반 의사결정을 지원합니다.
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-xs">
                  © 2024 Dashboard Market Hub. All rights reserved.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">서비스</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {appMenuItems.slice(0, 4).map(item => (
                    <li key={item.id}>
                      <button onClick={() => setActiveSection(item.id)} className="hover:text-purple-600 transition-colors">
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">고객 지원</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {footerMenuItems.map(item => (
                    <li key={item.id}>
                      <button onClick={() => setActiveSection(item.id)} className="hover:text-purple-600 transition-colors flex items-center gap-2">
                        {typeof item.icon === 'string' ? item.icon : item.icon}
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <UserDataProvider>
          <ToastProvider>
            <LoadingProvider>
              <AppContent />
            </LoadingProvider>
          </ToastProvider>
        </UserDataProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
