/**
 * Stripe Client Configuration
 * Frontend Stripe integration
 */

import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

/**
 * Get or initialize Stripe instance
 */
export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

    if (!publishableKey) {
      console.warn('Stripe publishable key not found. Payment features will not work.');
      return Promise.resolve(null);
    }

    stripePromise = loadStripe(publishableKey);
  }

  return stripePromise;
};

/**
 * Create Stripe Checkout Session
 * This should be called from the backend, but for demo we'll use Supabase Edge Functions
 */
export interface CreateCheckoutSessionParams {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
}

/**
 * Stripe Price IDs for each plan
 * These should match your Stripe Dashboard prices
 */
export const STRIPE_PRICE_IDS = {
  basic: {
    monthly: import.meta.env.VITE_STRIPE_PRICE_BASIC_MONTHLY || 'price_basic_monthly',
    yearly: import.meta.env.VITE_STRIPE_PRICE_BASIC_YEARLY || 'price_basic_yearly',
  },
  professional: {
    monthly: import.meta.env.VITE_STRIPE_PRICE_PRO_MONTHLY || 'price_pro_monthly',
    yearly: import.meta.env.VITE_STRIPE_PRICE_PRO_YEARLY || 'price_pro_yearly',
  },
  enterprise: {
    monthly: import.meta.env.VITE_STRIPE_PRICE_ENT_MONTHLY || 'price_ent_monthly',
    yearly: import.meta.env.VITE_STRIPE_PRICE_ENT_YEARLY || 'price_ent_yearly',
  },
} as const;

/**
 * Get price ID for a subscription tier and billing period
 */
export const getPriceId = (tier: string, period: 'monthly' | 'yearly'): string => {
  const tierPrices = STRIPE_PRICE_IDS[tier as keyof typeof STRIPE_PRICE_IDS];
  return tierPrices?.[period] || '';
};
