import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search } from 'lucide-react';

const FAQPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      category: '일반',
      questions: [
        {
          q: '대시보드 마켓 허브는 무엇인가요?',
          a: '대시보드 마켓 허브는 BI(Business Intelligence) 대시보드 시장을 분석하고 비교할 수 있는 플랫폼입니다. Tableau, Power BI, Qlik 등 주요 BI 솔루션의 시장 동향, 가격, 기능을 한눈에 비교하고 분석할 수 있습니다.'
        },
        {
          q: '무료로 사용할 수 있나요?',
          a: '네, 무료 플랜을 제공하고 있습니다. 무료 플랜에서는 기본적인 시장 분석 데이터를 확인할 수 있으며, 프리미엄 플랜으로 업그레이드하시면 고급 비교 도구, 무제한 데이터 내보내기 등 모든 기능을 이용하실 수 있습니다.'
        },
        {
          q: '어떤 데이터를 제공하나요?',
          a: '글로벌 및 국내 BI 시장 성장률, 주요 BI 서비스 비교(기능, 가격, 사용자 리뷰), 산업별 BI 활용 트렌드, 가격 비교 분석 등을 제공합니다. 모든 데이터는 신뢰할 수 있는 시장 조사 기관의 자료를 기반으로 합니다.'
        }
      ]
    },
    {
      category: '구독 및 결제',
      questions: [
        {
          q: '요금제는 어떻게 되나요?',
          a: '무료 플랜(기본 기능), 프리미엄 플랜(₩29,000/월, 고급 기능), 엔터프라이즈 플랜(₩99,000/월, 팀 협업 및 우선 지원)을 제공합니다. 모든 유료 플랜은 14일 무료 체험이 가능합니다.'
        },
        {
          q: '언제든지 취소할 수 있나요?',
          a: '네, 언제든지 구독을 취소할 수 있습니다. 취소 후에도 현재 결제 주기가 끝날 때까지 서비스를 계속 이용하실 수 있습니다. 별도의 위약금이나 수수료는 없습니다.'
        },
        {
          q: '환불 정책은 어떻게 되나요?',
          a: '14일 무료 체험 기간 내에 취소하시면 요금이 청구되지 않습니다. 유료 구독 시작 후 7일 이내 취소 시 전액 환불이 가능하며, 그 이후에는 환불이 불가합니다.'
        },
        {
          q: '어떤 결제 방법을 지원하나요?',
          a: '신용카드, 체크카드, 계좌이체, 간편결제(카카오페이, 네이버페이 등)를 지원합니다. 모든 결제는 안전한 Toss Payments 시스템을 통해 처리됩니다.'
        }
      ]
    },
    {
      category: '기능',
      questions: [
        {
          q: '비교 도구는 어떻게 사용하나요?',
          a: '서비스 비교 페이지에서 최대 4개의 BI 서비스를 선택하여 나란히 비교할 수 있습니다. 가격, 주요 기능, 장단점, 사용자 평점 등을 한눈에 확인하실 수 있습니다.'
        },
        {
          q: '데이터를 내보낼 수 있나요?',
          a: '프리미엄 및 엔터프라이즈 플랜에서는 PDF, CSV, Excel 형식으로 데이터를 내보낼 수 있습니다. 내보낸 데이터는 프레젠테이션이나 내부 보고서에 바로 활용하실 수 있습니다.'
        },
        {
          q: '리포트를 저장할 수 있나요?',
          a: '네, 프리미엄 이상 플랜에서는 분석한 리포트를 저장하고 나중에 다시 불러올 수 있습니다. 저장된 리포트는 대시보드의 "저장된 리포트" 메뉴에서 관리할 수 있습니다.'
        },
        {
          q: '데이터는 얼마나 자주 업데이트되나요?',
          a: '시장 데이터는 분기별로 업데이트되며, 서비스 가격 및 기능 정보는 월 1회 업데이트됩니다. 중요한 시장 변화가 있을 경우 즉시 반영합니다.'
        }
      ]
    },
    {
      category: '계정 및 보안',
      questions: [
        {
          q: '비밀번호를 잊어버렸어요.',
          a: '로그인 페이지에서 "비밀번호 찾기"를 클릭하시면 가입하신 이메일로 비밀번호 재설정 링크를 보내드립니다. 링크를 통해 새로운 비밀번호를 설정하실 수 있습니다.'
        },
        {
          q: '내 정보는 안전한가요?',
          a: '네, 모든 개인정보는 암호화되어 안전하게 저장되며, 산업 표준 보안 프로토콜(SSL/TLS)을 사용합니다. 자세한 내용은 개인정보 처리방침을 참고해주세요.'
        },
        {
          q: '계정을 삭제하려면 어떻게 하나요?',
          a: '설정 페이지의 "계정 관리" 섹션에서 계정을 삭제할 수 있습니다. 계정 삭제 시 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.'
        }
      ]
    },
    {
      category: '기술 지원',
      questions: [
        {
          q: '어떤 브라우저를 지원하나요?',
          a: 'Chrome, Firefox, Safari, Edge 등 최신 버전의 주요 브라우저를 모두 지원합니다. 최적의 환경을 위해 최신 버전 사용을 권장합니다.'
        },
        {
          q: '모바일에서도 사용할 수 있나요?',
          a: '네, 반응형 웹 디자인으로 모바일, 태블릿, 데스크톱 모든 기기에서 최적화된 환경으로 이용하실 수 있습니다. PWA(Progressive Web App) 형태로 홈 화면에 추가하여 앱처럼 사용하실 수도 있습니다.'
        },
        {
          q: '문제가 발생했을 때 어떻게 하나요?',
          a: '고객센터의 문의하기 폼을 통해 문의하시거나 support@dashboardmarkethub.com으로 이메일을 보내주세요. 프리미엄 이상 플랜 고객은 우선 지원을 받으실 수 있습니다.'
        }
      ]
    }
  ];

  const filteredFAQs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      item =>
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  let globalIndex = 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              <HelpCircle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            자주 묻는 질문
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            궁금하신 점을 빠르게 찾아보세요
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="질문을 검색하세요..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-8">
          {filteredFAQs.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {category.category}
              </h2>
              <div className="space-y-3">
                {category.questions.map((item) => {
                  const currentIndex = globalIndex++;
                  return (
                    <div
                      key={currentIndex}
                      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleQuestion(currentIndex)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <span className="font-semibold text-gray-900 dark:text-white pr-4">
                          {item.q}
                        </span>
                        {openIndex === currentIndex ? (
                          <ChevronUp className="w-5 h-5 text-purple-600 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      {openIndex === currentIndex && (
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {item.a}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
              검색 결과가 없습니다.
            </p>
            <p className="text-gray-500 dark:text-gray-500">
              다른 키워드로 검색해보시거나 고객센터에 문의해주세요.
            </p>
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-12 bg-purple-50 dark:bg-purple-900/20 rounded-lg p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            찾으시는 답변이 없나요?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            고객센터로 문의하시면 신속하게 답변해드리겠습니다.
          </p>
          <a
            href="#contact"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            문의하기
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
