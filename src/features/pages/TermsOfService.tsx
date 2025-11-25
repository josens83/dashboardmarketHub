import React from 'react';
import { FileText, ArrowLeft } from 'lucide-react';

interface TermsOfServiceProps {
  onClose: () => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ onClose }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          돌아가기
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-brand-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              이용약관
            </h1>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            최종 업데이트: 2024년 1월 1일
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                1. 서비스 이용 동의
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                대시보드 마켓 허브(이하 "서비스")를 이용하시는 분은 본 이용약관에 동의하는 것으로 간주됩니다.
                서비스를 이용하기 전에 본 약관을 주의 깊게 읽어주시기 바랍니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                2. 서비스 제공 내용
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                본 서비스는 다음과 같은 기능을 제공합니다:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li>BI 대시보드 시장 분석 데이터 제공</li>
                <li>주요 BI 서비스 비교 및 분석</li>
                <li>산업별 BI 활용 트렌드 정보</li>
                <li>데이터 내보내기 기능 (PDF, Excel)</li>
                <li>맞춤형 리포트 생성 및 저장</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                3. 회원 가입 및 계정 관리
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                회원 가입 시 정확하고 완전한 정보를 제공해야 하며, 계정 정보는 항상 최신 상태로 유지해야 합니다.
                회원은 자신의 계정과 비밀번호를 안전하게 관리할 책임이 있습니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                4. 구독 및 결제
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                유료 서비스는 월간 구독 방식으로 제공됩니다. 구독료는 매월 자동으로 청구되며,
                구독 취소 시 현재 결제 주기가 끝나는 시점까지 서비스를 이용할 수 있습니다.
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li>무료 플랜: 제한된 기능 이용 가능</li>
                <li>프리미엄 플랜: 월 29,000원, 모든 고급 기능 이용</li>
                <li>엔터프라이즈 플랜: 월 99,000원, 팀 협업 및 우선 지원</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                5. 환불 정책
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                14일 무료 체험 기간 내에 취소하는 경우 요금이 청구되지 않습니다.
                유료 구독 시작 후 7일 이내 취소 시 전액 환불이 가능하며, 그 이후에는 환불이 불가합니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                6. 지식재산권
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                본 서비스의 모든 콘텐츠, 데이터, 디자인, 로고 등은 대시보드 마켓 허브의 지식재산권으로 보호됩니다.
                서비스를 통해 제공된 데이터는 개인적 또는 내부적 용도로만 사용할 수 있으며,
                상업적 재배포는 금지됩니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                7. 서비스 중단 및 변경
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                당사는 서비스의 전부 또는 일부를 언제든지 수정, 중단 또는 종료할 수 있습니다.
                중대한 변경사항이 있을 경우 사전에 공지하도록 노력하겠습니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                8. 면책 조항
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                본 서비스는 "있는 그대로" 제공됩니다. 당사는 서비스의 정확성, 신뢰성, 가용성에 대해
                명시적 또는 묵시적 보증을 하지 않습니다. 서비스 이용으로 인한 직간접적 손해에 대해
                당사는 책임을 지지 않습니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                9. 약관의 변경
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                당사는 필요에 따라 본 약관을 수정할 수 있습니다. 중요한 변경사항은 이메일 또는
                서비스 내 공지를 통해 통보하며, 변경된 약관은 공지 후 7일 이후부터 효력이 발생합니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                10. 문의
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                본 이용약관에 대한 질문이나 문의사항이 있으시면 support@dashboardmarkethub.com으로
                연락해 주시기 바랍니다.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
