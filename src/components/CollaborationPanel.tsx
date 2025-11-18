import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import {
  MessageSquare,
  Send,
  AtSign,
  Reply,
  ThumbsUp,
  MoreVertical,
  Edit2,
  Trash2,
  X,
  Share2,
  Copy,
  Mail,
  Link,
  Users,
  Lock,
  Globe,
  Clock
} from 'lucide-react';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  content: string;
  timestamp: Date;
  likes: number;
  likedBy: string[];
  replies: Comment[];
  mentions: string[];
  edited: boolean;
}

interface ShareSettings {
  visibility: 'private' | 'team' | 'public';
  allowComments: boolean;
  allowDownload: boolean;
  expiresAt?: Date;
}

interface CollaborationPanelProps {
  resourceId: string;
  resourceType: 'report' | 'dashboard' | 'chart';
  resourceTitle: string;
  onClose?: () => void;
}

const CollaborationPanel: React.FC<CollaborationPanelProps> = ({
  resourceId,
  resourceType,
  resourceTitle,
  onClose
}) => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState<'comments' | 'share'>('comments');
  const [newComment, setNewComment] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  // Mock comments
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      userId: 'user-123',
      userName: '김민수',
      userEmail: 'minsu.kim@example.com',
      content: '이 대시보드 정말 유용하네요! @이지은 님도 한번 보세요.',
      timestamp: new Date('2025-11-17T10:30:00'),
      likes: 3,
      likedBy: ['user-456', 'user-789', 'user-234'],
      replies: [
        {
          id: '1-1',
          userId: 'user-456',
          userName: '이지은',
          userEmail: 'jieun.lee@example.com',
          content: '네, 확인했습니다! 데이터 인사이트가 좋네요.',
          timestamp: new Date('2025-11-17T11:00:00'),
          likes: 1,
          likedBy: ['user-123'],
          replies: [],
          mentions: ['김민수'],
          edited: false
        }
      ],
      mentions: ['이지은'],
      edited: false
    },
    {
      id: '2',
      userId: 'user-789',
      userName: '박서준',
      userEmail: 'seojun.park@example.com',
      content: 'Q3 데이터도 추가하면 좋을 것 같아요.',
      timestamp: new Date('2025-11-17T09:15:00'),
      likes: 2,
      likedBy: ['user-123', 'user-456'],
      replies: [],
      mentions: [],
      edited: false
    }
  ]);

  // Mock team members for mentions
  const teamMembers = [
    { id: 'user-456', name: '이지은', email: 'jieun.lee@example.com' },
    { id: 'user-789', name: '박서준', email: 'seojun.park@example.com' },
    { id: 'user-234', name: '최수진', email: 'sujin.choi@example.com' },
    { id: 'user-345', name: '정하늘', email: 'haneul.jung@example.com' }
  ];

  // Share settings
  const [shareSettings, setShareSettings] = useState<ShareSettings>({
    visibility: 'private',
    allowComments: true,
    allowDownload: false
  });

  const handleAddComment = () => {
    if (!newComment.trim()) {
      error('댓글 내용을 입력해주세요.');
      return;
    }

    if (!user) return;

    const mentions = extractMentions(newComment);
    const comment: Comment = {
      id: Date.now().toString(),
      userId: user.email,
      userName: user.name,
      userEmail: user.email,
      content: newComment,
      timestamp: new Date(),
      likes: 0,
      likedBy: [],
      replies: [],
      mentions,
      edited: false
    };

    if (replyingTo) {
      // Add as reply
      setComments(comments.map(c => {
        if (c.id === replyingTo) {
          return { ...c, replies: [...c.replies, comment] };
        }
        return c;
      }));
      setReplyingTo(null);
    } else {
      setComments([comment, ...comments]);
    }

    setNewComment('');
    success('댓글이 추가되었습니다.');
  };

  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@(\S+)/g;
    const matches = text.match(mentionRegex);
    return matches ? matches.map(m => m.substring(1)) : [];
  };

  const handleLikeComment = (commentId: string) => {
    if (!user) return;

    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        const liked = comment.likedBy.includes(user.email);
        return {
          ...comment,
          likes: liked ? comment.likes - 1 : comment.likes + 1,
          likedBy: liked
            ? comment.likedBy.filter(id => id !== user.email)
            : [...comment.likedBy, user.email]
        };
      }
      return comment;
    }));
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(comments.filter(c => c.id !== commentId));
    success('댓글이 삭제되었습니다.');
  };

  const handleMention = (member: typeof teamMembers[0]) => {
    const cursorPos = newComment.length;
    const beforeCursor = newComment.substring(0, cursorPos);
    const lastAtIndex = beforeCursor.lastIndexOf('@');

    if (lastAtIndex !== -1) {
      const newText = beforeCursor.substring(0, lastAtIndex) + `@${member.name} ` + newComment.substring(cursorPos);
      setNewComment(newText);
    }

    setShowMentions(false);
    setMentionQuery('');
  };

  const handleCommentChange = (text: string) => {
    setNewComment(text);

    // Check for @ symbol
    const lastAtIndex = text.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const query = text.substring(lastAtIndex + 1);
      if (!query.includes(' ')) {
        setMentionQuery(query);
        setShowMentions(true);
      } else {
        setShowMentions(false);
      }
    } else {
      setShowMentions(false);
    }
  };

  const filteredMembers = teamMembers.filter(m =>
    m.name.toLowerCase().includes(mentionQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  const handleCopyLink = () => {
    const link = `${window.location.origin}/shared/${resourceType}/${resourceId}`;
    navigator.clipboard.writeText(link);
    success('공유 링크가 복사되었습니다.');
  };

  const handleShareViaEmail = () => {
    const link = `${window.location.origin}/shared/${resourceType}/${resourceId}`;
    const subject = `${resourceTitle} - 공유`;
    const body = `${user?.name}님이 "${resourceTitle}"을(를) 공유했습니다.\n\n링크: ${link}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return new Date(date).toLocaleDateString('ko-KR');
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`${isReply ? 'ml-12 mt-3' : 'mb-4'}`}>
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 font-semibold text-sm flex-shrink-0">
          {comment.userName.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <div>
                <span className="font-semibold text-gray-900 dark:text-white text-sm">{comment.userName}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{formatTimestamp(comment.timestamp)}</span>
                {comment.edited && <span className="text-xs text-gray-400 ml-1">(수정됨)</span>}
              </div>
              {comment.userId === user?.email && (
                <div className="relative group">
                  <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                  <div className="hidden group-hover:block absolute right-0 mt-1 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-1 z-10">
                    <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2">
                      <Edit2 className="w-3 h-3" />
                      수정
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2"
                    >
                      <Trash2 className="w-3 h-3" />
                      삭제
                    </button>
                  </div>
                </div>
              )}
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">{comment.content}</p>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => handleLikeComment(comment.id)}
              className={`flex items-center gap-1 text-xs ${
                comment.likedBy.includes(user?.email || '')
                  ? 'text-purple-600 font-semibold'
                  : 'text-gray-500 dark:text-gray-400 hover:text-purple-600'
              }`}
            >
              <ThumbsUp className="w-3 h-3" />
              <span>{comment.likes > 0 ? comment.likes : '좋아요'}</span>
            </button>
            {!isReply && (
              <button
                onClick={() => setReplyingTo(comment.id)}
                className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-purple-600"
              >
                <Reply className="w-3 h-3" />
                답글
              </button>
            )}
          </div>
          {comment.replies.length > 0 && (
            <div className="mt-3 space-y-3">
              {comment.replies.map(reply => renderComment(reply, true))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const isPremiumUser = user?.subscriptionTier === 'professional' || user?.subscriptionTier === 'enterprise';

  if (!isPremiumUser) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 max-w-md">
        <MessageSquare className="w-12 h-12 text-purple-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
          협업 기능은 Premium 이상 플랜에서 사용 가능합니다
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
          댓글, 공유, 실시간 협업 기능을 사용하려면 업그레이드하세요.
        </p>
        <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
          플랜 업그레이드
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col h-full max-h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-600" />
          협업
        </h3>
        {onClose && (
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('comments')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'comments'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <MessageSquare className="w-4 h-4 inline mr-2" />
          댓글 ({comments.length})
        </button>
        <button
          onClick={() => setActiveTab('share')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'share'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <Share2 className="w-4 h-4 inline mr-2" />
          공유
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'comments' ? (
          <div>
            {/* New Comment */}
            <div className="mb-6">
              {replyingTo && (
                <div className="mb-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Reply className="w-4 h-4" />
                  <span>답글 작성 중</span>
                  <button onClick={() => setReplyingTo(null)} className="ml-auto text-purple-600 hover:text-purple-700">
                    취소
                  </button>
                </div>
              )}
              <div className="relative">
                <textarea
                  value={newComment}
                  onChange={(e) => handleCommentChange(e.target.value)}
                  placeholder="댓글을 입력하세요... (@로 멘션)"
                  className="w-full px-3 py-2 pr-24 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  rows={3}
                />

                {/* Mention Dropdown */}
                {showMentions && filteredMembers.length > 0 && (
                  <div className="absolute bottom-full left-0 mb-1 w-full bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-1 z-10">
                    {filteredMembers.map(member => (
                      <button
                        key={member.id}
                        onClick={() => handleMention(member)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2"
                      >
                        <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 text-xs font-semibold">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{member.email}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                <div className="absolute bottom-2 right-2 flex items-center gap-2">
                  <button
                    onClick={() => setShowMentions(!showMentions)}
                    className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900 rounded"
                    title="멘션"
                  >
                    <AtSign className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm"
                  >
                    <Send className="w-4 h-4" />
                    전송
                  </button>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length > 0 ? (
                comments.map(comment => renderComment(comment))
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">아직 댓글이 없습니다</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">첫 번째 댓글을 작성해보세요!</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Share Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                공유 링크
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={`${window.location.origin}/shared/${resourceType}/${resourceId}`}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  복사
                </button>
              </div>
            </div>

            {/* Share Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                공유 설정
              </label>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">공개 범위</label>
                  <div className="space-y-2">
                    {[
                      { value: 'private', label: '비공개', icon: Lock, desc: '나만 볼 수 있음' },
                      { value: 'team', label: '팀', icon: Users, desc: '팀 멤버만 볼 수 있음' },
                      { value: 'public', label: '공개', icon: Globe, desc: '링크를 가진 누구나 볼 수 있음' }
                    ].map(option => (
                      <label
                        key={option.value}
                        className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                          shareSettings.visibility === option.value
                            ? 'border-purple-600 bg-purple-50 dark:bg-purple-900'
                            : 'border-gray-200 dark:border-gray-600 hover:border-purple-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="visibility"
                          value={option.value}
                          checked={shareSettings.visibility === option.value}
                          onChange={(e) => setShareSettings({ ...shareSettings, visibility: e.target.value as any })}
                          className="text-purple-600"
                        />
                        <option.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white text-sm">{option.label}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{option.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-2 p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <input
                    type="checkbox"
                    checked={shareSettings.allowComments}
                    onChange={(e) => setShareSettings({ ...shareSettings, allowComments: e.target.checked })}
                    className="rounded text-purple-600"
                  />
                  <MessageSquare className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-900 dark:text-white">댓글 허용</span>
                </label>

                <label className="flex items-center gap-2 p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <input
                    type="checkbox"
                    checked={shareSettings.allowDownload}
                    onChange={(e) => setShareSettings({ ...shareSettings, allowDownload: e.target.checked })}
                    className="rounded text-purple-600"
                  />
                  <Link className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-900 dark:text-white">다운로드 허용</span>
                </label>
              </div>
            </div>

            {/* Quick Share */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                빠른 공유
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleShareViaEmail}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300"
                >
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">이메일</span>
                </button>
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300"
                >
                  <Link className="w-4 h-4" />
                  <span className="text-sm">링크 복사</span>
                </button>
              </div>
            </div>

            {/* Expiration */}
            {user?.subscriptionTier === 'enterprise' && (
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Clock className="w-4 h-4" />
                  만료 기간 설정
                </label>
                <input
                  type="datetime-local"
                  value={shareSettings.expiresAt?.toISOString().slice(0, 16) || ''}
                  onChange={(e) => setShareSettings({
                    ...shareSettings,
                    expiresAt: e.target.value ? new Date(e.target.value) : undefined
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  링크가 만료되면 자동으로 비활성화됩니다
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaborationPanel;
