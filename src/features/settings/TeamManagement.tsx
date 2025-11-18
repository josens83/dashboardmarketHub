import React, { useState } from 'react';
import { Users, UserPlus, Mail, Shield, Crown, Trash2, CheckCircle, Clock, X } from 'lucide-react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useToast } from '@/shared/contexts/ToastContext';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  status: 'active' | 'pending';
  joinedAt: Date;
  lastActive?: Date;
}

const TeamManagement: React.FC = () => {
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member'>('member');

  // 데모 팀원 데이터
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: user?.name || '홍길동',
      email: user?.email || 'demo@example.com',
      role: 'owner',
      status: 'active',
      joinedAt: new Date('2024-01-01'),
      lastActive: new Date()
    },
    {
      id: '2',
      name: '김철수',
      email: 'kim@company.com',
      role: 'admin',
      status: 'active',
      joinedAt: new Date('2024-01-15'),
      lastActive: new Date(Date.now() - 1000 * 60 * 30)
    },
    {
      id: '3',
      name: '이영희',
      email: 'lee@company.com',
      role: 'member',
      status: 'active',
      joinedAt: new Date('2024-02-01'),
      lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2)
    },
    {
      id: '4',
      name: '박민수',
      email: 'park@company.com',
      role: 'member',
      status: 'pending',
      joinedAt: new Date('2024-02-10')
    }
  ]);

  const handleInvite = () => {
    if (!inviteEmail) {
      showError('이메일을 입력해주세요');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail)) {
      showError('올바른 이메일 형식이 아닙니다');
      return;
    }

    // 데모: 새 팀원 추가
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      status: 'pending',
      joinedAt: new Date()
    };

    setTeamMembers(prev => [...prev, newMember]);
    success(`${inviteEmail}에게 초대 이메일을 전송했습니다`);
    setShowInviteModal(false);
    setInviteEmail('');
    setInviteRole('member');
  };

  const handleRemoveMember = (memberId: string, memberName: string) => {
    if (window.confirm(`${memberName}님을 팀에서 제거하시겠습니까?`)) {
      setTeamMembers(prev => prev.filter(m => m.id !== memberId));
      success(`${memberName}님이 팀에서 제거되었습니다`);
    }
  };

  const handleChangeRole = (memberId: string, newRole: 'admin' | 'member') => {
    setTeamMembers(prev =>
      prev.map(m => m.id === memberId ? { ...m, role: newRole } : m)
    );
    success('권한이 변경되었습니다');
  };

  const getRoleBadge = (role: TeamMember['role']) => {
    const badges = {
      owner: { label: '소유자', color: 'bg-purple-600', icon: <Crown className="w-3 h-3" /> },
      admin: { label: '관리자', color: 'bg-blue-600', icon: <Shield className="w-3 h-3" /> },
      member: { label: '멤버', color: 'bg-gray-600', icon: null }
    };
    return badges[role];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatLastActive = (date?: Date) => {
    if (!date) return '-';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 5) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    return formatDate(date);
  };

  // Enterprise 플랜 체크
  if (user?.subscriptionTier !== 'enterprise') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl p-8 text-white text-center">
          <Users className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-3">팀 협업 기능</h2>
          <p className="text-lg mb-6 text-purple-100">
            팀원을 초대하고 함께 데이터를 분석하세요
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold mb-3">엔터프라이즈 플랜 전용 기능:</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                무제한 팀원 초대
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                역할 기반 권한 관리
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                팀 활동 추적 및 분석
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                공유 리포트 및 협업 도구
              </li>
            </ul>
          </div>
          <button className="px-8 py-3 bg-white text-purple-700 rounded-lg font-bold text-lg hover:bg-purple-50 transition-colors">
            엔터프라이즈 플랜으로 업그레이드
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          팀 관리
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          팀원을 초대하고 권한을 관리하세요
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">전체 팀원</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {teamMembers.length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            활성: {teamMembers.filter(m => m.status === 'active').length}명
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">관리자</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {teamMembers.filter(m => m.role === 'admin' || m.role === 'owner').length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            소유자 1명 포함
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">대기 중</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {teamMembers.filter(m => m.status === 'pending').length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            초대 승인 대기
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mb-6">
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          팀원 초대
        </button>
      </div>

      {/* Team Members Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                팀원
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                역할
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                가입일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                마지막 활동
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {teamMembers.map(member => (
              <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{member.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{member.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-white ${getRoleBadge(member.role).color}`}>
                    {getRoleBadge(member.role).icon}
                    {getRoleBadge(member.role).label}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {member.status === 'active' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                      <CheckCircle className="w-3 h-3" />
                      활성
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                      <Clock className="w-3 h-3" />
                      대기 중
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(member.joinedAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {formatLastActive(member.lastActive)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {member.role !== 'owner' && (
                    <div className="flex items-center justify-end gap-2">
                      {member.role === 'member' && (
                        <button
                          onClick={() => handleChangeRole(member.id, 'admin')}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          관리자로 승격
                        </button>
                      )}
                      {member.role === 'admin' && (
                        <button
                          onClick={() => handleChangeRole(member.id, 'member')}
                          className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                        >
                          멤버로 변경
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveMember(member.id, member.name)}
                        className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                        title="팀에서 제거"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">팀원 초대</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  이메일 주소
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="example@company.com"
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  역할
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'admin' | 'member')}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900 dark:text-white"
                >
                  <option value="member">멤버 - 일반 사용 권한</option>
                  <option value="admin">관리자 - 전체 관리 권한</option>
                </select>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  초대 이메일이 전송되며, 상대방이 수락하면 팀에 합류합니다.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleInvite}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  초대 보내기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
