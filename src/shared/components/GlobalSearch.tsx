import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, FileText, BarChart3, Settings, HelpCircle, TrendingUp, DollarSign, Building2, ArrowRight, Star } from 'lucide-react';
import { useAuth } from '@/shared/contexts/AuthContext';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'page' | 'action' | 'data';
  icon: React.ReactNode;
  action: () => void;
  keywords?: string[];
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose, onNavigate }) => {
  const { user, isAuthenticated } = useAuth();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // 검색 가능한 모든 항목
  const allItems: SearchResult[] = useMemo(() => {
    const items: SearchResult[] = [
      // 페이지
      {
        id: 'dashboard',
        title: '대시보드',
        description: '개인 대시보드 보기',
        type: 'page',
        icon: <BarChart3 className="w-5 h-5" />,
        action: () => onNavigate('dashboard'),
        keywords: ['dashboard', 'home', '홈', '대시보드']
      },
      {
        id: 'overview',
        title: '시장 개요',
        description: 'BI 시장 트렌드 및 성장률',
        type: 'page',
        icon: <TrendingUp className="w-5 h-5" />,
        action: () => onNavigate('overview'),
        keywords: ['market', 'overview', '시장', '개요', '트렌드']
      },
      {
        id: 'comparison',
        title: '서비스 비교',
        description: 'Tableau, Power BI 등 서비스 비교',
        type: 'page',
        icon: <Search className="w-5 h-5" />,
        action: () => onNavigate('comparison'),
        keywords: ['compare', 'service', '비교', '서비스', 'tableau', 'power bi']
      },
      {
        id: 'pricing',
        title: '가격 분석',
        description: 'BI 서비스 가격 비교 분석',
        type: 'page',
        icon: <DollarSign className="w-5 h-5" />,
        action: () => onNavigate('pricing'),
        keywords: ['price', 'cost', '가격', '비용', '요금']
      },
      {
        id: 'industry',
        title: '산업별 분석',
        description: '산업별 BI 활용 현황',
        type: 'page',
        icon: <Building2 className="w-5 h-5" />,
        action: () => onNavigate('industry'),
        keywords: ['industry', '산업', '업종', '분야']
      },
      {
        id: 'reports',
        title: '저장된 리포트',
        description: '내가 저장한 리포트 보기',
        type: 'page',
        icon: <FileText className="w-5 h-5" />,
        action: () => onNavigate('reports'),
        keywords: ['report', 'saved', '리포트', '저장']
      },
      {
        id: 'settings',
        title: '설정',
        description: '계정 및 프로필 설정',
        type: 'page',
        icon: <Settings className="w-5 h-5" />,
        action: () => onNavigate('settings'),
        keywords: ['settings', 'profile', '설정', '프로필', '계정']
      },
      {
        id: 'faq',
        title: 'FAQ',
        description: '자주 묻는 질문',
        type: 'page',
        icon: <HelpCircle className="w-5 h-5" />,
        action: () => onNavigate('faq'),
        keywords: ['faq', 'help', 'support', '도움말', '질문']
      },
      {
        id: 'contact',
        title: '문의하기',
        description: '고객 지원팀에 문의',
        type: 'page',
        icon: <HelpCircle className="w-5 h-5" />,
        action: () => onNavigate('contact'),
        keywords: ['contact', 'support', '문의', '지원', '도움']
      },
      {
        id: 'plans',
        title: '요금제',
        description: '플랜 및 가격 정보',
        type: 'page',
        icon: <Star className="w-5 h-5" />,
        action: () => onNavigate('plans'),
        keywords: ['plan', 'pricing', 'subscription', '요금제', '플랜', '구독']
      }
    ];

    // 인증된 사용자만 접근 가능한 항목 필터링
    if (!isAuthenticated) {
      return items.filter(item => !['dashboard', 'reports', 'settings'].includes(item.id));
    }

    return items;
  }, [isAuthenticated, onNavigate]);

  // 검색 결과 필터링
  const filteredResults = useMemo(() => {
    if (!query.trim()) {
      // 빈 쿼리일 때는 최근 사용한 페이지나 추천 페이지
      return allItems.slice(0, 5);
    }

    const lowerQuery = query.toLowerCase();
    return allItems.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(lowerQuery);
      const descMatch = item.description.toLowerCase().includes(lowerQuery);
      const keywordMatch = item.keywords?.some(kw => kw.toLowerCase().includes(lowerQuery));
      return titleMatch || descMatch || keywordMatch;
    });
  }, [query, allItems]);

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % filteredResults.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + filteredResults.length) % filteredResults.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredResults[selectedIndex]) {
            filteredResults[selectedIndex].action();
            handleClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          handleClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredResults]);

  // 선택 인덱스 리셋
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleClose = useCallback(() => {
    setQuery('');
    setSelectedIndex(0);
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Search Modal */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden animate-fade-in">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200 dark:border-gray-700">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="검색어를 입력하세요... (페이지, 기능, 데이터)"
            className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none text-lg"
            autoFocus
          />
          <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {filteredResults.length > 0 ? (
            <div className="py-2">
              {filteredResults.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => {
                    result.action();
                    handleClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center gap-4 px-4 py-3 transition-colors ${
                    index === selectedIndex
                      ? 'bg-purple-50 dark:bg-purple-900/20 border-l-2 border-purple-600'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <div className={`flex-shrink-0 ${
                    index === selectedIndex ? 'text-purple-600' : 'text-gray-400'
                  }`}>
                    {result.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {result.title}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {result.description}
                    </div>
                  </div>
                  {index === selectedIndex && (
                    <ArrowRight className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">
                "{query}"에 대한 검색 결과가 없습니다
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                다른 키워드로 검색해보세요
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white dark:bg-gray-700 rounded">↑↓</kbd>
                이동
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white dark:bg-gray-700 rounded">Enter</kbd>
                선택
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white dark:bg-gray-700 rounded">ESC</kbd>
                닫기
              </span>
            </div>
            {user && (
              <span className="text-purple-600 dark:text-purple-400">
                {user.subscriptionTier === 'professional' ? '프리미엄' : user.subscriptionTier === 'enterprise' ? '엔터프라이즈' : '무료'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
