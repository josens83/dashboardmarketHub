import React, { useState } from 'react';
import { useAuth } from '@/shared/contexts/AuthContext';
import {
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle,
  Crown,
  Shield,
  Ban,
  Clock,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Download
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  freeUsers: number;
  premiumUsers: number;
  enterpriseUsers: number;
  mrr: number;
  conversionRate: number;
  churnRate: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  subscriptionTier: 'free' | 'professional' | 'enterprise';
  status: 'active' | 'inactive' | 'suspended';
  registeredAt: Date;
  lastActive: Date;
  revenue: number;
}

interface SystemHealth {
  apiResponseTime: number;
  errorRate: number;
  activeSessions: number;
  uptime: number;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'revenue' | 'health'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState<'all' | 'free' | 'professional' | 'enterprise'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');

  // Mock 시스템 통계
  const [stats] = useState<SystemStats>({
    totalUsers: 12547,
    activeUsers: 8932,
    freeUsers: 9234,
    premiumUsers: 2876,
    enterpriseUsers: 437,
    mrr: 127580000, // ₩127,580,000
    conversionRate: 26.3,
    churnRate: 3.2
  });

  // Mock 시스템 헬스
  const [health] = useState<SystemHealth>({
    apiResponseTime: 142, // ms
    errorRate: 0.23, // %
    activeSessions: 1247,
    uptime: 99.97 // %
  });

  // Mock 사용자 데이터
  const [users] = useState<User[]>([
    {
      id: '1',
      name: '김민수',
      email: 'minsu.kim@example.com',
      subscriptionTier: 'enterprise',
      status: 'active',
      registeredAt: new Date('2024-01-15'),
      lastActive: new Date('2025-11-17'),
      revenue: 99000
    },
    {
      id: '2',
      name: '이지은',
      email: 'jieun.lee@example.com',
      subscriptionTier: 'professional',
      status: 'active',
      registeredAt: new Date('2024-03-22'),
      lastActive: new Date('2025-11-16'),
      revenue: 29000
    },
    {
      id: '3',
      name: '박서준',
      email: 'seojun.park@example.com',
      subscriptionTier: 'free',
      status: 'active',
      registeredAt: new Date('2024-07-10'),
      lastActive: new Date('2025-11-17'),
      revenue: 0
    },
    {
      id: '4',
      name: '최수진',
      email: 'sujin.choi@example.com',
      subscriptionTier: 'professional',
      status: 'inactive',
      registeredAt: new Date('2024-02-05'),
      lastActive: new Date('2025-10-20'),
      revenue: 29000
    },
    {
      id: '5',
      name: '정하늘',
      email: 'haneul.jung@example.com',
      subscriptionTier: 'enterprise',
      status: 'active',
      registeredAt: new Date('2024-05-18'),
      lastActive: new Date('2025-11-17'),
      revenue: 99000
    }
  ]);

  // Mock 수익 차트 데이터
  const revenueData = [
    { month: '5월', revenue: 98500000, users: 10234 },
    { month: '6월', revenue: 105200000, users: 10876 },
    { month: '7월', revenue: 112300000, users: 11432 },
    { month: '8월', revenue: 118900000, users: 11989 },
    { month: '9월', revenue: 121400000, users: 12245 },
    { month: '10월', revenue: 125100000, users: 12398 },
    { month: '11월', revenue: 127580000, users: 12547 }
  ];

  // Mock 구독 분포 데이터
  const subscriptionData = [
    { name: 'Free', value: stats.freeUsers, color: '#94a3b8' },
    { name: 'Premium', value: stats.premiumUsers, color: '#9333ea' },
    { name: 'Enterprise', value: stats.enterpriseUsers, color: '#f59e0b' }
  ];

