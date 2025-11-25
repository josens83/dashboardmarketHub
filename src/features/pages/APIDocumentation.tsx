import React, { useState } from 'react';
import { Code, Copy, Key, Book, Zap, Shield } from 'lucide-react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useToast } from '@/shared/contexts/ToastContext';

const APIDocumentation: React.FC = () => {
  const { user } = useAuth();
  const { success } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'auth' | 'endpoints' | 'examples'>('overview');
  const [apiKey] = useState('dmh_live_1234567890abcdef');

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    success(`${label} 복사됨`);
  };

  const endpoints = [
    {
      method: 'GET',
      path: '/api/v1/market/overview',
      description: '전체 BI 시장 개요 데이터 조회',
      params: [
        { name: 'year', type: 'integer', required: false, description: '조회 연도 (기본값: 현재 연도)' }
      ],
      response: `{
  "status": "success",
  "data": {
    "globalMarket": {
      "size": 29.48,
      "growth": 10.2
    },
    "domesticMarket": {
      "size": 2.1,
      "growth": 12.5
    }
  }
}`
    },
    {
      method: 'GET',
      path: '/api/v1/services',
      description: 'BI 서비스 목록 및 비교 데이터',
      params: [
        { name: 'category', type: 'string', required: false, description: '카테고리 필터 (all, bi, analytics)' },
        { name: 'sort', type: 'string', required: false, description: '정렬 기준 (price, rating, popularity)' }
      ],
      response: `{
  "status": "success",
  "data": [
    {
      "id": "tableau",
      "name": "Tableau",
      "category": "bi",
      "monthlyPrice": 70,
      "rating": 4.8,
      "users": "150K+"
    }
  ],
  "total": 12
}`
    },
    {
      method: 'GET',
      path: '/api/v1/services/{serviceId}',
      description: '특정 서비스의 상세 정보',
      params: [
        { name: 'serviceId', type: 'string', required: true, description: '서비스 ID' }
      ],
      response: `{
  "status": "success",
  "data": {
    "id": "tableau",
    "name": "Tableau",
    "description": "...",
    "pricing": {...},
    "features": [...],
    "reviews": {...}
  }
}`
    },
    {
      method: 'POST',
      path: '/api/v1/reports',
      description: '커스텀 리포트 생성',
      params: [
        { name: 'type', type: 'string', required: true, description: 'market, service, industry, custom' },
        { name: 'format', type: 'string', required: false, description: 'pdf, excel (기본값: pdf)' },
        { name: 'filters', type: 'object', required: false, description: '필터 조건' }
      ],
      response: `{
  "status": "success",
  "data": {
    "reportId": "rep_12345",
    "downloadUrl": "https://...",
    "expiresAt": "2024-01-15T12:00:00Z"
  }
}`
    }
  ];

  const codeExamples = {
    curl: `curl -X GET "https://api.dashboardmarkethub.com/v1/market/overview" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json"`,
    javascript: `const response = await fetch(
  'https://api.dashboardmarkethub.com/v1/market/overview',
  {
    headers: {
      'Authorization': 'Bearer ${apiKey}',
      'Content-Type': 'application/json'
    }
  }
);
const data = await response.json();
console.log(data);`,
    python: `import requests

headers = {
    'Authorization': f'Bearer ${apiKey}',
    'Content-Type': 'application/json'
}

response = requests.get(
    'https://api.dashboardmarkethub.com/v1/market/overview',
    headers=headers
)

data = response.json()
print(data)`,
    node: `const axios = require('axios');

const config = {
  headers: {
    'Authorization': \`Bearer ${apiKey}\`,
    'Content-Type': 'application/json'
  }
};

axios.get('https://api.dashboardmarkethub.com/v1/market/overview', config)
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });`
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          API 문서
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Dashboard Market Hub API를 사용하여 BI 시장 데이터에 프로그래밍 방식으로 액세스하세요
        </p>
      </div>

      {/* API Key */}
      {user && (
        <div className="bg-gradient-to-r from-brand-600 to-indigo-600 rounded-lg p-6 mb-8 text-white">
          <div className="flex items-center gap-3 mb-3">
            <Key className="w-6 h-6" />
            <h3 className="text-xl font-semibold">API Key</h3>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <code className="flex-1 font-mono text-sm">{apiKey}</code>
            <button
              onClick={() => copyToClipboard(apiKey, 'API Key')}
              className="p-2 hover:bg-white/20 rounded transition-colors"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
          <p className="text-brand-100 text-sm mt-3">
            ⚠️ API Key는 안전하게 보관하세요. 공개 저장소에 커밋하지 마세요.
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="flex gap-6">
          {[
            { id: 'overview', label: '개요', icon: <Book className="w-4 h-4" /> },
            { id: 'auth', label: '인증', icon: <Shield className="w-4 h-4" /> },
            { id: 'endpoints', label: 'API 엔드포인트', icon: <Code className="w-4 h-4" /> },
            { id: 'examples', label: '코드 예제', icon: <Zap className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="prose dark:prose-invert max-w-none">
          <h2>시작하기</h2>
          <p>
            Dashboard Market Hub API를 사용하면 BI 시장 데이터, 서비스 비교 정보,
            산업별 분석 등에 프로그래밍 방식으로 액세스할 수 있습니다.
          </p>

          <h3>Base URL</h3>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 font-mono text-sm">
            https://api.dashboardmarkethub.com/v1
          </div>

          <h3>Rate Limits</h3>
          <table className="min-w-full">
            <thead>
              <tr>
                <th>플랜</th>
                <th>요청/분</th>
                <th>요청/일</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>무료</td>
                <td>10</td>
                <td>100</td>
              </tr>
              <tr>
                <td>프리미엄</td>
                <td>60</td>
                <td>5,000</td>
              </tr>
              <tr>
                <td>엔터프라이즈</td>
                <td>무제한</td>
                <td>무제한</td>
              </tr>
            </tbody>
          </table>

          <h3>응답 형식</h3>
          <p>모든 API 응답은 JSON 형식입니다:</p>
          <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
{`{
  "status": "success" | "error",
  "data": {...} | null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  } | null
}`}
          </pre>
        </div>
      )}

      {/* Auth Tab */}
      {activeTab === 'auth' && (
        <div className="prose dark:prose-invert max-w-none">
          <h2>인증</h2>
          <p>
            모든 API 요청에는 Bearer 토큰을 사용한 인증이 필요합니다.
            API Key는 대시보드의 설정 페이지에서 확인할 수 있습니다.
          </p>

          <h3>Authorization Header</h3>
          <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
{`Authorization: Bearer YOUR_API_KEY`}
          </pre>

          <h3>예제</h3>
          <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
{codeExamples.curl}
          </pre>

          <h3>오류 코드</h3>
          <table className="min-w-full">
            <thead>
              <tr>
                <th>코드</th>
                <th>설명</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>401</td>
                <td>인증 실패 - API Key가 유효하지 않음</td>
              </tr>
              <tr>
                <td>403</td>
                <td>권한 없음 - 현재 플랜에서 접근 불가</td>
              </tr>
              <tr>
                <td>429</td>
                <td>Rate Limit 초과</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Endpoints Tab */}
      {activeTab === 'endpoints' && (
        <div className="space-y-8">
          {endpoints.map((endpoint, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded font-semibold text-sm ${
                  endpoint.method === 'GET' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                }`}>
                  {endpoint.method}
                </span>
                <code className="text-lg font-mono text-gray-900 dark:text-white">
                  {endpoint.path}
                </code>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {endpoint.description}
              </p>

              {endpoint.params.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Parameters</h4>
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Type</th>
                        <th className="px-4 py-2 text-left">Required</th>
                        <th className="px-4 py-2 text-left">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                      {endpoint.params.map((param, pidx) => (
                        <tr key={pidx}>
                          <td className="px-4 py-2 font-mono text-brand-600">{param.name}</td>
                          <td className="px-4 py-2 font-mono text-gray-600 dark:text-gray-400">{param.type}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                              param.required
                                ? 'bg-red-100 text-red-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {param.required ? 'Required' : 'Optional'}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{param.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Response</h4>
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm">
                    {endpoint.response}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(endpoint.response, '응답 예제')}
                    className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                  >
                    <Copy className="w-4 h-4 text-gray-300" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Examples Tab */}
      {activeTab === 'examples' && (
        <div className="space-y-6">
          {Object.entries(codeExamples).map(([lang, code]) => (
            <div key={lang} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                  {lang === 'curl' ? 'cURL' : lang === 'javascript' ? 'JavaScript (Fetch)' : lang === 'python' ? 'Python' : 'Node.js'}
                </h3>
                <button
                  onClick={() => copyToClipboard(code, '코드')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-sm"
                >
                  <Copy className="w-4 h-4" />
                  복사
                </button>
              </div>
              <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm">
                {code}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default APIDocumentation;
