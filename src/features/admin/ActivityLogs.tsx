import React, { useState } from 'react';
import { useAuth } from '@/shared/contexts/AuthContext';
import {
  Activity,
  LogIn,
  CreditCard,
  Settings,
  FileText,
  Users,
  Shield,
  Download,
  Search,
  Clock,
  User,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: string;
  category: 'auth' | 'subscription' | 'data' | 'settings' | 'security' | 'team';
  severity: 'info' | 'warning' | 'critical';
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  details?: Record<string, any>;
}

const ActivityLogs: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | ActivityLog['category']>('all');
  const [filterSeverity, setFilterSeverity] = useState<'all' | ActivityLog['severity']>('all');
  const [dateRange, setDateRange] = useState('7days');
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  // Mock 활동 로그 데이터
  const [logs] = useState<ActivityLog[]>([
    {
      id: '1',
      userId: 'user-123',
      userName: '김민수',
      userEmail: 'minsu.kim@example.com',
      action: '로그인 성공',
      category: 'auth',
      severity: 'info',
      timestamp: new Date('2025-11-17T09:30:00'),
      ipAddress: '123.456.789.012',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
      details: { method: 'email', mfaUsed: false }
    },
    {
      id: '2',
      userId: 'user-456',
      userName: '이지은',
      userEmail: 'jieun.lee@example.com',
      action: '구독 플랜 변경',
      category: 'subscription',
      severity: 'info',
      timestamp: new Date('2025-11-17T08:15:00'),
      ipAddress: '123.456.789.013',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      details: { from: 'free', to: 'professional', amount: 29000 }
    },
    {
      id: '3',
      userId: 'user-789',
      userName: '박서준',
      userEmail: 'seojun.park@example.com',
      action: '시장 분석 리포트 다운로드',
      category: 'data',
      severity: 'info',
      timestamp: new Date('2025-11-17T07:45:00'),
      ipAddress: '123.456.789.014',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
      details: { reportType: 'market-overview', format: 'pdf' }
    },
    {
      id: '4',
      userId: 'user-123',
      userName: '김민수',
      userEmail: 'minsu.kim@example.com',
      action: '5회 연속 로그인 실패',
      category: 'security',
      severity: 'warning',
      timestamp: new Date('2025-11-16T23:20:00'),
      ipAddress: '123.456.789.015',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      details: { attempts: 5, locked: false }
    },
    {
      id: '5',
      userId: 'user-456',
      userName: '이지은',
      userEmail: 'jieun.lee@example.com',
      action: '팀 멤버 초대',
      category: 'team',
      severity: 'info',
      timestamp: new Date('2025-11-16T16:30:00'),
      ipAddress: '123.456.789.016',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      details: { invitedEmail: 'newmember@example.com', role: 'member' }
    },
    {
      id: '6',
      userId: 'user-234',
      userName: '최수진',
      userEmail: 'sujin.choi@example.com',
      action: '계정 설정 변경',
      category: 'settings',
      severity: 'info',
      timestamp: new Date('2025-11-16T14:10:00'),
      ipAddress: '123.456.789.017',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      details: { changes: ['email_notifications', 'language'] }
    },
    {
      id: '7',
      userId: 'user-789',
      userName: '박서준',
      userEmail: 'seojun.park@example.com',
      action: '결제 정보 업데이트',
      category: 'subscription',
      severity: 'info',
      timestamp: new Date('2025-11-16T11:25:00'),
      ipAddress: '123.456.789.018',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
      details: { paymentMethod: 'card', last4: '1234' }
    },
    {
      id: '8',
      userId: 'admin-001',
      userName: 'System Admin',
      userEmail: 'admin@bimarket.com',
      action: '사용자 계정 일시 정지',
      category: 'security',
      severity: 'critical',
      timestamp: new Date('2025-11-15T18:40:00'),
      ipAddress: '123.456.789.019',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      details: { targetUser: 'suspicious@example.com', reason: 'fraudulent_activity' }
    },
    {
      id: '9',
      userId: 'user-345',
      userName: '정하늘',
      userEmail: 'haneul.jung@example.com',
      action: 'API 키 생성',
      category: 'settings',
      severity: 'info',
      timestamp: new Date('2025-11-15T10:15:00'),
      ipAddress: '123.456.789.020',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      details: { keyName: 'Production API Key', permissions: ['read', 'write'] }
    },
    {
      id: '10',
      userId: 'user-123',
      userName: '김민수',
      userEmail: 'minsu.kim@example.com',
      action: '데이터 대량 내보내기',
      category: 'data',
      severity: 'info',
      timestamp: new Date('2025-11-15T09:00:00'),
      ipAddress: '123.456.789.021',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      details: { format: 'csv', records: 15234 }
    }
  ]);

  // 필터링된 로그
  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || log.category === filterCategory;
    const matchesSeverity = filterSeverity === 'all' || log.severity === filterSeverity;

    // 날짜 필터링
    const now = new Date();
    const logDate = new Date(log.timestamp);
    let matchesDate = true;

    if (dateRange === '24hours') {
      matchesDate = (now.getTime() - logDate.getTime()) <= 24 * 60 * 60 * 1000;
    } else if (dateRange === '7days') {
      matchesDate = (now.getTime() - logDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
    } else if (dateRange === '30days') {
      matchesDate = (now.getTime() - logDate.getTime()) <= 30 * 24 * 60 * 60 * 1000;
    }

    return matchesSearch && matchesCategory && matchesSeverity && matchesDate;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'auth':
        return <LogIn className="w-5 h-5" />;
      case 'subscription':
        return <CreditCard className="w-5 h-5" />;
      case 'data':
        return <FileText className="w-5 h-5" />;
      case 'settings':
        return <Settings className="w-5 h-5" />;
      case 'security':
        return <Shield className="w-5 h-5" />;
      case 'team':
        return <Users className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      auth: 'bg-blue-100 text-blue-800',
      subscription: 'bg-purple-100 text-purple-800',
      data: 'bg-green-100 text-green-800',
      settings: 'bg-gray-100 text-gray-800',
      security: 'bg-red-100 text-red-800',
      team: 'bg-amber-100 text-amber-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">긴급</span>;
      case 'warning':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">경고</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">정보</span>;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
      return `${minutes}분 전`;
    } else if (hours < 24) {
      return `${hours}시간 전`;
    } else if (days < 7) {
      return `${days}일 전`;
    } else {
      return new Date(date).toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const exportLogs = () => {
    const csv = [
      ['Timestamp', 'User', 'Email', 'Action', 'Category', 'Severity', 'IP Address'].join(','),
      ...filteredLogs.map(log => [
        new Date(log.timestamp).toISOString(),
        log.userName,
        log.userEmail,
        log.action,
        log.category,
        log.severity,
        log.ipAddress
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-logs-${new Date().toISOString()}.csv`;
    a.click();
  };

  // Enterprise 전용 기능 체크
  const isEnterpriseUser = user?.subscriptionTier === 'enterprise';

  if (!isEnterpriseUser && user?.subscriptionTier !== 'professional') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <Shield className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            활동 로그는 Premium 이상 플랜에서 사용 가능합니다
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            모든 활동을 추적하고 보안을 강화하려면 프리미엄 또는 엔터프라이즈 플랜으로 업그레이드하세요.
          </p>
          <button className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium">
            플랜 업그레이드
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Activity className="w-8 h-8 text-purple-600" />
                활동 로그
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {isEnterpriseUser ? '전체 활동 기록 및 감사 추적' : '최근 활동 기록'}
              </p>
            </div>
            <button
              onClick={exportLogs}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Download className="w-4 h-4" />
              내보내기
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="사용자 또는 활동 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">모든 카테고리</option>
              <option value="auth">인증</option>
              <option value="subscription">구독</option>
              <option value="data">데이터</option>
              <option value="settings">설정</option>
              <option value="security">보안</option>
              <option value="team">팀</option>
            </select>

            {/* Severity Filter */}
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">모든 심각도</option>
              <option value="info">정보</option>
              <option value="warning">경고</option>
              <option value="critical">긴급</option>
            </select>

            {/* Date Range */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="24hours">최근 24시간</option>
              <option value="7days">최근 7일</option>
              <option value="30days">최근 30일</option>
              <option value="all">전체 기간</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            총 {filteredLogs.length}개의 활동 기록
          </div>
        </div>

        {/* Activity Logs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredLogs.map(log => (
              <div key={log.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Icon */}
                    <div className={`p-2 rounded-lg ${getCategoryBadge(log.category)}`}>
                      {getCategoryIcon(log.category)}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {log.action}
                        </h3>
                        {getSeverityBadge(log.severity)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {log.userName} ({log.userEmail})
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatTimestamp(log.timestamp)}
                        </span>
                      </div>

                      {/* Expandable Details */}
                      {expandedLog === log.id && (
                        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg text-sm">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <span className="font-medium text-gray-700 dark:text-gray-300">IP 주소:</span>
                              <span className="ml-2 text-gray-600 dark:text-gray-400">{log.ipAddress}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700 dark:text-gray-300">타임스탬프:</span>
                              <span className="ml-2 text-gray-600 dark:text-gray-400">
                                {new Date(log.timestamp).toLocaleString('ko-KR')}
                              </span>
                            </div>
                            <div className="col-span-2">
                              <span className="font-medium text-gray-700 dark:text-gray-300">User Agent:</span>
                              <span className="ml-2 text-gray-600 dark:text-gray-400 break-all">{log.userAgent}</span>
                            </div>
                            {log.details && (
                              <div className="col-span-2">
                                <span className="font-medium text-gray-700 dark:text-gray-300">상세 정보:</span>
                                <pre className="mt-2 p-2 bg-gray-200 dark:bg-gray-800 rounded text-xs overflow-x-auto">
                                  {JSON.stringify(log.details, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <button
                    onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    {expandedLog === log.id ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            ))}

            {filteredLogs.length === 0 && (
              <div className="p-12 text-center">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">활동 기록이 없습니다</p>
              </div>
            )}
          </div>
        </div>

        {/* Enterprise Audit Trail Notice */}
        {isEnterpriseUser && (
          <div className="mt-6 bg-purple-50 dark:bg-purple-900 border border-purple-200 dark:border-purple-700 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-purple-900 dark:text-purple-100">
                  Enterprise 감사 추적
                </h4>
                <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                  모든 활동 로그는 90일 동안 보관되며, 규정 준수를 위해 암호화되어 저장됩니다.
                  자세한 감사 리포트가 필요하신 경우 고객 지원팀에 문의하세요.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogs;
