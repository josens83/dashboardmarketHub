import React, { useState } from 'react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useToast } from '@/shared/contexts/ToastContext';
import {
  LayoutGrid,
  Plus,
  Save,
  Eye,
  Download,
  Share2,
  Settings,
  Trash2,
  BarChart3,
  PieChart,
  LineChart,
  Table,
  Type,
  TrendingUp,
  GripVertical,
  Copy,
  FolderOpen
} from 'lucide-react';

interface Widget {
  id: string;
  type: 'chart' | 'table' | 'metric' | 'text';
  title: string;
  position: { x: number; y: number; w: number; h: number };
  config: any;
}

interface Template {
  id: string;
  name: string;
  description: string;
  widgets: Widget[];
  createdAt: Date;
}

const CustomReportBuilder: React.FC = () => {
  const { user } = useAuth();
  const { success } = useToast();
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [showWidgetLibrary, setShowWidgetLibrary] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [reportName, setReportName] = useState('새 리포트');
  const [isPreview, setIsPreview] = useState(false);

  // Mock saved templates
  const [templates] = useState<Template[]>([
    {
      id: '1',
      name: '시장 분석 대시보드',
      description: '시장 규모, 성장률, 경쟁사 분석을 포함한 종합 대시보드',
      widgets: [],
      createdAt: new Date('2025-11-10')
    },
    {
      id: '2',
      name: '수익 리포트',
      description: 'MRR, ARR, 전환율 등 핵심 수익 지표',
      widgets: [],
      createdAt: new Date('2025-11-05')
    },
    {
      id: '3',
      name: '사용자 분석',
      description: '사용자 획득, 활성도, 이탈 분석',
      widgets: [],
      createdAt: new Date('2025-11-01')
    }
  ]);

  const widgetTypes = [
    {
      type: 'chart',
      icon: <BarChart3 className="w-6 h-6" />,
      label: '차트',
      description: '막대, 선, 파이 차트 등'
    },
    {
      type: 'table',
      icon: <Table className="w-6 h-6" />,
      label: '테이블',
      description: '데이터 테이블 및 목록'
    },
    {
      type: 'metric',
      icon: <TrendingUp className="w-6 h-6" />,
      label: '메트릭 카드',
      description: '주요 지표 및 KPI'
    },
    {
      type: 'text',
      icon: <Type className="w-6 h-6" />,
      label: '텍스트',
      description: '제목, 설명, 인사이트'
    }
  ];

  const chartTypes = [
    { value: 'bar', label: '막대 차트', icon: <BarChart3 className="w-5 h-5" /> },
    { value: 'line', label: '선 차트', icon: <LineChart className="w-5 h-5" /> },
    { value: 'pie', label: '파이 차트', icon: <PieChart className="w-5 h-5" /> }
  ];

  const dataSources = [
    { value: 'market', label: '시장 개요' },
    { value: 'service', label: '서비스 분석' },
    { value: 'industry', label: '산업 동향' },
    { value: 'pricing', label: '가격 정책' },
    { value: 'custom', label: '커스텀 데이터' }
  ];

  const handleAddWidget = (type: string) => {
    const newWidget: Widget = {
      id: Date.now().toString(),
      type: type as any,
      title: `새 ${widgetTypes.find(w => w.type === type)?.label}`,
      position: { x: 0, y: widgets.length * 2, w: 6, h: 4 },
      config: getDefaultConfig(type)
    };
    setWidgets([...widgets, newWidget]);
    setShowWidgetLibrary(false);
    success(`${widgetTypes.find(w => w.type === type)?.label}이(가) 추가되었습니다.`);
  };

  const getDefaultConfig = (type: string) => {
    switch (type) {
      case 'chart':
        return { chartType: 'bar', dataSource: 'market', xAxis: 'category', yAxis: 'value' };
      case 'table':
        return { dataSource: 'market', columns: ['name', 'value', 'change'], rowsPerPage: 10 };
      case 'metric':
        return { dataSource: 'market', metric: 'total', format: 'number', trend: true };
      case 'text':
        return { content: '여기에 텍스트를 입력하세요', fontSize: 'medium', align: 'left' };
      default:
        return {};
    }
  };

  const handleDeleteWidget = (id: string) => {
    setWidgets(widgets.filter(w => w.id !== id));
    if (selectedWidget === id) {
      setSelectedWidget(null);
    }
    success('위젯이 삭제되었습니다.');
  };

  const handleDuplicateWidget = (id: string) => {
    const widget = widgets.find(w => w.id === id);
    if (widget) {
      const newWidget: Widget = {
        ...widget,
        id: Date.now().toString(),
        title: `${widget.title} (복사본)`,
        position: { ...widget.position, y: widget.position.y + widget.position.h + 1 }
      };
      setWidgets([...widgets, newWidget]);
      success('위젯이 복제되었습니다.');
    }
  };

  const handleSaveReport = () => {
    // 실제 구현에서는 백엔드로 저장
    success(`"${reportName}" 리포트가 저장되었습니다.`);
  };

  const handleExportReport = () => {
    success('리포트를 PDF로 내보내는 중...');
  };

  const handleShareReport = () => {
    navigator.clipboard.writeText(window.location.href);
    success('공유 링크가 클립보드에 복사되었습니다.');
  };

  const loadTemplate = (template: Template) => {
    setReportName(template.name);
    setWidgets(template.widgets);
    setShowTemplates(false);
    success(`"${template.name}" 템플릿이 로드되었습니다.`);
  };

  const renderWidget = (widget: Widget) => {
    const isSelected = selectedWidget === widget.id;

    return (
      <div
        key={widget.id}
        onClick={() => setSelectedWidget(widget.id)}
        className={`bg-white dark:bg-gray-800 rounded-lg border-2 transition-all cursor-pointer ${
          isSelected
            ? 'border-purple-600 shadow-lg'
            : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
        }`}
        style={{
          gridColumn: `span ${widget.position.w}`,
          gridRow: `span ${widget.position.h}`
        }}
      >
        {!isPreview && (
          <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
              <input
                type="text"
                value={widget.title}
                onChange={(e) => {
                  setWidgets(widgets.map(w =>
                    w.id === widget.id ? { ...w, title: e.target.value } : w
                  ));
                }}
                className="font-medium text-sm text-gray-900 dark:text-white bg-transparent border-none outline-none"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDuplicateWidget(widget.id);
                }}
                className="p-1 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteWidget(widget.id);
                }}
                className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="p-4">
          {widget.type === 'chart' && (
            <div className="h-48 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded">
              {widget.config.chartType === 'bar' && <BarChart3 className="w-16 h-16 text-purple-400" />}
              {widget.config.chartType === 'line' && <LineChart className="w-16 h-16 text-purple-400" />}
              {widget.config.chartType === 'pie' && <PieChart className="w-16 h-16 text-purple-400" />}
              <div className="ml-4 text-gray-500 dark:text-gray-400">
                <p className="font-medium">{chartTypes.find(c => c.value === widget.config.chartType)?.label}</p>
                <p className="text-sm">데이터 소스: {dataSources.find(d => d.value === widget.config.dataSource)?.label}</p>
              </div>
            </div>
          )}

          {widget.type === 'table' && (
            <div className="border border-gray-200 dark:border-gray-600 rounded overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {widget.config.columns?.map((col: string, idx: number) => (
                      <th key={idx} className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {[1, 2, 3].map(row => (
                    <tr key={row}>
                      {widget.config.columns?.map((_: string, idx: number) => (
                        <td key={idx} className="px-3 py-2 text-gray-900 dark:text-white">
                          샘플 데이터
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {widget.type === 'metric' && (
            <div className="text-center py-8">
              <div className="text-4xl font-bold text-purple-600 mb-2">1,234</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {dataSources.find(d => d.value === widget.config.dataSource)?.label}
              </div>
              {widget.config.trend && (
                <div className="text-sm text-green-600 flex items-center justify-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +12.5%
                </div>
              )}
            </div>
          )}

          {widget.type === 'text' && (
            <div
              className={`text-gray-900 dark:text-white ${
                widget.config.fontSize === 'small' ? 'text-sm' :
                widget.config.fontSize === 'large' ? 'text-lg' : 'text-base'
              } ${
                widget.config.align === 'center' ? 'text-center' :
                widget.config.align === 'right' ? 'text-right' : 'text-left'
              }`}
            >
              {widget.config.content}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderWidgetConfig = () => {
    const widget = widgets.find(w => w.id === selectedWidget);
    if (!widget) return null;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          위젯 설정
        </h3>

        <div className="space-y-4">
          {widget.type === 'chart' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  차트 유형
                </label>
                <select
                  value={widget.config.chartType}
                  onChange={(e) => {
                    setWidgets(widgets.map(w =>
                      w.id === widget.id
                        ? { ...w, config: { ...w.config, chartType: e.target.value } }
                        : w
                    ));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {chartTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  데이터 소스
                </label>
                <select
                  value={widget.config.dataSource}
                  onChange={(e) => {
                    setWidgets(widgets.map(w =>
                      w.id === widget.id
                        ? { ...w, config: { ...w.config, dataSource: e.target.value } }
                        : w
                    ));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {dataSources.map(source => (
                    <option key={source.value} value={source.value}>{source.label}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {widget.type === 'table' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  데이터 소스
                </label>
                <select
                  value={widget.config.dataSource}
                  onChange={(e) => {
                    setWidgets(widgets.map(w =>
                      w.id === widget.id
                        ? { ...w, config: { ...w.config, dataSource: e.target.value } }
                        : w
                    ));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {dataSources.map(source => (
                    <option key={source.value} value={source.value}>{source.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  페이지당 행 수
                </label>
                <input
                  type="number"
                  value={widget.config.rowsPerPage}
                  onChange={(e) => {
                    setWidgets(widgets.map(w =>
                      w.id === widget.id
                        ? { ...w, config: { ...w.config, rowsPerPage: parseInt(e.target.value) } }
                        : w
                    ));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </>
          )}

          {widget.type === 'metric' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  데이터 소스
                </label>
                <select
                  value={widget.config.dataSource}
                  onChange={(e) => {
                    setWidgets(widgets.map(w =>
                      w.id === widget.id
                        ? { ...w, config: { ...w.config, dataSource: e.target.value } }
                        : w
                    ));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {dataSources.map(source => (
                    <option key={source.value} value={source.value}>{source.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={widget.config.trend}
                    onChange={(e) => {
                      setWidgets(widgets.map(w =>
                        w.id === widget.id
                          ? { ...w, config: { ...w.config, trend: e.target.checked } }
                          : w
                      ));
                    }}
                    className="rounded text-purple-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">트렌드 표시</span>
                </label>
              </div>
            </>
          )}

          {widget.type === 'text' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  내용
                </label>
                <textarea
                  value={widget.config.content}
                  onChange={(e) => {
                    setWidgets(widgets.map(w =>
                      w.id === widget.id
                        ? { ...w, config: { ...w.config, content: e.target.value } }
                        : w
                    ));
                  }}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  글꼴 크기
                </label>
                <select
                  value={widget.config.fontSize}
                  onChange={(e) => {
                    setWidgets(widgets.map(w =>
                      w.id === widget.id
                        ? { ...w, config: { ...w.config, fontSize: e.target.value } }
                        : w
                    ));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="small">작게</option>
                  <option value="medium">보통</option>
                  <option value="large">크게</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  정렬
                </label>
                <select
                  value={widget.config.align}
                  onChange={(e) => {
                    setWidgets(widgets.map(w =>
                      w.id === widget.id
                        ? { ...w, config: { ...w.config, align: e.target.value } }
                        : w
                    ));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="left">왼쪽</option>
                  <option value="center">가운데</option>
                  <option value="right">오른쪽</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const isPremiumUser = user?.subscriptionTier === 'professional' || user?.subscriptionTier === 'enterprise';

  if (!isPremiumUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <LayoutGrid className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            커스텀 리포트 빌더는 Premium 이상 플랜에서 사용 가능합니다
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            나만의 리포트를 만들고 싶으신가요? 프리미엄 또는 엔터프라이즈 플랜으로 업그레이드하세요.
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <LayoutGrid className="w-8 h-8 text-purple-600" />
              <input
                type="text"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                className="text-2xl font-bold text-gray-900 dark:text-white bg-transparent border-none outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTemplates(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <FolderOpen className="w-4 h-4" />
                템플릿
              </button>
              <button
                onClick={() => setIsPreview(!isPreview)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <Eye className="w-4 h-4" />
                {isPreview ? '편집' : '미리보기'}
              </button>
              <button
                onClick={handleShareReport}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <Share2 className="w-4 h-4" />
                공유
              </button>
              <button
                onClick={handleExportReport}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <Download className="w-4 h-4" />
                내보내기
              </button>
              <button
                onClick={handleSaveReport}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Save className="w-4 h-4" />
                저장
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Canvas */}
        <div className="flex-1 p-6 overflow-auto">
          {widgets.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <LayoutGrid className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  리포트 빌드를 시작하세요
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  위젯을 추가하여 나만의 커스텀 리포트를 만들어보세요
                </p>
                <button
                  onClick={() => setShowWidgetLibrary(true)}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  첫 위젯 추가
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-4 auto-rows-[100px]">
              {widgets.map(renderWidget)}

              {!isPreview && (
                <button
                  onClick={() => setShowWidgetLibrary(true)}
                  className="col-span-6 row-span-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:border-purple-400 hover:text-purple-600 transition-colors"
                >
                  <Plus className="w-8 h-8" />
                  <span className="font-medium">위젯 추가</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar - Widget Config */}
        {selectedWidget && !isPreview && (
          <div className="w-80 bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 p-4 overflow-auto">
            {renderWidgetConfig()}
          </div>
        )}
      </div>

      {/* Widget Library Modal */}
      {showWidgetLibrary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">위젯 라이브러리</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">추가할 위젯 유형을 선택하세요</p>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {widgetTypes.map(widget => (
                <button
                  key={widget.type}
                  onClick={() => handleAddWidget(widget.type)}
                  className="p-6 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900 transition-colors text-left"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg text-purple-600">
                      {widget.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{widget.label}</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{widget.description}</p>
                </button>
              ))}
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => setShowWidgetLibrary(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">리포트 템플릿</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">미리 만들어진 템플릿으로 빠르게 시작하세요</p>
            </div>
            <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
              {templates.map(template => (
                <div
                  key={template.id}
                  className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => loadTemplate(template)}
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{template.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    생성일: {template.createdAt.toLocaleDateString('ko-KR')}
                  </p>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => setShowTemplates(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomReportBuilder;
