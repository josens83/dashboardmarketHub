/**
 * Welcome Email Template
 * Sent when a new user signs up
 */

export interface WelcomeEmailData {
  userName: string;
  verificationUrl?: string;
}

export function generateWelcomeEmail(data: WelcomeEmailData): string {
  const { userName, verificationUrl } = data;

  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard Market Hub에 오신 것을 환영합니다!</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                환영합니다! 🎉
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                안녕하세요 <strong>${userName}</strong>님,
              </p>

              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Dashboard Market Hub에 가입해 주셔서 감사합니다! 이제 BI 대시보드 시장의 모든 인사이트를 한눈에 확인하실 수 있습니다.
              </p>

              <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="margin: 0 0 15px; color: #1f2937; font-size: 18px;">시작하기 전에:</h3>
                <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 15px; line-height: 1.8;">
                  <li>대시보드에서 실시간 시장 데이터 확인</li>
                  <li>서비스 비교 분석 도구 활용</li>
                  <li>커스텀 리포트 생성 및 저장</li>
                  <li>산업별 트렌드 분석</li>
                </ul>
              </div>

              ${verificationUrl ? `
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  이메일 인증하기
                </a>
              </div>
              <p style="margin: 20px 0 0; color: #6b7280; font-size: 14px; text-align: center;">
                또는 이 링크를 복사하세요: <a href="${verificationUrl}" style="color: #7c3aed; text-decoration: underline;">${verificationUrl}</a>
              </p>
              ` : ''}

              <p style="margin: 30px 0 0; color: #374151; font-size: 16px; line-height: 1.6;">
                궁금한 점이 있으시면 언제든 문의해 주세요!
              </p>

              <p style="margin: 20px 0 0; color: #374151; font-size: 16px;">
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
                이 이메일은 Dashboard Market Hub 계정 생성 시 자동으로 발송됩니다.
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
