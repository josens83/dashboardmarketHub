import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Globe, MapPin } from 'lucide-react';
import { marketGrowthData, marketCAGR } from '@/data/marketData';
import { DataExportButton } from '@/shared/components';

const MarketOverview: React.FC = () => {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-primary-600" />
          <h2 className="text-3xl font-bold">시장 개요</h2>
        </div>
        <DataExportButton dataType="market" label="시장 데이터 내보내기" />
      </div>

      {/* 주요 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold">글로벌 시장 (2024)</h3>
          </div>
          <p className="text-3xl font-bold text-primary-600">$31.99B</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            CAGR {marketCAGR.global}% (2024-2032)
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold">국내 시장 (2024)</h3>
          </div>
          <p className="text-3xl font-bold text-primary-600">3.1조원</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            CAGR {marketCAGR.domestic}% (2023-2027)
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold">예상 시장 (2032)</h3>
          </div>
          <p className="text-3xl font-bold text-primary-600">$63.0B</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            글로벌 시장 전망
          </p>
        </div>
      </div>

      {/* 시장 성장 추이 차트 */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">시장 규모 추이</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={marketGrowthData}>
            <CartesianGrid strokeDasharray="3 3" className="dark:stroke-gray-700" />
            <XAxis
              dataKey="year"
              className="dark:fill-gray-400"
            />
            <YAxis
              yAxisId="left"
              label={{ value: '글로벌 (십억 달러)', angle: -90, position: 'insideLeft' }}
              className="dark:fill-gray-400"
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: '국내 (조원)', angle: 90, position: 'insideRight' }}
              className="dark:fill-gray-400"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #ccc',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="global"
              stroke="#2563eb"
              strokeWidth={3}
              name="글로벌 시장"
              dot={{ fill: '#2563eb', r: 4 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="domestic"
              stroke="#10b981"
              strokeWidth={3}
              name="국내 시장"
              dot={{ fill: '#10b981', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 시장 인사이트 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-xl font-semibold mb-3">주요 성장 동인</h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-1">•</span>
              <span>클라우드 기반 BI 솔루션 채택 증가</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-1">•</span>
              <span>AI/ML 기술과 데이터 분석의 융합</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-1">•</span>
              <span>셀프 서비스 BI 수요 증대</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-1">•</span>
              <span>실시간 데이터 분석 필요성 증가</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-1">•</span>
              <span>모바일 BI 솔루션 확산</span>
            </li>
          </ul>
        </div>

        <div className="card">
          <h3 className="text-xl font-semibold mb-3">시장 트렌드</h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-1">•</span>
              <span>증강 분석(Augmented Analytics) 부상</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-1">•</span>
              <span>내장형(Embedded) BI 솔루션 성장</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-1">•</span>
              <span>데이터 민주화 및 거버넌스 강화</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-1">•</span>
              <span>자연어 처리(NLP) 기반 질의 증가</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-1">•</span>
              <span>구독 기반 가격 모델 선호</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default MarketOverview;
