/**
 * Email Client - Resend Integration
 * Handles all email sending operations
 */

export interface EmailParams {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

export interface SendEmailResponse {
  id?: string;
  error?: string;
}

/**
 * Send transactional email via Supabase Edge Function
 * This calls the Resend API server-side for security
 */
export async function sendEmail(params: EmailParams): Promise<SendEmailResponse> {
  try {
    // Import supabase dynamically to avoid circular dependencies
    const { supabase } = await import('@/shared/lib/supabase');

    const { data, error } = await supabase.functions.invoke('send-email', {
      body: params,
    });

    if (error) {
      throw new Error(error.message || 'Failed to send email');
    }

    if (!data.success) {
      throw new Error(data.error || 'Email sending failed');
    }

    return { id: data.id };
  } catch (error: any) {
    console.error('Send email error:', error);
    return { error: error.message };
  }
}

/**
 * Email template IDs
 */
export const EMAIL_TEMPLATES = {
  WELCOME: 'welcome',
  PASSWORD_RESET: 'password-reset',
  EMAIL_VERIFICATION: 'email-verification',
  PAYMENT_RECEIPT: 'payment-receipt',
  SUBSCRIPTION_CONFIRMATION: 'subscription-confirmation',
  SUBSCRIPTION_CANCELLED: 'subscription-cancelled',
  TEAM_INVITATION: 'team-invitation',
  TRIAL_ENDING: 'trial-ending',
} as const;

export type EmailTemplate = typeof EMAIL_TEMPLATES[keyof typeof EMAIL_TEMPLATES];
