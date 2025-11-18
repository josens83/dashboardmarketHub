/**
 * Team Invitation Email Template
 * Sent when user is invited to join a team
 */

export interface TeamInvitationEmailData {
  inviteeName: string;
  inviterName: string;
  teamName: string;
  role: string;
  invitationUrl: string;
  expiresIn: string;
}

export function generateTeamInvitationEmail(data: TeamInvitationEmailData): string {
  const { inviteeName, inviterName, teamName, role, invitationUrl, expiresIn } = data;

  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>팀 초대</title>
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
                팀 초대 👥
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                안녕하세요${inviteeName ? ` <strong>${inviteeName}</strong>님` : ''},
              </p>

              <p style="margin: 0 0 30px; color: #374151; font-size: 16px; line-height: 1.6;">
                <strong>${inviterName}</strong>님이 <strong>${teamName}</strong> 팀에 초대했습니다!
              </p>

              <!-- Invitation Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; overflow: hidden; margin-bottom: 25px;">
                <tr>
                  <td style="padding: 25px;">
                    <table width="100%">
                      <tr>
                        <td style="color: #6b7280; font-size: 14px; padding-bottom: 10px;">팀 이름</td>
                        <td style="color: #1f2937; font-size: 16px; font-weight: 600; text-align: right;">${teamName}</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding: 10px 0;"></td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; font-size: 14px; padding-bottom: 10px;">초대자</td>
                        <td style="color: #1f2937; font-size: 16px; font-weight: 600; text-align: right;">${inviterName}</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding: 10px 0;"></td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; font-size: 14px; padding-bottom: 10px;">역할</td>
                        <td style="color: #7c3aed; font-size: 16px; font-weight: 600; text-align: right;">${role}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${invitationUrl}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  초대 수락하기
                </a>
              </div>

              <p style="margin: 20px 0; color: #6b7280; font-size: 14px; text-align: center;">
                또는 이 링크를 복사하세요:<br>
                <a href="${invitationUrl}" style="color: #7c3aed; text-decoration: underline; word-break: break-all;">${invitationUrl}</a>
              </p>

              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 25px 0; border-radius: 4px;">
                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                  ⏰ 이 초대는 <strong>${expiresIn}</strong> 후 만료됩니다.
                </p>
              </div>

              <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <h3 style="margin: 0 0 15px; color: #1f2937; font-size: 16px;">팀 멤버로 참여하면:</h3>
                <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 15px; line-height: 1.8;">
                  <li>팀과 데이터 및 리포트 공유</li>
                  <li>협업 도구 및 기능 사용</li>
                  <li>실시간 업데이트 및 알림 수신</li>
                  <li>역할별 권한 관리</li>
                </ul>
              </div>

              <p style="margin: 20px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                이 초대를 받은 적이 없다면 이 이메일을 무시하셔도 됩니다.
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
                이 초대는 ${inviterName}님이 보낸 것입니다.
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
