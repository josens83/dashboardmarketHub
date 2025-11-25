/**
 * Widget Config Panel
 * 선택된 위젯 설정 사이드바
 */
import React from 'react';
import { Settings } from 'lucide-react';
import { Widget, CHART_TYPES, DATA_SOURCES } from './types';

interface WidgetConfigPanelProps {
  widget: Widget | null;
  onUpdateConfig: (widgetId: string, config: any) => void;
}

const WidgetConfigPanel: React.FC<WidgetConfigPanelProps> = ({
  widget,
  onUpdateConfig
}) => {
  if (!widget) return null;

  const updateConfig = (updates: Partial<typeof widget.config>) => {
    onUpdateConfig(widget.id, { ...widget.config, ...updates });
  };

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
                onChange={(e) => updateConfig({ chartType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {CHART_TYPES.map(type => (
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
                onChange={(e) => updateConfig({ dataSource: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {DATA_SOURCES.map(source => (
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
                onChange={(e) => updateConfig({ dataSource: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {DATA_SOURCES.map(source => (
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
                onChange={(e) => updateConfig({ rowsPerPage: parseInt(e.target.value) })}
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
                onChange={(e) => updateConfig({ dataSource: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {DATA_SOURCES.map(source => (
                  <option key={source.value} value={source.value}>{source.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={widget.config.trend}
                  onChange={(e) => updateConfig({ trend: e.target.checked })}
                  className="rounded text-brand-600"
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
                onChange={(e) => updateConfig({ content: e.target.value })}
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
                onChange={(e) => updateConfig({ fontSize: e.target.value })}
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
                onChange={(e) => updateConfig({ align: e.target.value })}
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

export default WidgetConfigPanel;
