import React, { useState } from 'react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useToast } from '@/shared/contexts/ToastContext';
import {
  Download,
  Upload,
  FileText,
  FileSpreadsheet,
  File,
  Clock,
  Check,
  X,
  AlertCircle,
  Calendar,
  Settings,
  Trash2
} from 'lucide-react';

interface ExportHistory {
  id: string;
  name: string;
  type: 'market' | 'service' | 'industry' | 'custom';
  format: 'csv' | 'excel' | 'json' | 'pdf';
  status: 'completed' | 'processing' | 'failed';
  createdAt: Date;
  fileSize: string;
  recordCount: number;
}

interface ScheduledExport {
  id: string;
  name: string;
  dataType: string;
  format: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  nextRun: Date;
  enabled: boolean;
}

const DataExportCenter: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState<'export' | 'import' | 'history' | 'scheduled'>('export');
  const [selectedDataType, setSelectedDataType] = useState('market');
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'excel' | 'json' | 'pdf'>('csv');
  const [selectedFields, setSelectedFields] = useState<string[]>(['all']);
  const [dateRange, setDateRange] = useState('all');
  const [isExporting, setIsExporting] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);

  // Mock 내보내기 히스토리
  const [exportHistory] = useState<ExportHistory[]>([
    {
      id: '1',
      name: '시장 개요 데이터',
      type: 'market',
      format: 'csv',
      status: 'completed',
      createdAt: new Date('2025-11-17T10:30:00'),
      fileSize: '2.3 MB',
      recordCount: 15234
    },
    {
      id: '2',
      name: '서비스 분석 리포트',
      type: 'service',
      format: 'pdf',
      status: 'completed',
      createdAt: new Date('2025-11-16T14:20:00'),
      fileSize: '5.7 MB',
      recordCount: 1
    },
    {
      id: '3',
      name: '산업 동향 데이터',
      type: 'industry',
      format: 'excel',
      status: 'processing',
      createdAt: new Date('2025-11-17T11:15:00'),
      fileSize: '-',
      recordCount: 8432
    },
    {
      id: '4',
      name: '커스텀 분석 데이터',
      type: 'custom',
      format: 'json',
      status: 'failed',
      createdAt: new Date('2025-11-15T09:45:00'),
      fileSize: '-',
      recordCount: 0
    }
  ]);

  // Mock 예약된 내보내기
  const [scheduledExports, setScheduledExports] = useState<ScheduledExport[]>([
    {
      id: '1',
      name: '주간 시장 리포트',
      dataType: '시장 개요',
      format: 'PDF',
      frequency: 'weekly',
      nextRun: new Date('2025-11-24T09:00:00'),
      enabled: true
    },
    {
      id: '2',
      name: '일간 서비스 데이터',
      dataType: '서비스 분석',
      format: 'CSV',
      frequency: 'daily',
      nextRun: new Date('2025-11-18T08:00:00'),
      enabled: true
    },
    {
      id: '3',
      name: '월간 산업 동향',
      dataType: '산업 분석',
      format: 'Excel',
      frequency: 'monthly',
      nextRun: new Date('2025-12-01T10:00:00'),
      enabled: false
    }
  ]);

  const dataTypeOptions = [
    { value: 'market', label: '시장 개요 데이터' },
    { value: 'service', label: '서비스 분석 데이터' },
    { value: 'industry', label: '산업 동향 데이터' },
    { value: 'pricing', label: '가격 정책 데이터' },
    { value: 'custom', label: '커스텀 데이터' }
  ];

  const fieldOptions = {
    market: ['시장 규모', '성장률', '지역별 데이터', '예측 데이터', '경쟁사 분석'],
    service: ['서비스명', '카테고리', '가격', '사용자 수', '만족도'],
    industry: ['산업 분류', '트렌드', '주요 플레이어', '시장 점유율'],
    pricing: ['가격 정책', '할인율', '프로모션', '구독 모델'],
    custom: ['전체 데이터']
  };

  const handleExport = () => {
    setIsExporting(true);

    // 내보내기 시뮬레이션
    setTimeout(() => {
      setIsExporting(false);
      success(`데이터가 ${selectedFormat.toUpperCase()} 형식으로 내보내기되었습니다.`);

      // 실제 구현에서는 백엔드 API 호출
      const blob = new Blob(['Mock export data'], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export-${selectedDataType}-${Date.now()}.${selectedFormat}`;
      a.click();
    }, 2000);
  };

  const handleImport = () => {
    if (!importFile) {
      error('파일을 선택해주세요.');
      return;
    }

    // 가져오기 시뮬레이션
    success(`${importFile.name} 파일을 성공적으로 가져왔습니다.`);
    setImportFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImportFile(e.target.files[0]);
    }
  };

  const toggleScheduledExport = (id: string) => {
    setScheduledExports(scheduledExports.map(exp =>
      exp.id === id ? { ...exp, enabled: !exp.enabled } : exp
    ));
    success('예약 내보내기 설정이 업데이트되었습니다.');
  };

  const deleteScheduledExport = (id: string) => {
    setScheduledExports(scheduledExports.filter(exp => exp.id !== id));
    success('예약 내보내기가 삭제되었습니다.');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 flex items-center gap-1">
            <Check className="w-3 h-3" /> 완료
          </span>
        );
      case 'processing':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 flex items-center gap-1">
            <Clock className="w-3 h-3" /> 처리 중
          </span>
        );
      case 'failed':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 flex items-center gap-1">
            <X className="w-3 h-3" /> 실패
          </span>
        );
      default:
        return null;
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'csv':
        return <FileText className="w-5 h-5 text-green-600" />;
      case 'excel':
        return <FileSpreadsheet className="w-5 h-5 text-green-600" />;
      case 'json':
        return <File className="w-5 h-5 text-blue-600" />;
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-600" />;
      default:
        return <File className="w-5 h-5 text-gray-600" />;
    }
  };

  const isEnterpriseUser = user?.subscriptionTier === 'enterprise';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Download className="w-8 h-8 text-purple-600" />
                데이터 관리 센터
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                데이터 내보내기, 가져오기 및 관리
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 flex gap-4 border-b border-gray-200 dark:border-gray-700">
            {[
              { id: 'export', label: '내보내기', icon: Download },
              { id: 'import', label: '가져오기', icon: Upload },
              { id: 'history', label: '히스토리', icon: Clock },
              { id: 'scheduled', label: '예약 내보내기', icon: Calendar, enterprise: true }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                disabled={tab.enterprise && !isEnterpriseUser}
                className={`px-4 py-2 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                } ${tab.enterprise && !isEnterpriseUser ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.enterprise && !isEnterpriseUser && (
                  <span className="text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">Enterprise</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Export Tab */}
        {activeTab === 'export' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">데이터 내보내기</h2>

              <div className="space-y-6">
                {/* Data Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    데이터 유형
                  </label>
                  <select
                    value={selectedDataType}
                    onChange={(e) => setSelectedDataType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {dataTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* Format Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    파일 형식
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {(['csv', 'excel', 'json', 'pdf'] as const).map(format => (
                      <button
                        key={format}
                        onClick={() => setSelectedFormat(format)}
                        className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                          selectedFormat === format
                            ? 'border-purple-600 bg-purple-50 dark:bg-purple-900'
                            : 'border-gray-200 dark:border-gray-600 hover:border-purple-300'
                        }`}
                      >
                        {getFormatIcon(format)}
                        <span className="text-sm font-medium text-gray-900 dark:text-white uppercase">
                          {format}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Field Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    내보낼 필드 선택
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFields.includes('all')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFields(['all']);
                          } else {
                            setSelectedFields([]);
                          }
                        }}
                        className="rounded text-purple-600"
                      />
                      <span className="text-sm text-gray-900 dark:text-white font-medium">전체 필드</span>
                    </label>

                    {!selectedFields.includes('all') &&
                      fieldOptions[selectedDataType as keyof typeof fieldOptions]?.map((field, idx) => (
                        <label
                          key={idx}
                          className="flex items-center gap-2 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedFields.includes(field)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedFields([...selectedFields, field]);
                              } else {
                                setSelectedFields(selectedFields.filter(f => f !== field));
                              }
                            }}
                            className="rounded text-purple-600"
                          />
                          <span className="text-sm text-gray-900 dark:text-white">{field}</span>
                        </label>
                      ))}
                  </div>
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    기간 선택
                  </label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">전체 기간</option>
                    <option value="today">오늘</option>
                    <option value="week">최근 7일</option>
                    <option value="month">최근 30일</option>
                    <option value="quarter">최근 3개월</option>
                    <option value="year">최근 1년</option>
                  </select>
                </div>

                {/* Export Button */}
                <div className="flex items-center gap-4 pt-4">
                  <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                  >
                    {isExporting ? (
                      <>
                        <Clock className="w-5 h-5 animate-spin" />
                        내보내는 중...
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        데이터 내보내기
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Import Tab */}
        {activeTab === 'import' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">데이터 가져오기</h2>

              <div className="space-y-6">
                {/* File Upload */}
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    파일 업로드
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    CSV, Excel 또는 JSON 파일을 드래그하거나 클릭하여 선택하세요
                  </p>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.json"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 cursor-pointer"
                  >
                    파일 선택
                  </label>
                  {importFile && (
                    <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900 rounded-lg inline-flex items-center gap-2">
                      <FileText className="w-5 h-5 text-purple-600" />
                      <span className="text-sm text-purple-900 dark:text-purple-100">{importFile.name}</span>
                    </div>
                  )}
                </div>

                {/* Import Instructions */}
                <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                        가져오기 안내
                      </h4>
                      <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
                        <li>파일은 최대 10MB까지 업로드 가능합니다</li>
                        <li>CSV 파일은 UTF-8 인코딩을 사용해야 합니다</li>
                        <li>첫 번째 행은 헤더로 인식됩니다</li>
                        <li>중복 데이터는 자동으로 병합됩니다</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Import Button */}
                <button
                  onClick={handleImport}
                  disabled={!importFile}
                  className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                >
                  <Upload className="w-5 h-5" />
                  데이터 가져오기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">내보내기 히스토리</h2>

              <div className="space-y-3">
                {exportHistory.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <div className="flex items-center gap-4">
                      {getFormatIcon(item.format)}
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{item.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <span>{item.fileSize}</span>
                          <span>{item.recordCount.toLocaleString()} 레코드</span>
                          <span>{new Date(item.createdAt).toLocaleString('ko-KR')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(item.status)}
                      {item.status === 'completed' && (
                        <button className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900 rounded-lg">
                          <Download className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Scheduled Exports Tab */}
        {activeTab === 'scheduled' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">예약된 내보내기</h2>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  새 예약 추가
                </button>
              </div>

              {!isEnterpriseUser ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Enterprise 전용 기능
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    예약된 자동 내보내기는 Enterprise 플랜에서 사용 가능합니다.
                  </p>
                  <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
                    Enterprise로 업그레이드
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {scheduledExports.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{item.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <span>{item.dataType}</span>
                            <span>{item.format}</span>
                            <span className="capitalize">{item.frequency}</span>
                            <span>다음 실행: {new Date(item.nextRun).toLocaleString('ko-KR')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleScheduledExport(item.id)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium ${
                            item.enabled
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {item.enabled ? '활성' : '비활성'}
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                          <Settings className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteScheduledExport(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataExportCenter;
