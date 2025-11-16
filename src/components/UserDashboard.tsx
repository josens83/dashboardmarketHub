import React from 'react';
import { Clock, TrendingUp, FileText, Download, BarChart3, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUserData } from '../contexts/UserDataContext';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { savedReports, getRecentActivity, comparisonItems } = useUserData();

  const recentActivity = getRecentActivity(10);

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'view':
        return Eye;
      case 'export':
        return Download;
      case 'compare':
        return BarChart3;
      case 'save':
        return FileText;
      default:
        return Clock;
    }
  };

  const getActivityLabel = (action: string) => {
    const labels = {
      view: '조회',
      export: '내보내기',
      compare: '비교',
      save: '저장',
    };
    return labels[action as keyof typeof labels] || action;
  };

  const getResourceLabel = (type: string) => {
    const labels = {
      market: '시장 데이터',
      service: '서비스',
      industry: '산업 분석',
      report: '리포트',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return d.toLocaleDateString('ko-KR');
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-8 h-8 text-primary-600" />
        <div>
          <h2 className="text-3xl font-bold">내 대시보드</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {user?.name}님, 환영합니다!
          </p>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold">저장된 리포트</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">{savedReports.length}</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold">비교 중</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">{comparisonItems.length}</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <Eye className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold">최근 활동</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">{recentActivity.length}</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold">구독 상태</h3>
          </div>
          <p className="text-lg font-bold text-orange-600">
            {user?.subscriptionTier === 'free' ? '무료' :
             user?.subscriptionTier === 'premium' ? '프리미엄' : '엔터프라이즈'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 최근 활동 */}
        <div className="card">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-600" />
            최근 활동
          </h3>
          {recentActivity.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">
              아직 활동 기록이 없습니다
            </p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity) => {
                const Icon = getActivityIcon(activity.action);
                return (
                  <div
                    key={activity.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                  >
                    <Icon className="w-5 h-5 text-primary-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">
                        {getActivityLabel(activity.action)} - {getResourceLabel(activity.resourceType)}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {formatDate(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 저장된 리포트 */}
        <div className="card">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-600" />
            저장된 리포트
          </h3>
          {savedReports.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">
              저장된 리포트가 없습니다
            </p>
          ) : (
            <div className="space-y-3">
              {savedReports.slice(0, 5).map((report) => (
                <div
                  key={report.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="font-semibold">{report.name}</p>
                    {report.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {report.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {formatDate(report.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 빠른 액션 */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">빠른 액션</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-600 dark:hover:border-primary-400 transition-colors">
            <BarChart3 className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            <p className="text-sm font-semibold">새 비교</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-600 dark:hover:border-primary-400 transition-colors">
            <Download className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            <p className="text-sm font-semibold">데이터 내보내기</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-600 dark:hover:border-primary-400 transition-colors">
            <Eye className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            <p className="text-sm font-semibold">시장 동향</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-600 dark:hover:border-primary-400 transition-colors">
            <FileText className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            <p className="text-sm font-semibold">리포트 생성</p>
          </button>
        </div>
      </div>
    </section>
  );
};

export default UserDashboard;
