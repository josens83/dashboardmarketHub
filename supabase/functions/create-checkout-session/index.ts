/**
 * Supabase Edge Function: Create Stripe Checkout Session
 *
 * This function creates a Stripe Checkout Session for subscription payments
 *
 * Environment variables required:
 * - STRIPE_SECRET_KEY
 * - VITE_APP_URL (your app URL)
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateCheckoutRequest {
  priceId: string;
  customerEmail: string;
  userId: string;
  tier: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { priceId, customerEmail, userId, tier }: CreateCheckoutRequest = await req.json();

    if (!priceId || !customerEmail || !userId) {
      throw new Error('Missing required parameters');
    }

    const appUrl = Deno.env.get('VITE_APP_URL') || 'http://localhost:5173';

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: customerEmail,
      client_reference_id: userId,
      metadata: {
        userId,
        tier,
      },
      subscription_data: {
        metadata: {
          userId,
          tier,
        },
        trial_period_days: 14, // 14-day free trial
      },
      success_url: `${appUrl}?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${appUrl}?canceled=true`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    });

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
