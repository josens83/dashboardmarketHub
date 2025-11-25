/**
 * Custom Report Builder
 * 커스텀 리포트 빌더 - 메인 컨테이너
 */
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
  FolderOpen
} from 'lucide-react';
import { Widget, Template, WIDGET_TYPES, getDefaultConfig } from './components/types';
import WidgetLibraryModal from './components/WidgetLibraryModal';
import TemplateSelectorModal from './components/TemplateSelectorModal';
import WidgetCard from './components/WidgetCard';
import WidgetConfigPanel from './components/WidgetConfigPanel';

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

  const handleAddWidget = (type: string) => {
    const newWidget: Widget = {
      id: Date.now().toString(),
      type: type as any,
      title: `새 ${WIDGET_TYPES.find(w => w.type === type)?.label}`,
      position: { x: 0, y: widgets.length * 2, w: 6, h: 4 },
      config: getDefaultConfig(type)
    };
    setWidgets([...widgets, newWidget]);
    setShowWidgetLibrary(false);
    success(`${WIDGET_TYPES.find(w => w.type === type)?.label}이(가) 추가되었습니다.`);
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

  const handleUpdateWidgetTitle = (id: string, title: string) => {
    setWidgets(widgets.map(w =>
      w.id === id ? { ...w, title } : w
    ));
  };

  const handleUpdateWidgetConfig = (id: string, config: any) => {
    setWidgets(widgets.map(w =>
      w.id === id ? { ...w, config } : w
    ));
  };

  const handleSaveReport = () => {
    success(`"${reportName}" 리포트가 저장되었습니다.`);
  };

  const handleExportReport = () => {
    success('리포트를 PDF로 내보내는 중...');
  };

  const handleShareReport = () => {
    navigator.clipboard.writeText(window.location.href);
    success('공유 링크가 클립보드에 복사되었습니다.');
  };

  const handleSelectTemplate = (template: Template) => {
    setReportName(template.name);
    setWidgets(template.widgets);
    setShowTemplates(false);
    success(`"${template.name}" 템플릿이 로드되었습니다.`);
  };

  const isPremiumUser = user?.subscriptionTier === 'professional' || user?.subscriptionTier === 'enterprise';

  if (!isPremiumUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <LayoutGrid className="w-16 h-16 text-brand-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            커스텀 리포트 빌더는 Premium 이상 플랜에서 사용 가능합니다
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            나만의 리포트를 만들고 싶으신가요? 프리미엄 또는 엔터프라이즈 플랜으로 업그레이드하세요.
          </p>
          <button className="w-full bg-brand-600 text-white px-6 py-3 rounded-lg hover:bg-brand-700 font-medium">
            플랜 업그레이드
          </button>
        </div>
      </div>
    );
  }

  const selectedWidgetData = widgets.find(w => w.id === selectedWidget) || null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <LayoutGrid className="w-8 h-8 text-brand-600" />
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
                className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
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
                  className="bg-brand-600 text-white px-6 py-3 rounded-lg hover:bg-brand-700 inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  첫 위젯 추가
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-4 auto-rows-[100px]">
              {widgets.map(widget => (
                <WidgetCard
                  key={widget.id}
                  widget={widget}
                  isSelected={selectedWidget === widget.id}
                  isPreview={isPreview}
                  onSelect={() => setSelectedWidget(widget.id)}
                  onUpdateTitle={(title) => handleUpdateWidgetTitle(widget.id, title)}
                  onDuplicate={() => handleDuplicateWidget(widget.id)}
                  onDelete={() => handleDeleteWidget(widget.id)}
                />
              ))}

              {!isPreview && (
                <button
                  onClick={() => setShowWidgetLibrary(true)}
                  className="col-span-6 row-span-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:border-brand-400 hover:text-brand-600 transition-colors"
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
            <WidgetConfigPanel
              widget={selectedWidgetData}
              onUpdateConfig={handleUpdateWidgetConfig}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <WidgetLibraryModal
        isOpen={showWidgetLibrary}
        onClose={() => setShowWidgetLibrary(false)}
        onAddWidget={handleAddWidget}
      />

      <TemplateSelectorModal
        isOpen={showTemplates}
        onClose={() => setShowTemplates(false)}
        templates={templates}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
};

export default CustomReportBuilder;
