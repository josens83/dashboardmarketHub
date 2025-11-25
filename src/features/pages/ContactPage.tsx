import React, { useState } from 'react';
import { Mail, MessageSquare, Phone, MapPin, Send } from 'lucide-react';
import { useToast } from '@/shared/contexts/ToastContext';

const ContactPage: React.FC = () => {
  const { success } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      success('문의가 성공적으로 전송되었습니다. 빠른 시일 내에 답변드리겠습니다.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: ''
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: '이메일',
      content: 'support@dashboardmarkethub.com',
      description: '24시간 이내 응답'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: '전화',
      content: '02-1234-5678',
      description: '평일 09:00 - 18:00'
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: '라이브 채팅',
      content: '즉시 연결',
      description: '프리미엄 플랜 이상'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: '오피스',
      content: '서울시 강남구 테헤란로',
      description: '사전 예약 필요'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            문의하기
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            궁금하신 점이 있으시면 언제든지 연락주세요
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                메시지 보내기
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      이름 *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent text-gray-900 dark:text-white"
                      placeholder="홍길동"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      이메일 *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent text-gray-900 dark:text-white"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    문의 유형 *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent text-gray-900 dark:text-white"
                  >
                    <option value="general">일반 문의</option>
                    <option value="technical">기술 지원</option>
                    <option value="billing">결제 문의</option>
                    <option value="feature">기능 요청</option>
                    <option value="partnership">제휴 문의</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    제목 *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent text-gray-900 dark:text-white"
                    placeholder="문의 제목을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    메시지 *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent text-gray-900 dark:text-white resize-none"
                    placeholder="문의 내용을 자세히 작성해주세요..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>처리 중...</>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      메시지 보내기
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Methods */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                연락 방법
              </h3>
              <div className="space-y-6">
                {contactMethods.map((method, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-brand-600 dark:text-brand-400 flex-shrink-0">
                      {method.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {method.title}
                      </h4>
                      <p className="text-brand-600 dark:text-brand-400 mb-1">
                        {method.content}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {method.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-brand-50 dark:bg-purple-900/20 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">
                영업시간
              </h3>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex justify-between">
                  <span>월 - 금</span>
                  <span className="font-medium">09:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>토요일</span>
                  <span className="font-medium">10:00 - 14:00</span>
                </div>
                <div className="flex justify-between">
                  <span>일요일</span>
                  <span className="text-gray-500">휴무</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">
                * 이메일 문의는 24시간 접수 가능하며, 영업일 기준 24시간 이내 답변드립니다.
              </p>
            </div>

            <div className="bg-gradient-to-br from-brand-600 to-indigo-600 rounded-lg p-6 text-white">
              <h3 className="font-bold mb-2">
                빠른 답변이 필요하신가요?
              </h3>
              <p className="text-sm text-brand-100 mb-4">
                프리미엄 플랜 이상에서는 라이브 채팅과 우선 지원을 제공합니다.
              </p>
              <button className="w-full py-2 bg-white text-brand-700 rounded-lg font-semibold hover:bg-brand-50 transition-colors">
                플랜 업그레이드
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
