import React, { useState } from 'react';
import {
  Filter,
  Plus,
  X,
  Save,
  FolderOpen,
  RefreshCw,
  Check
} from 'lucide-react';

export interface FilterCondition {
  id: string;
  field: string;
  operator: string;
  value: any;
  type: 'text' | 'number' | 'date' | 'select';
}

export interface FilterGroup {
  id: string;
  logic: 'AND' | 'OR';
  conditions: FilterCondition[];
}

export interface FilterPreset {
  id: string;
  name: string;
  filters: FilterGroup[];
}

interface AdvancedFiltersProps {
  fields: {
    name: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'select';
    options?: { value: string; label: string }[];
  }[];
  onApply: (filters: FilterGroup[]) => void;
  onReset: () => void;
  presets?: FilterPreset[];
  onSavePreset?: (name: string, filters: FilterGroup[]) => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  fields,
  onApply,
  onReset,
  presets = [],
  onSavePreset
}) => {
  const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([
    {
      id: '1',
      logic: 'AND',
      conditions: []
    }
  ]);
  const [showPresets, setShowPresets] = useState(false);
  const [showSavePreset, setShowSavePreset] = useState(false);
  const [presetName, setPresetName] = useState('');

  const getOperatorsByType = (type: string) => {
    switch (type) {
      case 'text':
        return [
          { value: 'contains', label: '포함' },
          { value: 'equals', label: '같음' },
          { value: 'not_equals', label: '같지 않음' },
          { value: 'starts_with', label: '시작' },
          { value: 'ends_with', label: '끝' }
        ];
      case 'number':
        return [
          { value: 'equals', label: '같음' },
          { value: 'not_equals', label: '같지 않음' },
          { value: 'greater_than', label: '보다 큼' },
          { value: 'less_than', label: '보다 작음' },
          { value: 'greater_or_equal', label: '이상' },
          { value: 'less_or_equal', label: '이하' }
        ];
      case 'date':
        return [
          { value: 'equals', label: '같음' },
          { value: 'before', label: '이전' },
          { value: 'after', label: '이후' },
          { value: 'between', label: '사이' }
        ];
      case 'select':
        return [
          { value: 'equals', label: '같음' },
          { value: 'not_equals', label: '같지 않음' },
          { value: 'in', label: '포함됨' }
        ];
      default:
        return [];
    }
  };

  const addFilterGroup = () => {
    const newGroup: FilterGroup = {
      id: Date.now().toString(),
      logic: 'AND',
      conditions: []
    };
    setFilterGroups([...filterGroups, newGroup]);
  };

  const removeFilterGroup = (groupId: string) => {
    setFilterGroups(filterGroups.filter(g => g.id !== groupId));
  };

  const addCondition = (groupId: string) => {
    const newCondition: FilterCondition = {
      id: Date.now().toString(),
      field: fields[0]?.name || '',
      operator: getOperatorsByType(fields[0]?.type || 'text')[0]?.value || '',
      value: '',
      type: fields[0]?.type || 'text'
    };

    setFilterGroups(filterGroups.map(group =>
      group.id === groupId
        ? { ...group, conditions: [...group.conditions, newCondition] }
        : group
    ));
  };

  const removeCondition = (groupId: string, conditionId: string) => {
    setFilterGroups(filterGroups.map(group =>
      group.id === groupId
        ? { ...group, conditions: group.conditions.filter(c => c.id !== conditionId) }
        : group
    ));
  };

  const updateCondition = (groupId: string, conditionId: string, updates: Partial<FilterCondition>) => {
    setFilterGroups(filterGroups.map(group =>
      group.id === groupId
        ? {
            ...group,
            conditions: group.conditions.map(condition =>
              condition.id === conditionId
                ? { ...condition, ...updates }
                : condition
            )
          }
        : group
    ));
  };

  const updateGroupLogic = (groupId: string, logic: 'AND' | 'OR') => {
    setFilterGroups(filterGroups.map(group =>
      group.id === groupId ? { ...group, logic } : group
    ));
  };

  const handleApply = () => {
    onApply(filterGroups);
  };

  const handleReset = () => {
    setFilterGroups([
      {
        id: '1',
        logic: 'AND',
        conditions: []
      }
    ]);
    onReset();
  };

  const loadPreset = (preset: FilterPreset) => {
    setFilterGroups(preset.filters);
    setShowPresets(false);
  };

  const handleSavePreset = () => {
    if (presetName && onSavePreset) {
      onSavePreset(presetName, filterGroups);
      setPresetName('');
      setShowSavePreset(false);
    }
  };

  const renderConditionValue = (groupId: string, condition: FilterCondition) => {
    const field = fields.find(f => f.name === condition.field);

    switch (condition.type) {
      case 'text':
        return (
          <input
            type="text"
            value={condition.value}
            onChange={(e) => updateCondition(groupId, condition.id, { value: e.target.value })}
            placeholder="값 입력..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          />
        );
      case 'number':
        return (
          <input
            type="number"
            value={condition.value}
            onChange={(e) => updateCondition(groupId, condition.id, { value: e.target.value })}
            placeholder="숫자 입력..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          />
        );
      case 'date':
        return (
          <input
            type="date"
            value={condition.value}
            onChange={(e) => updateCondition(groupId, condition.id, { value: e.target.value })}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          />
        );
      case 'select':
        return (
          <select
            value={condition.value}
            onChange={(e) => updateCondition(groupId, condition.id, { value: e.target.value })}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="">선택...</option>
            {field?.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-brand-600" />
          <h3 className="font-semibold text-gray-900 dark:text-white">고급 필터</h3>
        </div>
        <div className="flex items-center gap-2">
          {presets.length > 0 && (
            <button
              onClick={() => setShowPresets(!showPresets)}
              className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2"
            >
              <FolderOpen className="w-4 h-4" />
              프리셋
            </button>
          )}
          {onSavePreset && (
            <button
              onClick={() => setShowSavePreset(true)}
              className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              저장
            </button>
          )}
          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            초기화
          </button>
        </div>
      </div>

      {/* Preset Dropdown */}
      {showPresets && presets.length > 0 && (
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="space-y-2">
            {presets.map(preset => (
              <button
                key={preset.id}
                onClick={() => loadPreset(preset)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filter Groups */}
      <div className="p-4 space-y-4">
        {filterGroups.map((group, groupIndex) => (
          <div key={group.id} className="space-y-3">
            {/* Group Logic Selector */}
            {groupIndex > 0 && (
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                <select
                  value={group.logic}
                  onChange={(e) => updateGroupLogic(group.id, e.target.value as 'AND' | 'OR')}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium"
                >
                  <option value="AND">그리고 (AND)</option>
                  <option value="OR">또는 (OR)</option>
                </select>
                <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
              </div>
            )}

            {/* Filter Group Container */}
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              {/* Conditions */}
              {group.conditions.length > 0 && (
                <div className="space-y-2 mb-3">
                  {group.conditions.map((condition, conditionIndex) => (
                    <div key={condition.id}>
                      {conditionIndex > 0 && (
                        <div className="flex items-center gap-2 my-2">
                          <div className="text-xs font-medium text-gray-600 dark:text-gray-400 px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                            {group.logic}
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        {/* Field Selector */}
                        <select
                          value={condition.field}
                          onChange={(e) => {
                            const field = fields.find(f => f.name === e.target.value);
                            if (field) {
                              updateCondition(group.id, condition.id, {
                                field: e.target.value,
                                type: field.type,
                                operator: getOperatorsByType(field.type)[0]?.value || '',
                                value: ''
                              });
                            }
                          }}
                          className="w-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        >
                          {fields.map(field => (
                            <option key={field.name} value={field.name}>
                              {field.label}
                            </option>
                          ))}
                        </select>

                        {/* Operator Selector */}
                        <select
                          value={condition.operator}
                          onChange={(e) => updateCondition(group.id, condition.id, { operator: e.target.value })}
                          className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        >
                          {getOperatorsByType(condition.type).map(op => (
                            <option key={op.value} value={op.value}>
                              {op.label}
                            </option>
                          ))}
                        </select>

                        {/* Value Input */}
                        {renderConditionValue(group.id, condition)}

                        {/* Remove Condition Button */}
                        <button
                          onClick={() => removeCondition(group.id, condition.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Condition Button */}
              <button
                onClick={() => addCondition(group.id)}
                className="w-full px-3 py-2 text-sm text-brand-600 hover:bg-brand-50 dark:hover:bg-purple-900 rounded-lg border-2 border-dashed border-brand-300 dark:border-brand-700 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                조건 추가
              </button>

              {/* Remove Group Button */}
              {filterGroups.length > 1 && (
                <button
                  onClick={() => removeFilterGroup(group.id)}
                  className="mt-2 w-full px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg flex items-center justify-center gap-1"
                >
                  <X className="w-3 h-3" />
                  그룹 삭제
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Add Group Button */}
        <button
          onClick={addFilterGroup}
          className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          필터 그룹 추가
        </button>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleReset}
          className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          취소
        </button>
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          필터 적용
        </button>
      </div>

      {/* Save Preset Modal */}
      {showSavePreset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">필터 프리셋 저장</h3>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                프리셋 이름
              </label>
              <input
                type="text"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="예: 활성 사용자 필터"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                autoFocus
              />
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setShowSavePreset(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                취소
              </button>
              <button
                onClick={handleSavePreset}
                disabled={!presetName}
                className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;
