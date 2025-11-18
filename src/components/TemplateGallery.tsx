import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import {
  LayoutGrid,
  Star,
  Download,
  Eye,
  Search,
  Filter,
  TrendingUp,
  ShoppingCart,
  Users,
  BarChart3,
  PieChart,
  LineChart,
  DollarSign,
  Package,
  Zap,
  Crown,
  Check
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'business' | 'marketing' | 'sales' | 'finance' | 'analytics' | 'ecommerce';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon: React.ReactNode;
  preview: string;
  widgets: number;
  downloads: number;
  rating: number;
  tier: 'free' | 'professional' | 'enterprise';
  tags: string[];
  author: string;
  createdAt: Date;
}

const TemplateGallery: React.FC = () => {
  const { user } = useAuth();
  const { success } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | Template['category']>('all');
  const [selectedTier, setSelectedTier] = useState<'all' | Template['tier']>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'rating'>('popular');

  const templates: Template[] = [
    {
      id: '1',
      name: '비즈니스 성과 대시보드',
      description: 'KPI, 수익, 성장률을 한눈에 볼 수 있는 종합 비즈니스 대시보드',
      category: 'business',
      difficulty: 'beginner',
      icon: <TrendingUp className="w-6 h-6" />,
      preview: '/templates/business-performance.png',
      widgets: 12,
      downloads: 5234,
      rating: 4.8,
      tier: 'free',
      tags: ['KPI', '수익', '성장', '비즈니스'],
      author: 'Dashboard Team',
      createdAt: new Date('2025-10-15')
    },
    {
      id: '2',
      name: '마케팅 캠페인 분석',
      description: '마케팅 캠페인 성과, ROI, 고객 전환율 추적',
      category: 'marketing',
      difficulty: 'intermediate',
      icon: <BarChart3 className="w-6 h-6" />,
      preview: '/templates/marketing-campaign.png',
      widgets: 15,
      downloads: 3892,
      rating: 4.6,
      tier: 'professional',
      tags: ['마케팅', 'ROI', '캠페인', '전환율'],
      author: 'Marketing Pro',
      createdAt: new Date('2025-10-20')
    },
    {
      id: '3',
      name: '판매 파이프라인',
      description: '영업 기회, 거래 단계, 예상 매출을 시각화',
      category: 'sales',
      difficulty: 'intermediate',
      icon: <DollarSign className="w-6 h-6" />,
      preview: '/templates/sales-pipeline.png',
      widgets: 10,
      downloads: 4521,
      rating: 4.7,
      tier: 'professional',
      tags: ['판매', '영업', '파이프라인', '매출'],
      author: 'Sales Expert',
      createdAt: new Date('2025-10-25')
    },
    {
      id: '4',
      name: '재무 분석 대시보드',
      description: '수익성, 현금 흐름, 재무 비율 종합 분석',
      category: 'finance',
      difficulty: 'advanced',
      icon: <PieChart className="w-6 h-6" />,
      preview: '/templates/financial-analysis.png',
      widgets: 18,
      downloads: 2156,
      rating: 4.9,
      tier: 'enterprise',
      tags: ['재무', '회계', '수익성', '현금흐름'],
      author: 'Finance Team',
      createdAt: new Date('2025-11-01')
    },
    {
      id: '5',
      name: '웹 분석 대시보드',
      description: '웹사이트 트래픽, 사용자 행동, 전환율 분석',
      category: 'analytics',
      difficulty: 'beginner',
      icon: <LineChart className="w-6 h-6" />,
      preview: '/templates/web-analytics.png',
      widgets: 14,
      downloads: 6782,
      rating: 4.5,
      tier: 'free',
      tags: ['웹분석', '트래픽', 'GA', '전환율'],
      author: 'Analytics Pro',
      createdAt: new Date('2025-11-05')
    },
    {
      id: '6',
      name: '이커머스 성과',
      description: '온라인 매출, 주문, 고객 생애 가치 추적',
      category: 'ecommerce',
      difficulty: 'intermediate',
      icon: <ShoppingCart className="w-6 h-6" />,
      preview: '/templates/ecommerce-performance.png',
      widgets: 16,
      downloads: 4123,
      rating: 4.8,
      tier: 'professional',
      tags: ['이커머스', '온라인매출', 'LTV', '주문'],
      author: 'Ecommerce Team',
      createdAt: new Date('2025-11-08')
    },
    {
      id: '7',
      name: '고객 서비스 메트릭',
      description: '고객 만족도, 응답 시간, 해결율 모니터링',
      category: 'business',
      difficulty: 'beginner',
      icon: <Users className="w-6 h-6" />,
      preview: '/templates/customer-service.png',
      widgets: 11,
      downloads: 3421,
      rating: 4.4,
      tier: 'free',
      tags: ['고객서비스', 'CS', '만족도', 'SLA'],
      author: 'Support Team',
      createdAt: new Date('2025-11-10')
    },
    {
      id: '8',
      name: '제품 성과 분석',
      description: '제품별 매출, 재고, 성장률 종합 분석',
      category: 'business',
      difficulty: 'intermediate',
      icon: <Package className="w-6 h-6" />,
      preview: '/templates/product-performance.png',
      widgets: 13,
      downloads: 2987,
      rating: 4.6,
      tier: 'professional',
      tags: ['제품', '재고', '매출', '성장'],
      author: 'Product Team',
      createdAt: new Date('2025-11-12')
    }
  ];

  const categories = [
    { value: 'all', label: '전체', icon: LayoutGrid },
    { value: 'business', label: '비즈니스', icon: TrendingUp },
    { value: 'marketing', label: '마케팅', icon: BarChart3 },
    { value: 'sales', label: '판매', icon: DollarSign },
    { value: 'finance', label: '재무', icon: PieChart },
    { value: 'analytics', label: '분석', icon: LineChart },
    { value: 'ecommerce', label: '이커머스', icon: ShoppingCart }
  ];

  const filteredTemplates = templates
    .filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
      const matchesTier = selectedTier === 'all' || t.tier === selectedTier;
      return matchesSearch && matchesCategory && matchesTier;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.downloads - a.downloads;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

  const handleUseTemplate = (template: Template) => {
    const canUse = template.tier === 'free' ||
                   (template.tier === 'professional' && (user?.subscriptionTier === 'professional' || user?.subscriptionTier === 'enterprise')) ||
                   (template.tier === 'enterprise' && user?.subscriptionTier === 'enterprise');

    if (!canUse) {
      success(`${template.tier === 'professional' ? 'Premium' : 'Enterprise'} 플랜이 필요합니다.`);
      return;
    }

    success(`"${template.name}" 템플릿을 사용합니다.`);
    // 실제 구현에서는 템플릿을 복사하고 사용자 대시보드로 이동
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'enterprise':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-amber-100 text-amber-800 flex items-center gap-1">
          <Crown className="w-3 h-3" /> Enterprise
        </span>;
      case 'professional':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-purple-100 text-purple-800 flex items-center gap-1">
          <Zap className="w-3 h-3" /> Premium
        </span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-green-100 text-green-800 flex items-center gap-1">
          <Check className="w-3 h-3" /> Free
        </span>;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'advanced':
        return 'text-red-600 bg-red-50';
      case 'intermediate':
        return 'text-amber-600 bg-amber-50';
      default:
        return 'text-green-600 bg-green-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <LayoutGrid className="w-8 h-8 text-purple-600" />
                템플릿 갤러리
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                전문가가 만든 대시보드 템플릿으로 빠르게 시작하세요
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="템플릿 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">모든 플랜</option>
              <option value="free">Free</option>
              <option value="premium">Premium</option>
              <option value="enterprise">Enterprise</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="popular">인기순</option>
              <option value="recent">최신순</option>
              <option value="rating">평점순</option>
            </select>
          </div>

          {/* Categories */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value as any)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center gap-2 transition-colors ${
                  selectedCategory === cat.value
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {filteredTemplates.length}개의 템플릿
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <div
              key={template.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Preview Image */}
              <div className="h-48 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 flex items-center justify-center relative">
                <div className="text-purple-400 opacity-20">
                  {template.icon}
                </div>
                <div className="absolute top-3 right-3 flex gap-2">
                  {getTierBadge(template.tier)}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg flex-1">
                    {template.name}
                  </h3>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {template.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {template.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span>{template.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    <span>{template.downloads.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <LayoutGrid className="w-4 h-4" />
                    <span>{template.widgets}</span>
                  </div>
                </div>

                {/* Difficulty */}
                <div className="mb-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getDifficultyColor(template.difficulty)}`}>
                    {template.difficulty === 'beginner' ? '초급' :
                     template.difficulty === 'intermediate' ? '중급' : '고급'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUseTemplate(template)}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    사용하기
                  </button>
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                    <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">검색 결과가 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateGallery;
