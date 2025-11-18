import React from 'react';
import { Clock, TrendingUp, FileText, Download, BarChart3, Eye, Sparkles, ArrowRight } from 'lucide-react';
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

  const stats = [
    {
      icon: <FileText className="w-6 h-6" />,
      label: '저장된 리포트',
      value: savedReports.length,
      gradient: 'from-blue-500 to-cyan-500',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      label: '비교 중',
      value: comparisonItems.length,
      gradient: 'from-emerald-500 to-teal-500',
      textColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      icon: <Eye className="w-6 h-6" />,
      label: '최근 활동',
      value: recentActivity.length,
      gradient: 'from-purple-500 to-pink-500',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: '구독 상태',
      value: user?.subscriptionTier === 'free' ? '무료' :
             user?.subscriptionTier === 'professional' ? '프리미엄' : '엔터프라이즈',
      gradient: 'from-amber-500 to-orange-500',
      textColor: 'text-amber-600 dark:text-amber-400'
    },
  ];

  return (
    <section className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-pink-600/10 dark:from-purple-500/20 dark:via-blue-500/20 dark:to-pink-500/20 p-8 md:p-12">
        <div className="absolute inset-0 bg-dot-pattern opacity-30" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm mb-4">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-300">
              {user?.subscriptionTier === 'free' ? '무료 플랜' :
               user?.subscriptionTier === 'professional' ? '프리미엄 플랜' : '엔터프라이즈 플랜'}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
            환영합니다, {user?.name}님
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            BI 대시보드 시장의 최신 인사이트를 확인하고 데이터 기반 의사결정을 시작하세요
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="card group hover:scale-[1.02] transition-all duration-300"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              {stat.label}
            </p>
            <p className={`text-3xl md:text-4xl font-bold ${stat.textColor}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 최근 활동 */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              최근 활동
            </h3>
          </div>
          {recentActivity.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                아직 활동 기록이 없습니다
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                시장 분석이나 서비스 비교를 시작해보세요
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {recentActivity.map((activity) => {
                const Icon = getActivityIcon(activity.action);
                return (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 p-4 bg-gray-50/50 dark:bg-white/5 rounded-xl hover:bg-gray-100/50 dark:hover:bg-white/10 transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-white/10"
                  >
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                      <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
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
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              저장된 리포트
            </h3>
            {savedReports.length > 0 && (
              <button className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1">
                모두 보기
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
          {savedReports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                저장된 리포트가 없습니다
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                분석 결과를 저장하여 나중에 다시 확인하세요
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {savedReports.slice(0, 5).map((report) => (
                <div
                  key={report.id}
                  className="group p-4 bg-gray-50/50 dark:bg-white/5 rounded-xl hover:bg-gray-100/50 dark:hover:bg-white/10 transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-white/10 cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                          {report.name}
                        </p>
                        <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      {report.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                          {report.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {formatDate(report.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 빠른 액션 */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">빠른 액션</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: BarChart3, label: '새 비교', gradient: 'from-purple-500 to-pink-500' },
            { icon: Download, label: '데이터 내보내기', gradient: 'from-blue-500 to-cyan-500' },
            { icon: Eye, label: '시장 동향', gradient: 'from-emerald-500 to-teal-500' },
            { icon: FileText, label: '리포트 생성', gradient: 'from-amber-500 to-orange-500' },
          ].map((action, index) => (
            <button
              key={index}
              className="group p-6 bg-gray-50/50 dark:bg-white/5 rounded-xl hover:bg-gray-100/50 dark:hover:bg-white/10 transition-all duration-200 border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 hover:scale-[1.02]"
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${action.gradient} text-white mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {action.label}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UserDashboard;
