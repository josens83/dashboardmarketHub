/**
 * Supabase Edge Function: Stripe Webhook Handler
 *
 * Handles Stripe webhook events to update subscription status and send emails
 *
 * Environment variables required:
 * - STRIPE_SECRET_KEY
 * - STRIPE_WEBHOOK_SECRET
 * - RESEND_API_KEY
 * - RESEND_FROM_EMAIL
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const RESEND_FROM_EMAIL = Deno.env.get('RESEND_FROM_EMAIL') || 'Dashboard Market Hub <noreply@dashboardmarkethub.com>';

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

  if (!signature || !webhookSecret) {
    return new Response('Webhook Error: Missing signature or secret', { status: 400 });
  }

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    console.log(`Received event: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Log webhook event
    await supabase.from('webhooks').insert({
      provider: 'stripe',
      event_type: event.type,
      event_id: event.id,
      payload: event.data.object,
      processed_at: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }
});

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId || session.client_reference_id;
  const tier = session.metadata?.tier;

  if (!userId) {
    console.error('No user ID in checkout session');
    return;
  }

  // Update user subscription
  const { error } = await supabase
    .from('users')
    .update({
      subscription_tier: tier,
      stripe_customer_id: session.customer as string,
    })
    .eq('id', userId);

  if (error) {
    console.error('Error updating user:', error);
    throw error;
  }

  // Create subscription record
  await supabase.from('subscriptions').insert({
    user_id: userId,
    tier,
    status: 'active',
    stripe_customer_id: session.customer as string,
    stripe_subscription_id: session.subscription as string,
    current_period_start: new Date().toISOString(),
    current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  });

  console.log(`Checkout completed for user ${userId}, tier: ${tier}`);
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;

  if (!userId) {
    console.error('No user ID in subscription metadata');
    return;
  }

  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }

  console.log(`Subscription updated for user ${userId}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;

  if (!userId) {
    console.error('No user ID in subscription metadata');
    return;
  }

  // Update user back to free tier
  await supabase
    .from('users')
    .update({ subscription_tier: 'free' })
    .eq('id', userId);

  // Update subscription status
  await supabase
    .from('subscriptions')
    .update({ status: 'canceled' })
    .eq('stripe_subscription_id', subscription.id);

  console.log(`Subscription deleted for user ${userId}`);
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  const subscriptionId = invoice.subscription as string;

  // Log payment
  await supabase.from('payment_history').insert({
    stripe_customer_id: customerId,
    amount: invoice.amount_paid / 100,
    currency: invoice.currency,
    status: 'succeeded',
    invoice_id: invoice.id,
    paid_at: new Date(invoice.created * 1000).toISOString(),
  });

  // Get user and subscription info for email
  try {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*, users(*)')
      .eq('stripe_subscription_id', subscriptionId)
      .single();

    if (subscription && subscription.users && RESEND_API_KEY) {
      const user = subscription.users;
      const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);

      // Determine billing period from price
      const billingPeriod = stripeSubscription.items.data[0]?.price.recurring?.interval === 'year' ? 'yearly' : 'monthly';

      // Send payment receipt email
      await sendPaymentReceiptEmail({
        to: user.email,
        userName: user.name,
        planName: subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1),
        amount: invoice.amount_paid / 100,
        currency: invoice.currency.toUpperCase(),
        billingPeriod,
        invoiceUrl: invoice.hosted_invoice_url || undefined,
        nextBillingDate: new Date(stripeSubscription.current_period_end * 1000).toLocaleDateString('ko-KR'),
        trialEndDate: stripeSubscription.trial_end
          ? new Date(stripeSubscription.trial_end * 1000).toLocaleDateString('ko-KR')
          : undefined,
      });
    }
  } catch (emailError) {
    console.error('Error sending payment receipt email:', emailError);
    // Don't throw - payment was successful, email failure is secondary
  }

  console.log(`Invoice paid: ${invoice.id}`);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  // Log failed payment
  await supabase.from('payment_history').insert({
    stripe_customer_id: customerId,
    amount: invoice.amount_due / 100,
    currency: invoice.currency,
    status: 'failed',
    invoice_id: invoice.id,
    paid_at: new Date(invoice.created * 1000).toISOString(),
  });

  // TODO: Send notification email about payment failure

  console.log(`Invoice payment failed: ${invoice.id}`);
}

// Email helper functions
interface PaymentReceiptData {
  to: string;
  userName: string;
  planName: string;
  amount: number;
  currency: string;
  billingPeriod: 'monthly' | 'yearly';
  invoiceUrl?: string;
  nextBillingDate: string;
  trialEndDate?: string;
}

async function sendPaymentReceiptEmail(data: PaymentReceiptData) {
  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured, skipping email');
    return;
  }

  const html = generatePaymentReceiptHTML(data);

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: RESEND_FROM_EMAIL,
      to: [data.to],
      subject: `결제 완료 - ${data.planName} 플랜`,
      html,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Resend API error: ${JSON.stringify(error)}`);
  }

  const result = await response.json();
  console.log(`Payment receipt email sent: ${result.id}`);
  return result.id;
}

function generatePaymentReceiptHTML(data: PaymentReceiptData): string {
  const formattedAmount = new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: data.currency,
  }).format(data.amount);

  return `
<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8"><title>결제 영수증</title></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
        <tr><td style="background:linear-gradient(135deg,#10b981 0%,#059669 100%);padding:40px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:bold;">결제 완료! ✅</h1>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="margin:0 0 20px;color:#374151;font-size:16px;">안녕하세요 <strong>${data.userName}</strong>님,</p>
          <p style="margin:0 0 30px;color:#374151;font-size:16px;"><strong>${data.planName}</strong> 플랜 구독이 완료되었습니다.</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;border-radius:8px;margin-bottom:25px;">
            <tr><td style="padding:20px;">
              <table width="100%"><tr><td style="color:#6b7280;font-size:14px;">플랜</td><td style="color:#1f2937;font-size:16px;font-weight:600;text-align:right;">${data.planName}</td></tr></table>
            </td></tr>
            <tr><td style="padding:20px;background-color:#f3f4f6;">
              <table width="100%"><tr><td style="color:#1f2937;font-size:16px;font-weight:700;">총 결제 금액</td><td style="color:#10b981;font-size:20px;font-weight:700;text-align:right;">${formattedAmount}</td></tr></table>
            </td></tr>
          </table>
          ${data.trialEndDate ? `<div style="background-color:#dbeafe;border-left:4px solid #3b82f6;padding:15px;margin:25px 0;border-radius:4px;"><p style="margin:0;color:#1e40af;font-size:14px;">🎉 <strong>14일 무료 체험:</strong> ${data.trialEndDate}까지 무료로 이용하실 수 있습니다.</p></div>` : ''}
          <p style="margin:20px 0;color:#374151;font-size:15px;">다음 결제일: <strong>${data.nextBillingDate}</strong></p>
          ${data.invoiceUrl ? `<div style="text-align:center;margin:30px 0;"><a href="${data.invoiceUrl}" style="display:inline-block;background-color:#6366f1;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;font-weight:600;">영수증 다운로드</a></div>` : ''}
          <p style="margin:30px 0 0;color:#374151;">감사합니다,<br><strong>Dashboard Market Hub 팀</strong></p>
        </td></tr>
        <tr><td style="background-color:#f9fafb;padding:30px;text-align:center;border-top:1px solid #e5e7eb;">
          <p style="margin:0;color:#6b7280;font-size:14px;">© 2024 Dashboard Market Hub. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
  `.trim();
}
