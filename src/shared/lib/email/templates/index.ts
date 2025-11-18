/**
 * Email Templates Index
 * Exports all email templates
 */

export { generateWelcomeEmail } from './welcome';
export type { WelcomeEmailData } from './welcome';

export { generatePasswordResetEmail } from './password-reset';
export type { PasswordResetEmailData } from './password-reset';

export { generatePaymentReceiptEmail } from './payment-receipt';
export type { PaymentReceiptEmailData } from './payment-receipt';

export { generateTeamInvitationEmail } from './team-invitation';
export type { TeamInvitationEmailData } from './team-invitation';
