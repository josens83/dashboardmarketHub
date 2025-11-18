import React from 'react';
import { FileText, Trash2, Calendar, Eye } from 'lucide-react';
import { useUserData } from '@/shared/contexts/UserDataContext';

const SavedReportsPage: React.FC = () => {
  const { savedReports, deleteReport } = useUserData();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getReportTypeLabel = (type: string) => {
    const labels = {
      market: '시장 분석',
      service: '서비스 비교',
      industry: '산업 분석',
      comparison: '비교 분석',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getReportTypeColor = (type: string) => {
    const colors = {
      market: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      service: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      industry: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      comparison: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`"${name}" 리포트를 삭제하시겠습니까?`)) {
      deleteReport(id);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-primary-600" />
          <div>
            <h2 className="text-3xl font-bold">저장된 리포트</h2>
            <p className="text-gray-600 dark:text-gray-400">
              총 {savedReports.length}개의 리포트
            </p>
          </div>
        </div>
      </div>

      {savedReports.length === 0 ? (
        <div className="card text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">저장된 리포트가 없습니다</h3>
          <p className="text-gray-600 dark:text-gray-400">
            분석 페이지에서 리포트를 저장하여 나중에 다시 확인하세요
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedReports.map((report) => (
            <div
              key={report.id}
              className="card hover:shadow-xl transition-shadow group"
            >
              {/* 리포트 타입 뱃지 */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getReportTypeColor(
                    report.type
                  )}`}
                >
                  {getReportTypeLabel(report.type)}
                </span>
                <button
                  onClick={() => handleDelete(report.id, report.name)}
                  className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all"
                  title="삭제"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>

              {/* 리포트 제목 */}
              <h3 className="text-lg font-bold mb-2 line-clamp-2">
                {report.name}
              </h3>

              {/* 리포트 설명 */}
              {report.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {report.description}
                </p>
              )}

              {/* 날짜 정보 */}
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 mb-4">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(report.createdAt)}</span>
              </div>

              {/* 액션 버튼 */}
              <button className="w-full py-2 px-4 bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-900/50 text-primary-700 dark:text-primary-300 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors">
                <Eye className="w-4 h-4" />
                리포트 보기
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default SavedReportsPage;
