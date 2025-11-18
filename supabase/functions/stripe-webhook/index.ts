/**
 * Supabase Edge Function: Stripe Webhook Handler
 *
 * Handles Stripe webhook events to update subscription status
 *
 * Environment variables required:
 * - STRIPE_SECRET_KEY
 * - STRIPE_WEBHOOK_SECRET
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

  // Log payment
  await supabase.from('payment_history').insert({
    stripe_customer_id: customerId,
    amount: invoice.amount_paid / 100,
    currency: invoice.currency,
    status: 'succeeded',
    invoice_id: invoice.id,
    paid_at: new Date(invoice.created * 1000).toISOString(),
  });

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
