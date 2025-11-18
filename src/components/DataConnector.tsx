import React, { useState } from 'react';
import { Upload, Database, Link as LinkIcon, FileJson, FileSpreadsheet, Globe, Check, X, Loader2, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';

interface DataSource {
  id: string;
  name: string;
  type: 'csv' | 'json' | 'api' | 'database';
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  config: any;
}

interface APIConfig {
  url: string;
  method: 'GET' | 'POST';
  headers: Record<string, string>;
  refreshInterval: number;
}

const DataConnector: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState<'sources' | 'upload' | 'api' | 'sync'>('sources');
  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      id: '1',
      name: 'Market Data API',
      type: 'api',
      status: 'connected',
      lastSync: '2024-01-15 14:30',
      config: { url: 'https://api.example.com/market', method: 'GET' }
    },
    {
      id: '2',
      name: 'Sales Report CSV',
      type: 'csv',
      status: 'connected',
      lastSync: '2024-01-15 10:15',
      config: { filename: 'sales_2024.csv' }
    },
  ]);

  const [uploading, setUploading] = useState(false);
  const [apiConfig, setApiConfig] = useState<APIConfig>({
    url: '',
    method: 'GET',
    headers: {},
    refreshInterval: 300,
  });
  const [headerKey, setHeaderKey] = useState('');
  const [headerValue, setHeaderValue] = useState('');

  // 파일 업로드 핸들러
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'csv' | 'json') => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (user?.subscriptionTier === 'free' && dataSources.length >= 2) {
      error('무료 플랜은 최대 2개의 데이터 소스만 연결할 수 있습니다.');
      return;
    }

    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;

        // 데이터 검증
        if (type === 'json') {
          try {
            JSON.parse(content);
          } catch {
            error('유효하지 않은 JSON 파일입니다.');
            setUploading(false);
            return;
          }
        } else if (type === 'csv') {
          if (!content.includes(',')) {
            error('유효하지 않은 CSV 파일입니다.');
            setUploading(false);
            return;
          }
        }

        // 데이터 소스 추가
        const newSource: DataSource = {
          id: Date.now().toString(),
          name: file.name,
          type,
          status: 'connected',
          lastSync: new Date().toLocaleString('ko-KR'),
          config: { filename: file.name, size: file.size }
        };

        setDataSources([...dataSources, newSource]);
        success(`${file.name} 파일이 성공적으로 업로드되었습니다.`);

        // localStorage에 데이터 저장 (실제로는 서버에 저장)
        localStorage.setItem(`datasource_${newSource.id}`, content);
      };

      reader.readAsText(file);
    } catch (err) {
      error('파일 업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  // API 연결 설정
  const handleAPIConnect = async () => {
    if (!apiConfig.url) {
      error('API URL을 입력해주세요.');
      return;
    }

    if (user?.subscriptionTier === 'free') {
      error('API 연동은 프리미엄 플랜 이상에서 사용 가능합니다.');
      return;
    }

    setUploading(true);

    try {
      // 실제로는 API를 테스트하고 연결
      // const response = await fetch(apiConfig.url, { method: apiConfig.method, headers: apiConfig.headers });

      const newSource: DataSource = {
        id: Date.now().toString(),
        name: `API: ${new URL(apiConfig.url).hostname}`,
        type: 'api',
        status: 'connected',
        lastSync: new Date().toLocaleString('ko-KR'),
        config: apiConfig
      };

      setDataSources([...dataSources, newSource]);
      success('API 연결이 성공적으로 설정되었습니다.');

      // 설정 초기화
      setApiConfig({ url: '', method: 'GET', headers: {}, refreshInterval: 300 });
      setActiveTab('sources');
    } catch (err) {
      error('API 연결 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  // 데이터 소스 동기화
  const handleSync = async (sourceId: string) => {
    const source = dataSources.find(s => s.id === sourceId);
    if (!source) return;

    setDataSources(dataSources.map(s =>
      s.id === sourceId ? { ...s, status: 'connected' as const, lastSync: new Date().toLocaleString('ko-KR') } : s
    ));

    success(`${source.name} 동기화가 완료되었습니다.`);
  };

  // 데이터 소스 삭제
  const handleDelete = (sourceId: string) => {
    const source = dataSources.find(s => s.id === sourceId);
    setDataSources(dataSources.filter(s => s.id !== sourceId));
    localStorage.removeItem(`datasource_${sourceId}`);
    success(`${source?.name}이(가) 삭제되었습니다.`);
  };

  // 헤더 추가
  const addHeader = () => {
    if (!headerKey || !headerValue) {
      error('헤더 키와 값을 모두 입력해주세요.');
      return;
    }
    setApiConfig({
      ...apiConfig,
      headers: { ...apiConfig.headers, [headerKey]: headerValue }
    });
    setHeaderKey('');
    setHeaderValue('');
  };

  // 헤더 제거
  const removeHeader = (key: string) => {
    const newHeaders = { ...apiConfig.headers };
    delete newHeaders[key];
    setApiConfig({ ...apiConfig, headers: newHeaders });
  };

  const getStatusIcon = (status: DataSource['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'disconnected':
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
      case 'error':
        return <X className="w-5 h-5 text-red-600" />;
    }
  };

  const getTypeIcon = (type: DataSource['type']) => {
    switch (type) {
      case 'csv':
        return <FileSpreadsheet className="w-5 h-5 text-green-600" />;
      case 'json':
        return <FileJson className="w-5 h-5 text-blue-600" />;
      case 'api':
        return <Globe className="w-5 h-5 text-purple-600" />;
      case 'database':
        return <Database className="w-5 h-5 text-orange-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            데이터 커넥터
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            다양한 소스에서 데이터를 연결하고 실시간으로 동기화하세요
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-1 p-4">
              <button
                onClick={() => setActiveTab('sources')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'sources'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Database className="w-4 h-4 inline mr-2" />
                데이터 소스
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'upload'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Upload className="w-4 h-4 inline mr-2" />
                파일 업로드
              </button>
              <button
                onClick={() => setActiveTab('api')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'api'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <LinkIcon className="w-4 h-4 inline mr-2" />
                API 연동
              </button>
              <button
                onClick={() => setActiveTab('sync')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'sync'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <RefreshCw className="w-4 h-4 inline mr-2" />
                동기화 설정
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* 데이터 소스 목록 */}
            {activeTab === 'sources' && (
              <div className="space-y-4">
                {dataSources.length === 0 ? (
                  <div className="text-center py-12">
                    <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      연결된 데이터 소스가 없습니다
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      파일을 업로드하거나 API를 연동하여 시작하세요
                    </p>
                  </div>
                ) : (
                  dataSources.map((source) => (
                    <div
                      key={source.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        {getTypeIcon(source.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {source.name}
                            </h3>
                            {getStatusIcon(source.status)}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            마지막 동기화: {source.lastSync}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSync(source.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="동기화"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(source.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="삭제"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 파일 업로드 */}
            {activeTab === 'upload' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    CSV 파일 업로드
                  </h3>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
                    <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      CSV 파일을 드래그하거나 클릭하여 업로드하세요
                    </p>
                    <label className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700 transition-colors">
                      {uploading ? (
                        <>
                          <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                          업로드 중...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 inline mr-2" />
                          파일 선택
                        </>
                      )}
                      <input
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'csv')}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    JSON 파일 업로드
                  </h3>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
                    <FileJson className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      JSON 파일을 드래그하거나 클릭하여 업로드하세요
                    </p>
                    <label className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700 transition-colors">
                      {uploading ? (
                        <>
                          <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                          업로드 중...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 inline mr-2" />
                          파일 선택
                        </>
                      )}
                      <input
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'json')}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* API 연동 */}
            {activeTab === 'api' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    API URL *
                  </label>
                  <input
                    type="url"
                    value={apiConfig.url}
                    onChange={(e) => setApiConfig({ ...apiConfig, url: e.target.value })}
                    placeholder="https://api.example.com/data"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    HTTP 메서드
                  </label>
                  <select
                    value={apiConfig.method}
                    onChange={(e) => setApiConfig({ ...apiConfig, method: e.target.value as 'GET' | 'POST' })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    헤더 (선택사항)
                  </label>
                  <div className="space-y-2 mb-4">
                    {Object.entries(apiConfig.headers).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <code className="flex-1 text-sm text-gray-900 dark:text-white">
                          {key}: {value}
                        </code>
                        <button
                          onClick={() => removeHeader(key)}
                          className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={headerKey}
                      onChange={(e) => setHeaderKey(e.target.value)}
                      placeholder="헤더 키 (예: Authorization)"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <input
                      type="text"
                      value={headerValue}
                      onChange={(e) => setHeaderValue(e.target.value)}
                      placeholder="헤더 값 (예: Bearer token)"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={addHeader}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      추가
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    자동 새로고침 간격 (초)
                  </label>
                  <input
                    type="number"
                    value={apiConfig.refreshInterval}
                    onChange={(e) => setApiConfig({ ...apiConfig, refreshInterval: parseInt(e.target.value) })}
                    min="60"
                    max="3600"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    {user?.subscriptionTier === 'free'
                      ? '⚠️ API 연동은 프리미엄 플랜 이상에서만 사용 가능합니다'
                      : '60초에서 3600초 사이로 설정할 수 있습니다'}
                  </p>
                </div>

                <button
                  onClick={handleAPIConnect}
                  disabled={uploading || !apiConfig.url}
                  className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      연결 중...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      API 연결
                    </>
                  )}
                </button>
              </div>
            )}

            {/* 동기화 설정 */}
            {activeTab === 'sync' && (
              <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                        자동 동기화 설정
                      </h3>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        {user?.subscriptionTier === 'enterprise'
                          ? '엔터프라이즈 플랜에서는 실시간 동기화를 지원합니다.'
                          : user?.subscriptionTier === 'professional'
                          ? '프리미엄 플랜에서는 최소 5분 간격으로 자동 동기화를 설정할 수 있습니다.'
                          : '무료 플랜에서는 수동 동기화만 가능합니다. 프리미엄으로 업그레이드하여 자동 동기화를 사용하세요.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {dataSources.map((source) => (
                    <div
                      key={source.id}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getTypeIcon(source.type)}
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {source.name}
                          </span>
                        </div>
                        <button
                          onClick={() => handleSync(source.id)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                        >
                          <RefreshCw className="w-4 h-4" />
                          동기화
                        </button>
                      </div>
                      {source.type === 'api' && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <p>자동 새로고침: {source.config.refreshInterval}초 마다</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 사용량 정보 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            데이터 소스 사용량
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">현재 연결</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {dataSources.length} / {user?.subscriptionTier === 'enterprise' ? '무제한' : user?.subscriptionTier === 'professional' ? '10' : '2'}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    (dataSources.length / (user?.subscriptionTier === 'enterprise' ? 100 : user?.subscriptionTier === 'professional' ? 10 : 2)) * 100
                  )}%`
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataConnector;
