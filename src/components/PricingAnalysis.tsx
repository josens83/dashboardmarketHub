import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DollarSign, Calculator } from 'lucide-react';
import { pricingComparison } from '../data/marketData';

const PricingAnalysis: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<'small' | 'medium' | 'large'>('medium');
  const [customUsers, setCustomUsers] = useState(50);
  const [selectedService, setSelectedService] = useState('powerbi');

  // 차트 데이터 준비
  const chartData = [
    {
      name: 'Tableau',
      cost: pricingComparison.calculations.tableau[selectedTier],
    },
    {
      name: 'Power BI',
      cost: pricingComparison.calculations.powerbi[selectedTier],
    },
    {
      name: 'Qlik Sense',
      cost: pricingComparison.calculations.qlik[selectedTier],
    },
    {
      name: 'Looker',
      cost: pricingComparison.calculations.looker[selectedTier],
    },
    {
      name: 'Domo',
      cost: pricingComparison.calculations.domo[selectedTier],
    },
  ];

  // ROI 계산기
  const calculateROI = () => {
    const servicePrices: { [key: string]: number } = {
      tableau: 70,
      powerbi: 14,
      qlik: 30,
      looker: 50,
      domo: 83,
    };

    const annualCost = servicePrices[selectedService] * customUsers * 12;
    const timesSaved = 100; // 월간 절약 시간 (시간)
    const hourlyRate = 50; // 시간당 인건비 (달러)
    const efficiencyGain = timesSaved * hourlyRate * 12; // 연간 효율성 증가

    const roi = ((efficiencyGain - annualCost) / annualCost) * 100;

    return {
      annualCost,
      efficiencyGain,
      roi,
      paybackMonths: annualCost / (efficiencyGain / 12),
    };
  };

  const roiData = calculateROI();

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <DollarSign className="w-8 h-8 text-primary-600" />
        <h2 className="text-3xl font-bold">가격 분석</h2>
      </div>

      {/* 가격 비교 선택 */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">사용자 규모별 연간 비용 비교</h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(pricingComparison.tiers).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setSelectedTier(key as 'small' | 'medium' | 'large')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedTier === key
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {value.label}
            </button>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="dark:stroke-gray-700" />
            <XAxis dataKey="name" className="dark:fill-gray-400" />
            <YAxis
              label={{ value: '연간 비용 ($)', angle: -90, position: 'insideLeft' }}
              className="dark:fill-gray-400"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #ccc',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, '연간 비용']}
            />
            <Bar dataKey="cost" fill="#2563eb" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ROI 계산기 */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-6 h-6 text-primary-600" />
          <h3 className="text-xl font-semibold">ROI 계산기</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold mb-2">서비스 선택</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
            >
              <option value="tableau">Tableau</option>
              <option value="powerbi">Power BI</option>
              <option value="qlik">Qlik Sense</option>
              <option value="looker">Looker</option>
              <option value="domo">Domo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              사용자 수: {customUsers}명
            </label>
            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={customUsers}
              onChange={(e) => setCustomUsers(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* ROI 결과 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">연간 비용</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ${roiData.annualCost.toLocaleString()}
            </p>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">연간 효율성 증가</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              ${roiData.efficiencyGain.toLocaleString()}
            </p>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">ROI</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {roiData.roi.toFixed(0)}%
            </p>
          </div>

          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">회수 기간</p>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {roiData.paybackMonths.toFixed(1)}개월
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>계산 가정:</strong> 월간 100시간 절약, 시간당 인건비 $50 기준
          </p>
        </div>
      </div>

      {/* 가격 모델 비교 */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">가격 모델 비교</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4">서비스</th>
                <th className="text-left py-3 px-4">가격 모델</th>
                <th className="text-right py-3 px-4">월간 비용</th>
                <th className="text-right py-3 px-4">연간 비용</th>
                <th className="text-left py-3 px-4">특징</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-3 px-4 font-semibold">Tableau</td>
                <td className="py-3 px-4">구독형</td>
                <td className="py-3 px-4 text-right">$70</td>
                <td className="py-3 px-4 text-right">$840</td>
                <td className="py-3 px-4 text-xs">Creator, Explorer, Viewer 등급</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-3 px-4 font-semibold">Power BI</td>
                <td className="py-3 px-4">구독형</td>
                <td className="py-3 px-4 text-right">$14</td>
                <td className="py-3 px-4 text-right">$168</td>
                <td className="py-3 px-4 text-xs">Pro, Premium 등급</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-3 px-4 font-semibold">Qlik Sense</td>
                <td className="py-3 px-4">구독형</td>
                <td className="py-3 px-4 text-right">$30</td>
                <td className="py-3 px-4 text-right">$360</td>
                <td className="py-3 px-4 text-xs">Professional, Enterprise 등급</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-3 px-4 font-semibold">Looker</td>
                <td className="py-3 px-4">구독형</td>
                <td className="py-3 px-4 text-right">$50</td>
                <td className="py-3 px-4 text-right">$600</td>
                <td className="py-3 px-4 text-xs">Standard, Enterprise 등급</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">Domo</td>
                <td className="py-3 px-4">구독형</td>
                <td className="py-3 px-4 text-right">$83</td>
                <td className="py-3 px-4 text-right">$996</td>
                <td className="py-3 px-4 text-xs">Standard, Enterprise 등급</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default PricingAnalysis;