  // 관리자 권한 체크 (모든 hooks 호출 이후)
  const isAdmin = user && ['admin@example.com', 'admin@bimarket.com'].includes(user.email);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <Shield className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            접근 권한 없음
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            관리자만 접근할 수 있는 페이지입니다.
          </p>
        </div>
      </div>
    );
  }

  // 필터링된 사용자 목록
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = filterTier === 'all' || u.subscriptionTier === filterTier;
    const matchesStatus = filterStatus === 'all' || u.status === filterStatus;
    return matchesSearch && matchesTier && matchesStatus;
  });

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'enterprise':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
          <Crown className="w-3 h-3" /> Enterprise
        </span>;
      case 'professional':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 flex items-center gap-1">
          <Shield className="w-3 h-3" /> Premium
        </span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Free</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" /> Active
        </span>;
      case 'inactive':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 flex items-center gap-1">
          <Clock className="w-3 h-3" /> Inactive
        </span>;
      case 'suspended':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 flex items-center gap-1">
          <Ban className="w-3 h-3" /> Suspended
        </span>;
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return `₩${(amount / 1000).toFixed(0)}K`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const exportUserData = () => {
    // CSV 내보내기 시뮬레이션
    const csv = [
      ['Name', 'Email', 'Tier', 'Status', 'Registered', 'Last Active', 'Revenue'].join(','),
      ...filteredUsers.map(u => [
        u.name,
        u.email,
        u.subscriptionTier,
        u.status,
        formatDate(u.registeredAt),
        formatDate(u.lastActive),
        u.revenue
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Shield className="w-8 h-8 text-purple-600" />
                관리자 대시보드
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                시스템 전체를 모니터링하고 관리하세요
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Activity className="w-4 h-4 text-green-500" />
              <span>시스템 정상 운영 중</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 flex gap-4 border-b border-gray-200 dark:border-gray-700">
            {[
              { id: 'overview', label: '개요', icon: BarChart3 },
              { id: 'users', label: '사용자 관리', icon: Users },
              { id: 'revenue', label: '수익 분석', icon: DollarSign },
              { id: 'health', label: '시스템 상태', icon: Activity }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">전체 사용자</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.totalUsers.toLocaleString()}
                    </p>
                    <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                      <ArrowUpRight className="w-4 h-4" />
                      12.5% 증가
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">월간 반복 수익</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(stats.mrr)}
                    </p>
                    <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                      <ArrowUpRight className="w-4 h-4" />
                      8.3% 증가
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">전환율</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.conversionRate}%
                    </p>
                    <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                      <ArrowUpRight className="w-4 h-4" />
                      2.1% 증가
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">이탈률</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.churnRate}%
                    </p>
                    <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                      <ArrowDownRight className="w-4 h-4" />
                      0.8% 감소
                    </p>
                  </div>
                  <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-lg">
                    <AlertCircle className="w-8 h-8 text-amber-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">월간 수익 추이</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value: any) => `₩${value.toLocaleString()}`} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#9333ea" strokeWidth={2} name="수익" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Subscription Distribution */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">구독 티어 분포</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={subscriptionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value.toLocaleString()}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {subscriptionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="이름 또는 이메일 검색..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <select
                  value={filterTier}
                  onChange={(e) => setFilterTier(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">모든 티어</option>
                  <option value="free">Free</option>
                  <option value="premium">Premium</option>
                  <option value="enterprise">Enterprise</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">모든 상태</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
                <button
                  onClick={exportUserData}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  내보내기
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">사용자</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">구독 티어</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">상태</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">가입일</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">마지막 활동</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">수익</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getTierBadge(user.subscriptionTier)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(user.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(user.registeredAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(user.lastActive)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          ₩{user.revenue.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Revenue Tab */}
        {activeTab === 'revenue' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">월간 수익 및 사용자 증가</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" tickFormatter={(value) => formatCurrency(value)} />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="revenue" fill="#9333ea" name="수익 (₩)" />
                  <Bar yAxisId="right" dataKey="users" fill="#10b981" name="사용자 수" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue by Tier */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Free 티어</h4>
                  <Users className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.freeUsers.toLocaleString()}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">사용자</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">₩0 / 월간</p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Premium 티어</h4>
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.premiumUsers.toLocaleString()}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">사용자</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">₩{(stats.premiumUsers * 29000).toLocaleString()} / 월간</p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Enterprise 티어</h4>
                  <Crown className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.enterpriseUsers.toLocaleString()}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">사용자</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">₩{(stats.enterpriseUsers * 99000).toLocaleString()} / 월간</p>
              </div>
            </div>
          </div>
        )}

        {/* Health Tab */}
        {activeTab === 'health' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">API 응답 시간</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{health.apiResponseTime}ms</p>
                    <p className="mt-2 text-sm text-green-600">정상</p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">에러율</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{health.errorRate}%</p>
                    <p className="mt-2 text-sm text-green-600">정상</p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Activity className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">활성 세션</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{health.activeSessions.toLocaleString()}</p>
                    <p className="mt-2 text-sm text-green-600">정상</p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">가동 시간</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{health.uptime}%</p>
                    <p className="mt-2 text-sm text-green-600">정상</p>
                  </div>
                  <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-amber-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">시스템 구성 요소 상태</h3>
              <div className="space-y-4">
                {[
                  { name: 'API 서버', status: 'operational', latency: '142ms' },
                  { name: '데이터베이스', status: 'operational', latency: '23ms' },
                  { name: '캐시 서버', status: 'operational', latency: '8ms' },
                  { name: '파일 저장소', status: 'operational', latency: '95ms' },
                  { name: '이메일 서비스', status: 'operational', latency: '312ms' },
                  { name: '결제 게이트웨이', status: 'operational', latency: '487ms' }
                ].map((component, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-medium text-gray-900 dark:text-white">{component.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{component.latency}</span>
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        정상
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
