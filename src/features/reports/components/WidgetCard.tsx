/**
 * Widget Card
 * 개별 위젯 렌더링 및 편집
 */
import React from 'react';
import {
  GripVertical,
  Copy,
  Trash2,
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp
} from 'lucide-react';
import { Widget, CHART_TYPES, DATA_SOURCES } from './types';

interface WidgetCardProps {
  widget: Widget;
  isSelected: boolean;
  isPreview: boolean;
  onSelect: () => void;
  onUpdateTitle: (title: string) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const WidgetCard: React.FC<WidgetCardProps> = ({
  widget,
  isSelected,
  isPreview,
  onSelect,
  onUpdateTitle,
  onDuplicate,
  onDelete
}) => {
  return (
    <div
      onClick={onSelect}
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
              onChange={(e) => onUpdateTitle(e.target.value)}
              className="font-medium text-sm text-gray-900 dark:text-white bg-transparent border-none outline-none"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate();
              }}
              className="p-1 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
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
              <p className="font-medium">{CHART_TYPES.find(c => c.value === widget.config.chartType)?.label}</p>
              <p className="text-sm">데이터 소스: {DATA_SOURCES.find(d => d.value === widget.config.dataSource)?.label}</p>
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
              {DATA_SOURCES.find(d => d.value === widget.config.dataSource)?.label}
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

export default WidgetCard;
