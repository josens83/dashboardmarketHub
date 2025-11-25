import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';

interface PrivacyPolicyProps {
  onClose: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onClose }) => {
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
            <Shield className="w-8 h-8 text-brand-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              개인정보 처리방침
            </h1>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            최종 업데이트: 2024년 1월 1일
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                1. 개인정보의 수집 및 이용 목적
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                대시보드 마켓 허브는 다음의 목적을 위해 개인정보를 수집 및 이용합니다:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li>서비스 회원 가입 및 관리</li>
                <li>서비스 제공 및 개선</li>
                <li>구독 및 결제 처리</li>
                <li>고객 지원 및 문의 응대</li>
                <li>마케팅 및 프로모션 정보 제공 (동의 시)</li>
                <li>서비스 이용 통계 분석</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                2. 수집하는 개인정보 항목
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                당사는 다음과 같은 개인정보를 수집합니다:
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">
                필수 정보
              </h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li>이메일 주소</li>
                <li>비밀번호 (암호화 저장)</li>
                <li>이름 또는 닉네임</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">
                선택 정보
              </h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li>회사명</li>
                <li>직책</li>
                <li>전화번호</li>
                <li>프로필 사진</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">
                자동 수집 정보
              </h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li>IP 주소</li>
                <li>쿠키 및 세션 정보</li>
                <li>기기 정보 (OS, 브라우저 종류 등)</li>
                <li>서비스 이용 기록</li>
                <li>접속 로그</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                3. 개인정보의 보유 및 이용 기간
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                당사는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.
                다만, 다음의 경우는 명시한 기간 동안 보존합니다:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li>회원 탈퇴 시: 즉시 삭제 (단, 관련 법령에 따라 보관이 필요한 경우 예외)</li>
                <li>서비스 이용 기록: 3개월</li>
                <li>결제 및 거래 기록: 5년 (전자상거래법)</li>
                <li>소비자 불만 및 분쟁 처리 기록: 3년 (전자상거래법)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                4. 개인정보의 제3자 제공
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                당사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.
                다만, 다음의 경우는 예외로 합니다:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li>이용자가 사전에 동의한 경우</li>
                <li>법령의 규정에 의하거나 수사 목적으로 법령에 정해진 절차와 방법에 따라 요구가 있는 경우</li>
                <li>결제 처리를 위한 결제 대행사 (Toss Payments 등)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                5. 개인정보의 처리 위탁
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                당사는 서비스 제공을 위해 다음과 같이 개인정보 처리 업무를 위탁하고 있습니다:
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      <th className="text-left py-2 text-gray-900 dark:text-white">수탁업체</th>
                      <th className="text-left py-2 text-gray-900 dark:text-white">위탁업무</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 dark:text-gray-300">
                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      <td className="py-2">AWS</td>
                      <td className="py-2">클라우드 서버 호스팅</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      <td className="py-2">Toss Payments</td>
                      <td className="py-2">결제 처리</td>
                    </tr>
                    <tr>
                      <td className="py-2">SendGrid</td>
                      <td className="py-2">이메일 발송</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                6. 개인정보의 파기 절차 및 방법
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                당사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때는
                지체없이 해당 개인정보를 파기합니다.
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li>전자적 파일: 복구 불가능한 방법으로 영구 삭제</li>
                <li>종이 문서: 분쇄기로 분쇄하거나 소각</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                7. 이용자의 권리
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                이용자는 언제든지 다음과 같은 권리를 행사할 수 있습니다:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li>개인정보 열람 요구</li>
                <li>개인정보 정정 요구</li>
                <li>개인정보 삭제 요구</li>
                <li>개인정보 처리 정지 요구</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                권리 행사는 서비스 내 설정 페이지 또는 고객센터를 통해 가능합니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                8. 개인정보 보호를 위한 기술적/관리적 대책
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                당사는 이용자의 개인정보를 안전하게 관리하기 위해 다음과 같은 보안 조치를 취하고 있습니다:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li>비밀번호 암호화 저장 (bcrypt)</li>
                <li>SSL/TLS 암호화 통신</li>
                <li>해킹 등에 대비한 보안 프로그램 운영</li>
                <li>접근 권한 관리</li>
                <li>정기적인 보안 감사 및 취약점 점검</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                9. 쿠키의 운영 및 관리
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                당사는 서비스 제공을 위해 쿠키를 사용합니다. 쿠키는 웹사이트가 이용자의 브라우저에
                저장하는 작은 텍스트 파일입니다. 이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으나,
                이 경우 서비스 이용에 제한이 있을 수 있습니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                10. 개인정보 보호책임자
              </h2>
              <div className="bg-brand-50 dark:bg-purple-900/20 p-6 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  <strong>개인정보 보호책임자</strong>
                </p>
                <ul className="text-gray-700 dark:text-gray-300 space-y-1">
                  <li>이름: 홍길동</li>
                  <li>직책: 개인정보 보호책임자</li>
                  <li>이메일: privacy@dashboardmarkethub.com</li>
                  <li>전화: 02-1234-5678</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                11. 개인정보 처리방침의 변경
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                본 개인정보 처리방침은 법령, 정책 또는 보안기술의 변경에 따라 내용이 추가, 삭제 및 수정될 수 있습니다.
                변경 시 최소 7일 전에 서비스 내 공지사항을 통해 고지하겠습니다.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
