import React, { useState } from 'react';
import { FileDown, FileSpreadsheet, Lock } from 'lucide-react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { PricingModal } from '@/features/subscription';
import {
  exportToCSV,
  prepareMarketDataForExport,
  prepareServiceDataForExport,
  prepareIndustryDataForExport,
} from '@/shared/utils/dataExport';
import { marketGrowthData, serviceComparisons, industryDemands } from '@/data/marketData';

interface DataExportButtonProps {
  dataType: 'market' | 'services' | 'industry';
  label?: string;
  className?: string;
}

const DataExportButton: React.FC<DataExportButtonProps> = ({
  dataType,
  label = '데이터 내보내기',
  className = '',
}) => {
  const { canUseFeature } = useAuth();
  const [showPricing, setShowPricing] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const hasAccess = canUseFeature('data_export');

  const handleExport = () => {
    let data: any[] = [];
    let filename = '';

    switch (dataType) {
      case 'market':
        data = prepareMarketDataForExport(marketGrowthData);
        filename = `market-growth-${new Date().toISOString().split('T')[0]}.csv`;
        break;
      case 'services':
        data = prepareServiceDataForExport(serviceComparisons);
        filename = `service-comparison-${new Date().toISOString().split('T')[0]}.csv`;
        break;
      case 'industry':
        data = prepareIndustryDataForExport(industryDemands);
        filename = `industry-analysis-${new Date().toISOString().split('T')[0]}.csv`;
        break;
    }

    exportToCSV(data, filename);
    setShowOptions(false);
  };

  if (!hasAccess) {
    return (
      <>
        <button
          onClick={() => setShowPricing(true)}
          className={`inline-flex items-center gap-2 px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg cursor-not-allowed ${className}`}
          title="프리미엄 기능"
        >
          <Lock className="w-4 h-4" />
          <span>{label}</span>
        </button>
        <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
      </>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowOptions(!showOptions)}
        className={`inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors ${className}`}
      >
        <FileDown className="w-4 h-4" />
        <span>{label}</span>
      </button>

      {showOptions && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
          <button
            onClick={handleExport}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-green-600" />
            <span>CSV로 내보내기</span>
          </button>
          <button
            onClick={handleExport}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            <span>Excel로 내보내기</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DataExportButton;
