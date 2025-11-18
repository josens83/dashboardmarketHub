/**
 * Payment Receipt Email Template
 * Sent after successful payment
 */

export interface PaymentReceiptEmailData {
  userName: string;
  planName: string;
  amount: number;
  currency: string;
  billingPeriod: 'monthly' | 'yearly';
  invoiceUrl?: string;
  nextBillingDate: string;
  trialEndDate?: string;
}

export function generatePaymentReceiptEmail(data: PaymentReceiptEmailData): string {
  const {
    userName,
    planName,
    amount,
    currency,
    billingPeriod,
    invoiceUrl,
    nextBillingDate,
    trialEndDate
  } = data;

  const formattedAmount = new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: currency,
  }).format(amount);

  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>결제 영수증</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                결제 완료! ✅
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                안녕하세요 <strong>${userName}</strong>님,
              </p>

              <p style="margin: 0 0 30px; color: #374151; font-size: 16px; line-height: 1.6;">
                <strong>${planName}</strong> 플랜 구독이 완료되었습니다. 결제 정보를 확인해 주세요.
              </p>

              <!-- Receipt Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; overflow: hidden; margin-bottom: 25px;">
                <tr>
                  <td style="padding: 20px; border-bottom: 1px solid #e5e7eb;">
                    <table width="100%">
                      <tr>
                        <td style="color: #6b7280; font-size: 14px; padding-bottom: 5px;">플랜</td>
                        <td style="color: #1f2937; font-size: 16px; font-weight: 600; text-align: right;">${planName}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px; border-bottom: 1px solid #e5e7eb;">
                    <table width="100%">
                      <tr>
                        <td style="color: #6b7280; font-size: 14px; padding-bottom: 5px;">결제 주기</td>
                        <td style="color: #1f2937; font-size: 16px; font-weight: 600; text-align: right;">${billingPeriod === 'yearly' ? '연간' : '월간'}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px; background-color: #f3f4f6;">
                    <table width="100%">
                      <tr>
                        <td style="color: #1f2937; font-size: 16px; font-weight: 700;">총 결제 금액</td>
                        <td style="color: #10b981; font-size: 20px; font-weight: 700; text-align: right;">${formattedAmount}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              ${trialEndDate ? `
              <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 25px 0; border-radius: 4px;">
                <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.6;">
                  🎉 <strong>14일 무료 체험:</strong> ${trialEndDate}까지 무료로 이용하실 수 있습니다. 이후 자동으로 결제됩니다.
                </p>
              </div>
              ` : ''}

              <p style="margin: 20px 0; color: #374151; font-size: 15px; line-height: 1.6;">
                다음 결제일: <strong>${nextBillingDate}</strong>
              </p>

              ${invoiceUrl ? `
              <div style="text-align: center; margin: 30px 0;">
                <a href="${invoiceUrl}" style="display: inline-block; background-color: #6366f1; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 15px;">
                  영수증 다운로드
                </a>
              </div>
              ` : ''}

              <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <h3 style="margin: 0 0 15px; color: #1f2937; font-size: 16px;">이제 다음 기능을 사용하실 수 있습니다:</h3>
                <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 15px; line-height: 1.8;">
                  <li>무제한 리포트 생성 및 저장</li>
                  <li>프리미엄 데이터 내보내기</li>
                  <li>고급 분석 도구</li>
                  <li>우선 고객 지원</li>
                </ul>
              </div>

              <p style="margin: 30px 0 0; color: #374151; font-size: 16px;">
                감사합니다,<br>
                <strong>Dashboard Market Hub 팀</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                © 2024 Dashboard Market Hub. All rights reserved.
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                구독은 설정에서 언제든 관리하거나 취소할 수 있습니다.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
