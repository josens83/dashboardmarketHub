/**
 * Data Export Utilities Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  exportToCSV,
  exportToExcel,
  prepareMarketDataForExport,
  prepareServiceDataForExport,
  prepareIndustryDataForExport,
} from '../dataExport';

describe('exportToCSV', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock DOM APIs
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();

    // Mock document methods
    const mockLink = {
      setAttribute: vi.fn(),
      click: vi.fn(),
      style: { visibility: '' },
    };
    vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as any);
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as any);
  });

  it('should export data to CSV', () => {
    const data = [
      { name: 'John', age: 30, city: 'Seoul' },
      { name: 'Jane', age: 25, city: 'Busan' },
    ];

    exportToCSV(data, 'test.csv');

    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });

  it('should handle data with commas in values', () => {
    const data = [
      { name: 'John, Doe', value: '1,000' },
    ];

    exportToCSV(data, 'test.csv');

    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });

  it('should handle data with quotes in values', () => {
    const data = [
      { name: 'John "Johnny" Doe', value: 'test' },
    ];

    exportToCSV(data, 'test.csv');

    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });

  it('should not export when data is empty', () => {
    exportToCSV([], 'test.csv');

    expect(console.error).toHaveBeenCalledWith('No data to export');
    expect(document.createElement).not.toHaveBeenCalled();
  });

  it('should not export when data is null', () => {
    exportToCSV(null as any, 'test.csv');

    expect(console.error).toHaveBeenCalledWith('No data to export');
    expect(document.createElement).not.toHaveBeenCalled();
  });

  it('should use default filename if not provided', () => {
    const data = [{ name: 'Test' }];

    exportToCSV(data);

    const mockLink = document.createElement('a');
    expect(mockLink.setAttribute).toHaveBeenCalledWith('download', 'data.csv');
  });
});

describe('exportToExcel', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');

    const mockLink = {
      setAttribute: vi.fn(),
      click: vi.fn(),
      style: { visibility: '' },
    };
    vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as any);
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as any);
  });

  it('should export to Excel by calling CSV export', () => {
    const data = [{ name: 'Test', value: 123 }];

    exportToExcel(data, 'test.xlsx');

    // Should convert .xlsx to .csv
    expect(document.createElement).toHaveBeenCalled();
  });
});

describe('prepareMarketDataForExport', () => {
  it('should prepare market data for export', () => {
    const marketData = [
      { year: 2023, global: 150, domestic: 20 },
      { year: 2024, global: 175, domestic: 25 },
    ];

    const result = prepareMarketDataForExport(marketData);

    expect(result).toEqual([
      { '연도': 2023, '글로벌 시장 (십억 달러)': 150, '국내 시장 (조원)': 20 },
      { '연도': 2024, '글로벌 시장 (십억 달러)': 175, '국내 시장 (조원)': 25 },
    ]);
  });

  it('should handle empty market data', () => {
    const result = prepareMarketDataForExport([]);
    expect(result).toEqual([]);
  });
});

describe('prepareServiceDataForExport', () => {
  it('should prepare service data with subscription model', () => {
    const services = [
      {
        name: 'Service A',
        vendor: 'Vendor 1',
        pricingModel: 'subscription',
        monthlyPrice: 100,
        annualPrice: 1000,
        marketShare: 25,
      },
    ];

    const result = prepareServiceDataForExport(services);

    expect(result).toEqual([
      {
        '서비스명': 'Service A',
        '제공사': 'Vendor 1',
        '가격 모델': '구독형',
        '월간 비용 ($)': 100,
        '연간 비용 ($)': 1000,
        '시장 점유율 (%)': 25,
      },
    ]);
  });

  it('should prepare service data with license model', () => {
    const services = [
      {
        name: 'Service B',
        vendor: 'Vendor 2',
        pricingModel: 'license',
        monthlyPrice: null,
        annualPrice: 5000,
        marketShare: null,
      },
    ];

    const result = prepareServiceDataForExport(services);

    expect(result[0]['가격 모델']).toBe('라이선스형');
    expect(result[0]['월간 비용 ($)']).toBe('N/A');
    expect(result[0]['시장 점유율 (%)']).toBe('N/A');
  });

  it('should prepare service data with project model', () => {
    const services = [
      {
        name: 'Service C',
        vendor: 'Vendor 3',
        pricingModel: 'project',
      },
    ];

    const result = prepareServiceDataForExport(services);

    expect(result[0]['가격 모델']).toBe('프로젝트형');
  });

  it('should handle empty services data', () => {
    const result = prepareServiceDataForExport([]);
    expect(result).toEqual([]);
  });
});

describe('prepareIndustryDataForExport', () => {
  it('should prepare industry data for export', () => {
    const industries = [
      {
        industry: 'Healthcare',
        adoptionRate: 75,
        averageROI: 150,
        implementationTime: 6,
        primaryKPIs: ['Patient Satisfaction', 'Cost Reduction', 'Efficiency'],
      },
      {
        industry: 'Finance',
        adoptionRate: 85,
        averageROI: 200,
        implementationTime: 4,
        primaryKPIs: ['Revenue Growth', 'Risk Management'],
      },
    ];

    const result = prepareIndustryDataForExport(industries);

    expect(result).toEqual([
      {
        '산업': 'Healthcare',
        '도입률 (%)': 75,
        '평균 ROI (%)': 150,
        '구축 기간 (개월)': 6,
        '주요 KPI': 'Patient Satisfaction, Cost Reduction, Efficiency',
      },
      {
        '산업': 'Finance',
        '도입률 (%)': 85,
        '평균 ROI (%)': 200,
        '구축 기간 (개월)': 4,
        '주요 KPI': 'Revenue Growth, Risk Management',
      },
    ]);
  });

  it('should handle empty industry data', () => {
    const result = prepareIndustryDataForExport([]);
    expect(result).toEqual([]);
  });

  it('should handle industry with no KPIs', () => {
    const industries = [
      {
        industry: 'Tech',
        adoptionRate: 90,
        averageROI: 180,
        implementationTime: 3,
        primaryKPIs: [],
      },
    ];

    const result = prepareIndustryDataForExport(industries);

    expect(result[0]['주요 KPI']).toBe('');
  });
});
