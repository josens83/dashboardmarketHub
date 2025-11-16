import { useState, useEffect } from 'react';
import { Moon, Sun, Download, Menu, X, User, LogIn, LogOut, Crown } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UserDataProvider } from './contexts/UserDataContext';
import MarketOverview from './components/MarketOverview';
import ServiceComparison from './components/ServiceComparison';
import PricingAnalysis from './components/PricingAnalysis';
import IndustryAnalysis from './components/IndustryAnalysis';
import UserDashboard from './components/UserDashboard';
import SavedReportsPage from './components/SavedReportsPage';
import AuthModal from './components/AuthModal';
import PricingModal from './components/PricingModal';
import OnboardingTour from './components/OnboardingTour';
import { exportToPDF } from './utils/pdfExport';

function AppContent() {
  const { user, isAuthenticated, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // 다크모드 초기화
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // 온보딩 체크
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    if (!onboardingCompleted) {
      setShowOnboarding(true);
    }
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

  const menuItems = [
    { id: 'dashboard', label: '대시보드', icon: '🏠' },
    { id: 'overview', label: '시장 개요', icon: '📊' },
    { id: 'comparison', label: '서비스 비교', icon: '🔍' },
    { id: 'pricing', label: '가격 분석', icon: '💰' },
    { id: 'industry', label: '산업별 분석', icon: '🏭' },
    { id: 'reports', label: '저장된 리포트', icon: '📁' },
    { id: 'plans', label: '요금제', icon: '💎' },
  ];

  const getTierBadge = (tier: string) => {
    const badges = {
      free: { label: '무료', color: 'bg-gray-500' },
      premium: { label: '프리미엄', color: 'bg-yellow-500' },
      enterprise: { label: '엔터프라이즈', color: 'bg-purple-500' },
    };
    return badges[tier as keyof typeof badges] || badges.free;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* 헤더 */}
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">DM</span>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  Dashboard Market Hub
                </h1>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  유료 대시보드 구축 서비스 시장 분석
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* PDF 내보내기 버튼 */}
              <button
                onClick={handleExportPDF}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>PDF 내보내기</span>
              </button>

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
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowPricingModal(true);
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <Crown className="w-4 h-4 text-yellow-500" />
                        <span>요금제 관리</span>
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600"
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
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
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
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex gap-1 pb-2 border-b border-gray-200 dark:border-gray-700">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  activeSection === item.id
                    ? 'bg-primary-600 text-white'
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
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition-colors ${
                    activeSection === item.id
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}
              <button
                onClick={handleExportPDF}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>PDF 내보내기</span>
              </button>
            </nav>
          )}
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSection === 'dashboard' && <UserDashboard />}
        {activeSection === 'overview' && <MarketOverview />}
        {activeSection === 'comparison' && <ServiceComparison />}
        {activeSection === 'pricing' && <PricingAnalysis />}
        {activeSection === 'industry' && <IndustryAnalysis />}
        {activeSection === 'reports' && <SavedReportsPage />}
        {activeSection === 'plans' && (
          <div>
            <PricingModal isOpen={true} onClose={() => setActiveSection('overview')} />
          </div>
        )}
      </main>

      {/* 모달들 */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      {activeSection !== 'plans' && (
        <PricingModal isOpen={showPricingModal} onClose={() => setShowPricingModal(false)} />
      )}

      {/* 온보딩 투어 */}
      {showOnboarding && <OnboardingTour onComplete={() => setShowOnboarding(false)} />}

      {/* 푸터 */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                © 2024 Dashboard Market Hub. All rights reserved.
              </p>
            </div>
            <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
              <a href="#" className="hover:text-primary-600 transition-colors">
                소개
              </a>
              <a href="#" className="hover:text-primary-600 transition-colors">
                문의
              </a>
              <a href="#" className="hover:text-primary-600 transition-colors">
                개인정보처리방침
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <UserDataProvider>
        <AppContent />
      </UserDataProvider>
    </AuthProvider>
  );
}

export default App;
