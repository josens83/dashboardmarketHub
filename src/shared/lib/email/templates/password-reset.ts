/**
 * Password Reset Email Template
 * Sent when user requests password reset
 */

export interface PasswordResetEmailData {
  userName: string;
  resetUrl: string;
  expiresIn: string; // e.g., "1 hour", "24 hours"
}

export function generatePasswordResetEmail(data: PasswordResetEmailData): string {
  const { userName, resetUrl, expiresIn } = data;

  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>비밀번호 재설정</title>
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
                비밀번호 재설정 🔒
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
                비밀번호 재설정 요청을 받았습니다. 아래 버튼을 클릭하여 새로운 비밀번호를 설정하세요.
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  비밀번호 재설정하기
                </a>
              </div>

              <p style="margin: 20px 0; color: #6b7280; font-size: 14px; text-align: center;">
                또는 이 링크를 복사하세요:<br>
                <a href="${resetUrl}" style="color: #7c3aed; text-decoration: underline; word-break: break-all;">${resetUrl}</a>
              </p>

              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 25px 0; border-radius: 4px;">
                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                  ⚠️ <strong>보안 알림:</strong> 이 링크는 <strong>${expiresIn}</strong> 후 만료됩니다.
                </p>
              </div>

              <p style="margin: 20px 0 0; color: #374151; font-size: 15px; line-height: 1.6;">
                비밀번호 재설정을 요청하지 않으셨다면, 이 이메일을 무시하셔도 됩니다. 계정은 안전하게 보호됩니다.
              </p>

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
                보안상의 이유로 이 이메일에 직접 회신하지 마세요.
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
