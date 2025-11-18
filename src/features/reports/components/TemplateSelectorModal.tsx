/**
 * Template Selector Modal
 * 리포트 템플릿 선택 모달
 */
import React from 'react';
import { Template } from './types';

interface TemplateSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: Template[];
  onSelectTemplate: (template: Template) => void;
}

const TemplateSelectorModal: React.FC<TemplateSelectorModalProps> = ({
  isOpen,
  onClose,
  templates,
  onSelectTemplate
}) => {
  if (!isOpen) return null;

  return (
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
              onClick={() => onSelectTemplate(template)}
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

export default TemplateSelectorModal;
