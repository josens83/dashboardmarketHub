/**
 * Widget Library Modal
 * 위젯 타입 선택 라이브러리 모달
 */
import React from 'react';
import { WIDGET_TYPES } from './types';

interface WidgetLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWidget: (type: string) => void;
}

const WidgetLibraryModal: React.FC<WidgetLibraryModalProps> = ({
  isOpen,
  onClose,
  onAddWidget
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">위젯 라이브러리</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">추가할 위젯 유형을 선택하세요</p>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4">
          {WIDGET_TYPES.map(widget => (
            <button
              key={widget.type}
              onClick={() => onAddWidget(widget.type)}
              className="p-6 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-brand-600 hover:bg-brand-50 dark:hover:bg-purple-900 transition-colors text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-brand-100 dark:bg-purple-900 rounded-lg text-brand-600">
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
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default WidgetLibraryModal;
