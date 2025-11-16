import React, { useState } from 'react';
import { Search, Filter, CheckCircle2, GitCompare } from 'lucide-react';
import { serviceComparisons } from '../data/marketData';
import DataExportButton from './DataExportButton';
import ComparisonTool from './ComparisonTool';

const ServiceComparison: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPricing, setSelectedPricing] = useState<string>('all');
  const [showComparison, setShowComparison] = useState(false);

  const filteredServices = serviceComparisons.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPricing =
      selectedPricing === 'all' || service.pricingModel === selectedPricing;
    return matchesSearch && matchesPricing;
  });

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Filter className="w-8 h-8 text-primary-600" />
          <h2 className="text-3xl font-bold">주요 서비스 비교</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowComparison(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <GitCompare className="w-4 h-4" />
            <span className="hidden md:inline">비교 도구</span>
          </button>
          <DataExportButton dataType="services" label="데이터 내보내기" />
        </div>
      </div>

      <ComparisonTool isOpen={showComparison} onClose={() => setShowComparison(false)} />

      {/* 필터 및 검색 */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="서비스명 또는 제공사 검색..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <select
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={selectedPricing}
              onChange={(e) => setSelectedPricing(e.target.value)}
            >
              <option value="all">모든 가격 모델</option>
              <option value="subscription">구독형</option>
              <option value="license">라이선스형</option>
              <option value="project">프로젝트형</option>
            </select>
          </div>
        </div>
      </div>

      {/* 서비스 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div key={service.id} className="card hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-primary-600">{service.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{service.vendor}</p>
              </div>
              {service.marketShare && (
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-600">{service.marketShare}%</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">시장점유율</p>
                </div>
              )}
            </div>

            {/* 가격 정보 */}
            {service.monthlyPrice && (
              <div className="mb-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">{service.userTier}</p>
                <p className="text-2xl font-bold text-primary-700 dark:text-primary-400">
                  ${service.monthlyPrice}/월
                </p>
                {service.annualPrice && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    연간 ${service.annualPrice}
                  </p>
                )}
              </div>
            )}

            {service.pricingModel === 'project' && (
              <div className="mb-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <p className="text-sm font-semibold text-primary-700 dark:text-primary-400">
                  프로젝트 기반 가격
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  견적 문의 필요
                </p>
              </div>
            )}

            {/* 주요 기능 */}
            <div className="mb-4">
              <h4 className="font-semibold mb-2 text-sm">주요 기능</h4>
              <ul className="space-y-1">
                {service.features.slice(0, 3).map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 장단점 */}
            <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div>
                <h4 className="font-semibold mb-1 text-sm text-green-600 dark:text-green-400">장점</h4>
                <ul className="space-y-1">
                  {service.pros.slice(0, 2).map((pro, idx) => (
                    <li key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1">
                      <span className="text-green-500">+</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-1 text-sm text-red-600 dark:text-red-400">단점</h4>
                <ul className="space-y-1">
                  {service.cons.slice(0, 2).map((con, idx) => (
                    <li key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1">
                      <span className="text-red-500">-</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">검색 결과가 없습니다.</p>
        </div>
      )}
    </section>
  );
};

export default ServiceComparison;
