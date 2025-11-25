import React, { useState } from 'react';
import { User, Lock, CreditCard, Bell, Trash2, Save, Mail, Building } from 'lucide-react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useToast } from '@/shared/contexts/ToastContext';

const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { success, error: showError } = useToast();
  const [activeTab, setActiveTab] = useState('profile');

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: '',
    position: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    marketingEmails: false,
    productUpdates: true,
    weeklyDigest: true
  });

  const handleProfileSave = () => {
    success('프로필이 성공적으로 업데이트되었습니다.');
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      showError('비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }
    success('비밀번호가 성공적으로 변경되었습니다.');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleNotificationSave = () => {
    success('알림 설정이 저장되었습니다.');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      if (window.confirm('모든 데이터가 영구적으로 삭제됩니다. 계속하시겠습니까?')) {
        success('계정 삭제 요청이 접수되었습니다. 24시간 이내에 처리됩니다.');
        setTimeout(() => {
          logout();
        }, 2000);
      }
    }
  };

  const tabs = [
    { id: 'profile', label: '프로필', icon: <User className="w-5 h-5" /> },
    { id: 'security', label: '보안', icon: <Lock className="w-5 h-5" /> },
    { id: 'billing', label: '결제', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'notifications', label: '알림', icon: <Bell className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          설정
        </h1>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-brand-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    프로필 정보
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        이름
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          이메일
                        </div>
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          회사명 (선택)
                        </div>
                      </label>
                      <input
                        type="text"
                        value={profileData.company}
                        onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent text-gray-900 dark:text-white"
                        placeholder="회사명을 입력하세요"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        직책 (선택)
                      </label>
                      <input
                        type="text"
                        value={profileData.position}
                        onChange={(e) => setProfileData({ ...profileData, position: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent text-gray-900 dark:text-white"
                        placeholder="직책을 입력하세요"
                      />
                    </div>

                    <button
                      onClick={handleProfileSave}
                      className="flex items-center gap-2 px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                    >
                      <Save className="w-5 h-5" />
                      변경사항 저장
                    </button>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    보안 설정
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        현재 비밀번호
                      </label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        새 비밀번호
                      </label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent text-gray-900 dark:text-white"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        최소 8자 이상, 문자와 숫자를 포함해주세요
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        새 비밀번호 확인
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent text-gray-900 dark:text-white"
                      />
                    </div>

                    <button
                      onClick={handlePasswordChange}
                      className="flex items-center gap-2 px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                    >
                      <Lock className="w-5 h-5" />
                      비밀번호 변경
                    </button>

                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        계정 삭제
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
                      </p>
                      <button
                        onClick={handleDeleteAccount}
                        className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                        계정 삭제
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Tab */}
              {activeTab === 'billing' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    결제 및 구독
                  </h2>

                  <div className="space-y-6">
                    {/* Current Plan */}
                    <div className="bg-brand-50 dark:bg-purple-900/20 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            현재 플랜
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {user?.subscriptionTier === 'free' && '무료 플랜'}
                            {user?.subscriptionTier === 'professional' && '프리미엄 플랜'}
                            {user?.subscriptionTier === 'enterprise' && '엔터프라이즈 플랜'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-brand-600">
                            {user?.subscriptionTier === 'free' && '₩0'}
                            {user?.subscriptionTier === 'professional' && '₩29,000'}
                            {user?.subscriptionTier === 'enterprise' && '₩99,000'}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">/ 월</p>
                        </div>
                      </div>
                      {user?.subscriptionTier !== 'free' && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          다음 결제일: 2024년 2월 1일
                        </div>
                      )}
                    </div>

                    {/* Payment Method */}
                    {user?.subscriptionTier !== 'free' && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          결제 수단
                        </h3>
                        <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div className="flex items-center gap-3">
                            <CreditCard className="w-6 h-6 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                Visa •••• 4242
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                만료: 12/25
                              </p>
                            </div>
                          </div>
                          <button className="text-brand-600 hover:text-brand-700 font-medium">
                            변경
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Billing History */}
                    {user?.subscriptionTier !== 'free' && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          결제 내역
                        </h3>
                        <div className="space-y-2">
                          {[
                            { date: '2024-01-01', amount: user?.subscriptionTier === 'professional' ? 29000 : 99000, status: '완료' },
                            { date: '2023-12-01', amount: user?.subscriptionTier === 'professional' ? 29000 : 99000, status: '완료' },
                            { date: '2023-11-01', amount: user?.subscriptionTier === 'professional' ? 29000 : 99000, status: '완료' }
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                            >
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {item.date}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  월간 구독료
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-gray-900 dark:text-white">
                                  ₩{item.amount.toLocaleString()}
                                </p>
                                <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">
                                  {item.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Cancel Subscription */}
                    {user?.subscriptionTier !== 'free' && (
                      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button className="text-red-600 hover:text-red-700 font-medium">
                          구독 취소
                        </button>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          구독을 취소하시면 현재 결제 주기가 끝날 때까지 서비스를 이용하실 수 있습니다.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    알림 설정
                  </h2>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          이메일 업데이트
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          중요한 계정 업데이트와 보안 알림을 받습니다
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.emailUpdates}
                          onChange={(e) => setNotifications({ ...notifications, emailUpdates: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          마케팅 이메일
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          새로운 기능, 프로모션, 뉴스레터를 받습니다
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.marketingEmails}
                          onChange={(e) => setNotifications({ ...notifications, marketingEmails: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          제품 업데이트
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          새로운 기능과 개선사항에 대한 알림을 받습니다
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.productUpdates}
                          onChange={(e) => setNotifications({ ...notifications, productUpdates: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          주간 다이제스트
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          매주 시장 트렌드 요약을 받습니다
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.weeklyDigest}
                          onChange={(e) => setNotifications({ ...notifications, weeklyDigest: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
                      </label>
                    </div>

                    <button
                      onClick={handleNotificationSave}
                      className="flex items-center gap-2 px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                    >
                      <Save className="w-5 h-5" />
                      변경사항 저장
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
