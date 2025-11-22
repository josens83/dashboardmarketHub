import React, { useState } from 'react';
import { Calendar, Clock, Mail, Plus, Trash2, CheckCircle } from 'lucide-react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useToast } from '@/shared/contexts/ToastContext';

interface ScheduledReport {
  id: string;
  name: string;
  reportType: 'market' | 'service' | 'industry' | 'custom';
  frequency: 'daily' | 'weekly' | 'monthly';
  dayOfWeek?: number; // 0-6 (Sunday-Saturday)
  dayOfMonth?: number; // 1-31
  time: string; // HH:MM format
  recipients: string[];
  format: 'pdf' | 'excel' | 'both';
  enabled: boolean;
  lastSent?: Date;
  nextSend: Date;
}

const ReportScheduler: React.FC = () => {
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 데모 스케줄된 리포트
  const [schedules, setSchedules] = useState<ScheduledReport[]>([
    {
      id: '1',
      name: '주간 시장 동향 리포트',
      reportType: 'market',
      frequency: 'weekly',
      dayOfWeek: 1, // Monday
      time: '09:00',
      recipients: ['kim@company.com', 'lee@company.com'],
      format: 'pdf',
      enabled: true,
      lastSent: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      nextSend: new Date(Date.now() + 1000 * 60 * 60 * 24)
    },
    {
      id: '2',
      name: '월간 서비스 비교 분석',
      reportType: 'service',
      frequency: 'monthly',
      dayOfMonth: 1,
      time: '08:00',
      recipients: ['ceo@company.com'],
      format: 'both',
      enabled: true,
      nextSend: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15)
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    reportType: 'market' as ScheduledReport['reportType'],
    frequency: 'weekly' as ScheduledReport['frequency'],
    dayOfWeek: 1,
    dayOfMonth: 1,
    time: '09:00',
    recipients: '',
    format: 'pdf' as ScheduledReport['format']
  });

  const handleCreate = () => {
    if (!formData.name) {
      showError('리포트 이름을 입력해주세요');
      return;
    }

    if (!formData.recipients) {
      showError('수신자 이메일을 입력해주세요');
      return;
    }

    const recipients = formData.recipients.split(',').map(e => e.trim()).filter(e => e);
    if (recipients.length === 0) {
      showError('최소 1명의 수신자가 필요합니다');
      return;
    }

    // Calculate next send date
    const now = new Date();
    const nextSend = new Date();
    nextSend.setHours(parseInt(formData.time.split(':')[0]), parseInt(formData.time.split(':')[1]), 0, 0);

    if (formData.frequency === 'weekly') {
      const daysUntilNext = (formData.dayOfWeek - now.getDay() + 7) % 7;
      nextSend.setDate(now.getDate() + (daysUntilNext || 7));
    } else if (formData.frequency === 'monthly') {
      nextSend.setDate(formData.dayOfMonth);
      if (nextSend < now) {
        nextSend.setMonth(nextSend.getMonth() + 1);
      }
    } else {
      if (nextSend < now) {
        nextSend.setDate(now.getDate() + 1);
      }
    }

    const newSchedule: ScheduledReport = {
      id: Date.now().toString(),
      name: formData.name,
      reportType: formData.reportType,
      frequency: formData.frequency,
      dayOfWeek: formData.frequency === 'weekly' ? formData.dayOfWeek : undefined,
      dayOfMonth: formData.frequency === 'monthly' ? formData.dayOfMonth : undefined,
      time: formData.time,
      recipients,
      format: formData.format,
      enabled: true,
      nextSend
    };

    setSchedules(prev => [...prev, newSchedule]);
    success('리포트 스케줄이 생성되었습니다');
    setShowCreateModal(false);
    setFormData({
      name: '',
      reportType: 'market',
      frequency: 'weekly',
      dayOfWeek: 1,
      dayOfMonth: 1,
      time: '09:00',
      recipients: '',
      format: 'pdf'
    });
  };

  const toggleSchedule = (id: string) => {
    setSchedules(prev =>
      prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s)
    );
    success('스케줄이 업데이트되었습니다');
  };

  const deleteSchedule = (id: string, name: string) => {
    if (window.confirm(`"${name}" 스케줄을 삭제하시겠습니까?`)) {
      setSchedules(prev => prev.filter(s => s.id !== id));
      success('스케줄이 삭제되었습니다');
    }
  };

  const getFrequencyText = (schedule: ScheduledReport) => {
    const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

    if (schedule.frequency === 'daily') {
      return `매일 ${schedule.time}`;
    } else if (schedule.frequency === 'weekly') {
      return `매주 ${dayNames[schedule.dayOfWeek!]} ${schedule.time}`;
    } else {
      return `매월 ${schedule.dayOfMonth}일 ${schedule.time}`;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getReportTypeLabel = (type: ScheduledReport['reportType']) => {
    const labels = {
      market: '시장 개요',
      service: '서비스 비교',
      industry: '산업별 분석',
      custom: '커스텀 리포트'
    };
    return labels[type];
  };

  // Premium 이상 체크
  if (user?.subscriptionTier === 'free') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-8 text-white text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-3">자동 리포트 스케줄링</h2>
          <p className="text-lg mb-6 text-blue-100">
            리포트를 자동으로 생성하고 이메일로 받아보세요
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold mb-3">프리미엄 플랜 이상 전용 기능:</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                일간/주간/월간 자동 리포트
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                팀원에게 자동 이메일 발송
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                PDF, Excel 형식 선택
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                커스텀 리포트 템플릿
              </li>
            </ul>
          </div>
          <button className="px-8 py-3 bg-white text-blue-700 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors">
            프리미엄 플랜으로 업그레이드
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          리포트 스케줄링
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          자동으로 리포트를 생성하고 이메일로 받아보세요
        </p>
      </div>

      {/* Create Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          새 스케줄 만들기
        </button>
      </div>

      {/* Schedules List */}
      <div className="space-y-4">
        {schedules.map(schedule => (
          <div
            key={schedule.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {schedule.name}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    schedule.enabled
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {schedule.enabled ? '활성' : '비활성'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {getReportTypeLabel(schedule.reportType)}
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {getFrequencyText(schedule)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {schedule.recipients.length}명에게 발송
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    다음 발송: {formatDate(schedule.nextSend)}
                  </div>
                  {schedule.lastSent && (
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      마지막 발송: {formatDate(schedule.lastSent)}
                    </div>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {schedule.recipients.map((email, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-700 dark:text-gray-300"
                    >
                      {email}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => toggleSchedule(schedule.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    schedule.enabled
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {schedule.enabled ? '일시중지' : '활성화'}
                </button>
                <button
                  onClick={() => deleteSchedule(schedule.id, schedule.name)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {schedules.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">
              설정된 스케줄이 없습니다
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              첫 번째 자동 리포트를 만들어보세요
            </p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              새 리포트 스케줄 만들기
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  리포트 이름
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="주간 시장 동향 리포트"
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  리포트 유형
                </label>
                <select
                  value={formData.reportType}
                  onChange={(e) => setFormData({ ...formData, reportType: e.target.value as any })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900 dark:text-white"
                >
                  <option value="market">시장 개요</option>
                  <option value="service">서비스 비교</option>
                  <option value="industry">산업별 분석</option>
                  <option value="custom">커스텀 리포트</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  발송 주기
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900 dark:text-white"
                >
                  <option value="daily">매일</option>
                  <option value="weekly">매주</option>
                  <option value="monthly">매월</option>
                </select>
              </div>

              {formData.frequency === 'weekly' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    요일
                  </label>
                  <select
                    value={formData.dayOfWeek}
                    onChange={(e) => setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900 dark:text-white"
                  >
                    <option value="0">일요일</option>
                    <option value="1">월요일</option>
                    <option value="2">화요일</option>
                    <option value="3">수요일</option>
                    <option value="4">목요일</option>
                    <option value="5">금요일</option>
                    <option value="6">토요일</option>
                  </select>
                </div>
              )}

              {formData.frequency === 'monthly' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    날짜
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={formData.dayOfMonth}
                    onChange={(e) => setFormData({ ...formData, dayOfMonth: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900 dark:text-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  발송 시간
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  수신자 이메일 (쉼표로 구분)
                </label>
                <input
                  type="text"
                  value={formData.recipients}
                  onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
                  placeholder="kim@company.com, lee@company.com"
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  파일 형식
                </label>
                <select
                  value={formData.format}
                  onChange={(e) => setFormData({ ...formData, format: e.target.value as any })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900 dark:text-white"
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="both">PDF + Excel</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleCreate}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  스케줄 만들기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportScheduler;
