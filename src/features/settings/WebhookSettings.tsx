import React, { useState } from 'react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useToast } from '@/shared/contexts/ToastContext';
import {
  Webhook,
  Plus,
  Settings,
  Trash2,
  PlayCircle,
  Check,
  X,
  Clock,
  MessageSquare,
  Mail,
  Link2,
  Copy,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive' | 'error';
  secret: string;
  lastTriggered?: Date;
  successRate: number;
  totalCalls: number;
}

interface WebhookLog {
  id: string;
  webhookId: string;
  event: string;
  status: 'success' | 'failed';
  timestamp: Date;
  responseTime: number;
  statusCode?: number;
  errorMessage?: string;
}

interface Integration {
  id: string;
  name: string;
  type: 'slack' | 'discord' | 'email' | 'custom';
  icon: React.ReactNode;
  description: string;
  configured: boolean;
}

const WebhookSettings: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState<'webhooks' | 'integrations' | 'logs'>('webhooks');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSecret, setShowSecret] = useState<string | null>(null);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  // Form state
  const [newWebhook, setNewWebhook] = useState({
    name: '',
    url: '',
    events: [] as string[],
    secret: ''
  });

  // Mock webhooks
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([
    {
      id: '1',
      name: 'Production Analytics',
      url: 'https://api.example.com/webhooks/analytics',
      events: ['report.created', 'export.completed', 'subscription.changed'],
      status: 'active',
      secret: 'whsec_Xz9kL4mN2pQ5rT8vW1yB3dF6hJ9kM2n',
      lastTriggered: new Date('2025-11-17T10:30:00'),
      successRate: 98.5,
      totalCalls: 1247
    },
    {
      id: '2',
      name: 'Slack Notifications',
      url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXX',
      events: ['user.registered', 'subscription.upgraded'],
      status: 'active',
      secret: 'whsec_Ab4cD5eF6gH7iJ8kL9mN0pQ1rS2tU3v',
      lastTriggered: new Date('2025-11-17T09:15:00'),
      successRate: 100,
      totalCalls: 523
    },
    {
      id: '3',
      name: 'Error Monitoring',
      url: 'https://api.example.com/webhooks/errors',
      events: ['system.error', 'payment.failed'],
      status: 'error',
      secret: 'whsec_Yx8wV7uT6sR5qP4oN3mL2kJ1iH0gF9e',
      lastTriggered: new Date('2025-11-16T18:45:00'),
      successRate: 45.2,
      totalCalls: 89
    }
  ]);

  // Mock logs
  const [logs] = useState<WebhookLog[]>([
    {
      id: '1',
      webhookId: '1',
      event: 'report.created',
      status: 'success',
      timestamp: new Date('2025-11-17T10:30:00'),
      responseTime: 142,
      statusCode: 200
    },
    {
      id: '2',
      webhookId: '2',
      event: 'subscription.upgraded',
      status: 'success',
      timestamp: new Date('2025-11-17T09:15:00'),
      responseTime: 89,
      statusCode: 200
    },
    {
      id: '3',
      webhookId: '3',
      event: 'system.error',
      status: 'failed',
      timestamp: new Date('2025-11-16T18:45:00'),
      responseTime: 5234,
      statusCode: 500,
      errorMessage: 'Connection timeout'
    }
  ]);

  // Available events
  const availableEvents = [
    { id: 'user.registered', label: '사용자 가입', category: '사용자' },
    { id: 'user.login', label: '사용자 로그인', category: '사용자' },
    { id: 'subscription.created', label: '구독 생성', category: '구독' },
    { id: 'subscription.upgraded', label: '구독 업그레이드', category: '구독' },
    { id: 'subscription.cancelled', label: '구독 취소', category: '구독' },
    { id: 'payment.succeeded', label: '결제 성공', category: '결제' },
    { id: 'payment.failed', label: '결제 실패', category: '결제' },
    { id: 'report.created', label: '리포트 생성', category: '리포트' },
    { id: 'export.completed', label: '내보내기 완료', category: '데이터' },
    { id: 'system.error', label: '시스템 오류', category: '시스템' }
  ];

  // Integrations
  const [integrations] = useState<Integration[]>([
    {
      id: '1',
      name: 'Slack',
      type: 'slack',
      icon: <MessageSquare className="w-6 h-6" />,
      description: 'Slack 채널로 실시간 알림을 받으세요',
      configured: true
    },
    {
      id: '2',
      name: 'Discord',
      type: 'discord',
      icon: <MessageSquare className="w-6 h-6" />,
      description: 'Discord 서버로 이벤트 알림을 전송하세요',
      configured: false
    },
    {
      id: '3',
      name: 'Email',
      type: 'email',
      icon: <Mail className="w-6 h-6" />,
      description: '중요한 이벤트를 이메일로 수신하세요',
      configured: true
    },
    {
      id: '4',
      name: 'Custom Webhook',
      type: 'custom',
      icon: <Link2 className="w-6 h-6" />,
      description: '커스텀 엔드포인트로 데이터를 전송하세요',
      configured: true
    }
  ]);

  const handleCreateWebhook = () => {
    if (!newWebhook.name || !newWebhook.url || newWebhook.events.length === 0) {
      error('모든 필드를 입력해주세요.');
      return;
    }

    const webhook: WebhookConfig = {
      id: Date.now().toString(),
      name: newWebhook.name,
      url: newWebhook.url,
      events: newWebhook.events,
      status: 'active',
      secret: `whsec_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      successRate: 0,
      totalCalls: 0
    };

    setWebhooks([...webhooks, webhook]);
    setShowCreateModal(false);
    setNewWebhook({ name: '', url: '', events: [], secret: '' });
    success('Webhook이 성공적으로 생성되었습니다.');
  };

  const handleDeleteWebhook = (id: string) => {
    setWebhooks(webhooks.filter(w => w.id !== id));
    success('Webhook이 삭제되었습니다.');
  };

  const handleTestWebhook = (_: string) => {
    success('테스트 이벤트가 전송되었습니다.');
  };

  const copySecret = (secret: string) => {
    navigator.clipboard.writeText(secret);
    success('Secret이 클립보드에 복사되었습니다.');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 flex items-center gap-1">
            <Check className="w-3 h-3" /> 활성
          </span>
        );
      case 'inactive':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 flex items-center gap-1">
            <Clock className="w-3 h-3" /> 비활성
          </span>
        );
      case 'error':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 flex items-center gap-1">
            <X className="w-3 h-3" /> 오류
          </span>
        );
      default:
        return null;
    }
  };

  const isPremiumUser = user?.subscriptionTier === 'professional' || user?.subscriptionTier === 'enterprise';

  if (!isPremiumUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <Webhook className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Webhook은 Premium 이상 플랜에서 사용 가능합니다
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            외부 시스템과 자동화 통합을 위해 프리미엄 또는 엔터프라이즈 플랜으로 업그레이드하세요.
          </p>
          <button className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium">
            플랜 업그레이드
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Webhook className="w-8 h-8 text-purple-600" />
                Webhook 및 통합
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                외부 시스템과 자동화 통합 관리
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Plus className="w-4 h-4" />
              Webhook 추가
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-6 flex gap-4 border-b border-gray-200 dark:border-gray-700">
            {[
              { id: 'webhooks', label: 'Webhooks', icon: Webhook },
              { id: 'integrations', label: '통합', icon: Link2 },
              { id: 'logs', label: '전송 로그', icon: Clock }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Webhooks Tab */}
        {activeTab === 'webhooks' && (
          <div className="space-y-4">
            {webhooks.map(webhook => (
              <div
                key={webhook.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{webhook.name}</h3>
                      {getStatusBadge(webhook.status)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-mono break-all">{webhook.url}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTestWebhook(webhook.id)}
                      className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900 rounded-lg"
                      title="테스트"
                    >
                      <PlayCircle className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" title="설정">
                      <Settings className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteWebhook(webhook.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg"
                      title="삭제"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Events */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">구독 이벤트</h4>
                  <div className="flex flex-wrap gap-2">
                    {webhook.events.map(event => (
                      <span
                        key={event}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
                      >
                        {event}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Secret */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Signing Secret</h4>
                  <div className="flex items-center gap-2">
                    <input
                      type={showSecret === webhook.id ? 'text' : 'password'}
                      value={webhook.secret}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                    />
                    <button
                      onClick={() => setShowSecret(showSecret === webhook.id ? null : webhook.id)}
                      className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      {showSecret === webhook.id ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => copySecret(webhook.secret)}
                      className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900 rounded-lg"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">총 호출</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{webhook.totalCalls.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">성공률</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{webhook.successRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">마지막 호출</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {webhook.lastTriggered
                        ? new Date(webhook.lastTriggered).toLocaleDateString('ko-KR')
                        : '-'}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {webhooks.length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                <Webhook className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">등록된 Webhook이 없습니다</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
                >
                  첫 Webhook 만들기
                </button>
              </div>
            )}
          </div>
        )}

        {/* Integrations Tab */}
        {activeTab === 'integrations' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {integrations.map(integration => (
              <div
                key={integration.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg text-purple-600">
                      {integration.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{integration.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{integration.description}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  {integration.configured ? (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 flex items-center gap-1">
                      <Check className="w-3 h-3" /> 연동됨
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                      미연동
                    </span>
                  )}
                  <button className="px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900 rounded-lg">
                    {integration.configured ? '설정' : '연동하기'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {logs.map(log => {
                const webhook = webhooks.find(w => w.id === log.webhookId);
                return (
                  <div key={log.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-gray-900 dark:text-white">{webhook?.name}</h3>
                          {log.status === 'success' ? (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 flex items-center gap-1">
                              <Check className="w-3 h-3" /> 성공
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 flex items-center gap-1">
                              <X className="w-3 h-3" /> 실패
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>이벤트: {log.event}</span>
                          <span>응답 시간: {log.responseTime}ms</span>
                          {log.statusCode && <span>상태 코드: {log.statusCode}</span>}
                          <span>{new Date(log.timestamp).toLocaleString('ko-KR')}</span>
                        </div>
                        {expandedLog === log.id && log.errorMessage && (
                          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900 rounded-lg">
                            <p className="text-sm text-red-800 dark:text-red-100">
                              <strong>오류:</strong> {log.errorMessage}
                            </p>
                          </div>
                        )}
                      </div>
                      {log.errorMessage && (
                        <button
                          onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                          {expandedLog === log.id ? (
                            <ChevronDown className="w-5 h-5" />
                          ) : (
                            <ChevronRight className="w-5 h-5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Create Webhook Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">새 Webhook 만들기</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Webhook 이름
                </label>
                <input
                  type="text"
                  value={newWebhook.name}
                  onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                  placeholder="Production Webhook"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  엔드포인트 URL
                </label>
                <input
                  type="url"
                  value={newWebhook.url}
                  onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                  placeholder="https://api.example.com/webhooks"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  이벤트 선택
                </label>
                <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                  {availableEvents.map(event => (
                    <label
                      key={event.id}
                      className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={newWebhook.events.includes(event.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewWebhook({ ...newWebhook, events: [...newWebhook.events, event.id] });
                          } else {
                            setNewWebhook({
                              ...newWebhook,
                              events: newWebhook.events.filter(ev => ev !== event.id)
                            });
                          }
                        }}
                        className="rounded text-purple-600"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{event.label}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{event.category}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                취소
              </button>
              <button
                onClick={handleCreateWebhook}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                생성하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebhookSettings;
