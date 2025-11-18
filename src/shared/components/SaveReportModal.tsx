import React, { useState } from 'react';
import { X, Save, FileText, Calendar } from 'lucide-react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useUserData } from '@/shared/contexts/UserDataContext';

interface SaveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportType: 'market' | 'service' | 'industry' | 'comparison';
  reportData: any;
}

const SaveReportModal: React.FC<SaveReportModalProps> = ({
  isOpen,
  onClose,
  reportType,
  reportData,
}) => {
  const { canUseFeature } = useAuth();
  const { saveReport } = useUserData();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const canSave = canUseFeature('saved_reports');

  const handleSave = () => {
    if (!name.trim()) {
      alert('리포트 이름을 입력해주세요.');
      return;
    }

    saveReport({
      name: name.trim(),
      description: description.trim(),
      type: reportType,
      data: reportData,
    });

    onClose();
    setName('');
    setDescription('');
  };

  const getReportTypeLabel = () => {
    const labels = {
      market: '시장 분석',
      service: '서비스 비교',
      industry: '산업 분석',
      comparison: '비교 분석',
    };
    return labels[reportType];
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-8 h-8 text-primary-600" />
          <h2 className="text-2xl font-bold">리포트 저장</h2>
        </div>

        {!canSave ? (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg mb-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              무료 요금제는 최대 3개의 리포트를 저장할 수 있습니다. 프리미엄으로 업그레이드하여 무제한으로 저장하세요.
            </p>
          </div>
        ) : null}

        <div className="space-y-4">
          {/* 리포트 타입 */}
          <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">리포트 유형</p>
            <p className="font-semibold text-primary-700 dark:text-primary-300">
              {getReportTypeLabel()}
            </p>
          </div>

          {/* 리포트 이름 */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              리포트 이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 2024 Q4 BI 시장 분석"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              maxLength={100}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {name.length}/100
            </p>
          </div>

          {/* 설명 (선택) */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              설명 (선택)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="리포트에 대한 간단한 설명을 입력하세요"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {description.length}/500
            </p>
          </div>

          {/* 저장 정보 */}
          <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              저장 날짜: {new Date().toLocaleDateString('ko-KR')}
            </p>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-semibold transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave || !name.trim()}
            className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveReportModal;
