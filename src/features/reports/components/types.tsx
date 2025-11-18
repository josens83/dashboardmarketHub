/**
 * Report Builder Types & Constants
 */
import React from 'react';
import { BarChart3, PieChart, LineChart, Table, Type, TrendingUp } from 'lucide-react';

export interface Widget {
  id: string;
  type: 'chart' | 'table' | 'metric' | 'text';
  title: string;
  position: { x: number; y: number; w: number; h: number };
  config: any;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  widgets: Widget[];
  createdAt: Date;
}

export interface WidgetType {
  type: string;
  icon: React.ReactNode;
  label: string;
  description: string;
}

export interface ChartType {
  value: string;
  label: string;
  icon: React.ReactNode;
}

export interface DataSource {
  value: string;
  label: string;
}

export const WIDGET_TYPES: WidgetType[] = [
  {
    type: 'chart',
    icon: <BarChart3 className="w-6 h-6" />,
    label: '차트',
    description: '막대, 선, 파이 차트 등'
  },
  {
    type: 'table',
    icon: <Table className="w-6 h-6" />,
    label: '테이블',
    description: '데이터 테이블 및 목록'
  },
  {
    type: 'metric',
    icon: <TrendingUp className="w-6 h-6" />,
    label: '메트릭 카드',
    description: '주요 지표 및 KPI'
  },
  {
    type: 'text',
    icon: <Type className="w-6 h-6" />,
    label: '텍스트',
    description: '제목, 설명, 인사이트'
  }
];

export const CHART_TYPES: ChartType[] = [
  { value: 'bar', label: '막대 차트', icon: <BarChart3 className="w-5 h-5" /> },
  { value: 'line', label: '선 차트', icon: <LineChart className="w-5 h-5" /> },
  { value: 'pie', label: '파이 차트', icon: <PieChart className="w-5 h-5" /> }
];

export const DATA_SOURCES: DataSource[] = [
  { value: 'market', label: '시장 개요' },
  { value: 'service', label: '서비스 분석' },
  { value: 'industry', label: '산업 동향' },
  { value: 'pricing', label: '가격 정책' },
  { value: 'custom', label: '커스텀 데이터' }
];

export const getDefaultConfig = (type: string) => {
  switch (type) {
    case 'chart':
      return { chartType: 'bar', dataSource: 'market', xAxis: 'category', yAxis: 'value' };
    case 'table':
      return { dataSource: 'market', columns: ['name', 'value', 'change'], rowsPerPage: 10 };
    case 'metric':
      return { dataSource: 'market', metric: 'total', format: 'number', trend: true };
    case 'text':
      return { content: '여기에 텍스트를 입력하세요', fontSize: 'medium', align: 'left' };
    default:
      return {};
  }
};
