import React, { useState } from 'react';
import { X, TrendingUp, DollarSign, Package, ArrowRight } from 'lucide-react';
import { serviceComparisons } from '@/data/marketData';
import { useUserData } from '@/shared/contexts/UserDataContext';

interface ComparisonToolProps {
  isOpen: boolean;
  onClose: () => void;
}

const ComparisonTool: React.FC<ComparisonToolProps> = ({ isOpen, onClose }) => {
  const { comparisonItems, addToComparison, removeFromComparison, clearComparison } = useUserData();
  const [availableServices] = useState(serviceComparisons);

  if (!isOpen) return null;

  const selectedServices = comparisonItems
    .filter(item => item.type === 'service')
    .map(item => item.data);

  const handleAddService = (service: any) => {
    if (selectedServices.length < 4 && !selectedServices.find(s => s.id === service.id)) {
      addToComparison({
        id: service.id,
        type: 'service',
        data: service,
        addedAt: new Date(),
      });
    }
  };

  const handleRemoveService = (serviceId: string) => {
    removeFromComparison(serviceId);
  };

  const comparisonMetrics = [
    { key: 'monthlyPrice', label: '월간 비용', format: (v: any) => v ? `$${v}` : 'N/A', icon: DollarSign },
    { key: 'annualPrice', label: '연간 비용', format: (v: any) => v ? `$${v}` : 'N/A', icon: DollarSign },
    { key: 'marketShare', label: '시장점유율', format: (v: any) => v ? `${v}%` : 'N/A', icon: TrendingUp },
    { key: 'pricingModel', label: '가격 모델', format: (v: any) => {
      const models = { subscription: '구독형', license: '라이선스형', project: '프로젝트형' };
      return models[v as keyof typeof models] || v;
    }, icon: Package },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-7xl w-full p-6 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">서비스 비교 도구</h2>
          <p className="text-gray-600 dark:text-gray-400">
            최대 4개의 서비스를 동시에 비교할 수 있습니다 ({selectedServices.length}/4)
          </p>
        </div>

        {/* 서비스 선택 */}
        {selectedServices.length < 4 && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-semibold mb-3">비교할 서비스 선택</h3>
            <div className="flex flex-wrap gap-2">
              {availableServices
                .filter(service => !selectedServices.find(s => s.id === service.id))
                .map(service => (
                  <button
                    key={service.id}
                    onClick={() => handleAddService(service)}
                    className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-sm"
                  >
                    {service.name}
                  </button>
                ))}
            </div>
          </div>
        )}

        {selectedServices.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              비교할 서비스를 선택해주세요
            </p>
          </div>
        ) : (
          <>
            {/* 비교 테이블 */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                    <th className="text-left p-4 font-semibold">항목</th>
                    {selectedServices.map(service => (
                      <th key={service.id} className="text-left p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold text-primary-600">{service.name}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">{service.vendor}</div>
                          </div>
                          <button
                            onClick={() => handleRemoveService(service.id)}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                          >
                            <X className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonMetrics.map((metric, idx) => {
                    const Icon = metric.icon;
                    return (
                      <tr key={metric.key} className={idx % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900/50' : ''}>
                        <td className="p-4 font-semibold flex items-center gap-2">
                          <Icon className="w-4 h-4 text-primary-600" />
                          {metric.label}
                        </td>
                        {selectedServices.map(service => (
                          <td key={service.id} className="p-4">
                            {metric.format((service as any)[metric.key])}
                          </td>
                        ))}
                      </tr>
                    );
                  })}

                  {/* 주요 기능 */}
                  <tr className="border-t-2 border-gray-300 dark:border-gray-600">
                    <td className="p-4 font-semibold">주요 기능</td>
                    {selectedServices.map(service => (
                      <td key={service.id} className="p-4">
                        <ul className="space-y-1">
                          {service.features.slice(0, 3).map((feature: string, idx: number) => (
                            <li key={idx} className="text-sm flex items-start gap-1">
                              <ArrowRight className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>

                  {/* 장점 */}
                  <tr className="bg-green-50 dark:bg-green-900/10">
                    <td className="p-4 font-semibold text-green-700 dark:text-green-400">장점</td>
                    {selectedServices.map(service => (
                      <td key={service.id} className="p-4">
                        <ul className="space-y-1">
                          {service.pros.map((pro: string, idx: number) => (
                            <li key={idx} className="text-sm flex items-start gap-1">
                              <span className="text-green-600">+</span>
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>

                  {/* 단점 */}
                  <tr className="bg-red-50 dark:bg-red-900/10">
                    <td className="p-4 font-semibold text-red-700 dark:text-red-400">단점</td>
                    {selectedServices.map(service => (
                      <td key={service.id} className="p-4">
                        <ul className="space-y-1">
                          {service.cons.map((con: string, idx: number) => (
                            <li key={idx} className="text-sm flex items-start gap-1">
                              <span className="text-red-600">-</span>
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 액션 버튼 */}
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={clearComparison}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                모두 지우기
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                완료
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ComparisonTool;
