/**
 * Supabase Edge Function: Send Email via Resend
 *
 * This function sends transactional emails using the Resend API
 *
 * Environment variables required:
 * - RESEND_API_KEY
 * - RESEND_FROM_EMAIL (e.g., "Dashboard Market Hub <noreply@yourdomain.com>")
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const RESEND_FROM_EMAIL = Deno.env.get('RESEND_FROM_EMAIL') || 'Dashboard Market Hub <noreply@dashboardmarkethub.com>';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SendEmailRequest {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    const { to, subject, html, from, replyTo }: SendEmailRequest = await req.json();

    if (!to || !subject || !html) {
      throw new Error('Missing required parameters: to, subject, html');
    }

    // Send email via Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: from || RESEND_FROM_EMAIL,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        reply_to: replyTo,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Resend API error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();

    return new Response(
      JSON.stringify({
        success: true,
        id: data.id,
        message: 'Email sent successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
