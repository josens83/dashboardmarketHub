import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { Building2, TrendingUp, Clock, Award } from 'lucide-react';
import { industryDemands } from '../data/marketData';

const IndustryAnalysis: React.FC = () => {
  const [selectedIndustry, setSelectedIndustry] = useState(0);

  const adoptionData = industryDemands.map((industry) => ({
    name: industry.industry,
    rate: industry.adoptionRate,
    roi: industry.averageROI,
  }));

  const currentIndustry = industryDemands[selectedIndustry];

  // KPI 중요도를 위한 레이더 차트 데이터 (예시)
  const kpiImportanceData = currentIndustry.primaryKPIs.slice(0, 5).map((kpi, idx) => ({
    kpi,
    importance: 100 - idx * 15,
  }));

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Building2 className="w-8 h-8 text-primary-600" />
        <h2 className="text-3xl font-bold">산업별 수요 분석</h2>
      </div>

      {/* 산업별 도입률 차트 */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">산업별 BI 도입률 및 평균 ROI</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={adoptionData}>
            <CartesianGrid strokeDasharray="3 3" className="dark:stroke-gray-700" />
            <XAxis dataKey="name" className="dark:fill-gray-400" />
            <YAxis
              yAxisId="left"
              label={{ value: '도입률 (%)', angle: -90, position: 'insideLeft' }}
              className="dark:fill-gray-400"
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: '평균 ROI (%)', angle: 90, position: 'insideRight' }}
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
            <Bar yAxisId="left" dataKey="rate" fill="#2563eb" name="도입률 (%)" radius={[8, 8, 0, 0]} />
            <Bar yAxisId="right" dataKey="roi" fill="#10b981" name="평균 ROI (%)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 산업 선택 */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">산업별 상세 분석</h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {industryDemands.map((industry, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndustry(idx)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedIndustry === idx
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {industry.industry}
            </button>
          ))}
        </div>

        {/* 선택된 산업 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-gray-600 dark:text-gray-400">도입률</p>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {currentIndustry.adoptionRate}%
            </p>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-green-600" />
              <p className="text-sm text-gray-600 dark:text-gray-400">평균 ROI</p>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {currentIndustry.averageROI}%
            </p>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <p className="text-sm text-gray-600 dark:text-gray-400">구축 기간</p>
            </div>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {currentIndustry.implementationTime}개월
            </p>
          </div>

          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-5 h-5 text-orange-600" />
              <p className="text-sm text-gray-600 dark:text-gray-400">사례 연구</p>
            </div>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {currentIndustry.caseStudies.length}건
            </p>
          </div>
        </div>

        {/* 주요 KPI */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold mb-3">주요 KPI 지표</h4>
            <div className="space-y-2">
              {currentIndustry.primaryKPIs.map((kpi, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="w-8 h-8 flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 rounded-full text-primary-600 dark:text-primary-400 font-bold text-sm">
                    {idx + 1}
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">{kpi}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3">KPI 중요도 분석</h4>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={kpiImportanceData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="kpi" className="text-xs" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="중요도"
                  dataKey="importance"
                  stroke="#2563eb"
                  fill="#2563eb"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 사례 연구 */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">성공 사례 연구</h3>
        <div className="space-y-4">
          {currentIndustry.caseStudies.map((caseStudy, idx) => (
            <div
              key={idx}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                <div>
                  <h4 className="text-lg font-semibold text-primary-600">{caseStudy.company}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {caseStudy.industry} · {caseStudy.solution}
                  </p>
                </div>
                <div className="flex gap-4 mt-2 md:mt-0">
                  {caseStudy.timeReduction && (
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {caseStudy.timeReduction}%
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">시간 단축</p>
                    </div>
                  )}
                  {caseStudy.costSavings && (
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {caseStudy.costSavings}%
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">비용 절감</p>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <p className="font-semibold text-sm mb-2">주요 성과:</p>
                <ul className="space-y-1">
                  {caseStudy.results.map((result, resultIdx) => (
                    <li
                      key={resultIdx}
                      className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <span className="text-primary-600 mt-1">•</span>
                      <span>{result}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustryAnalysis;
