// Excel/CSV 데이터 내보내기 유틸리티

export const exportToCSV = (data: any[], filename: string = 'data.csv') => {
  // 데이터가 없으면 중단
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  // CSV 헤더 생성
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // 쉼표나 따옴표가 포함된 값은 따옴표로 감싸기
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  // BOM 추가 (Excel에서 한글 깨짐 방지)
  const bom = '\uFEFF';
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });

  // 다운로드 트리거
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToExcel = (data: any[], filename: string = 'data.xlsx') => {
  // 간단한 Excel 형식으로 내보내기 (실제로는 xlsx 라이브러리 사용 권장)
  // 여기서는 CSV를 .xlsx 확장자로 저장
  exportToCSV(data, filename.replace('.xlsx', '.csv'));
};

export const prepareMarketDataForExport = (marketData: any[]) => {
  return marketData.map(item => ({
    '연도': item.year,
    '글로벌 시장 (십억 달러)': item.global,
    '국내 시장 (조원)': item.domestic,
  }));
};

export const prepareServiceDataForExport = (services: any[]) => {
  return services.map(service => ({
    '서비스명': service.name,
    '제공사': service.vendor,
    '가격 모델': service.pricingModel === 'subscription' ? '구독형' :
                  service.pricingModel === 'license' ? '라이선스형' : '프로젝트형',
    '월간 비용 ($)': service.monthlyPrice || 'N/A',
    '연간 비용 ($)': service.annualPrice || 'N/A',
    '시장 점유율 (%)': service.marketShare || 'N/A',
  }));
};

export const prepareIndustryDataForExport = (industries: any[]) => {
  return industries.map(industry => ({
    '산업': industry.industry,
    '도입률 (%)': industry.adoptionRate,
    '평균 ROI (%)': industry.averageROI,
    '구축 기간 (개월)': industry.implementationTime,
    '주요 KPI': industry.primaryKPIs.join(', '),
  }));
};
