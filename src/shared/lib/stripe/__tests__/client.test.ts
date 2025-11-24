/**
 * Stripe Client Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getStripe, getPriceId, STRIPE_PRICE_IDS } from '../client';

// Mock Stripe
vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn(() => Promise.resolve({
    id: 'stripe_mock',
    redirectToCheckout: vi.fn(),
  })),
}));

describe('Stripe Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getStripe', () => {
    it('should return Stripe instance', async () => {
      const stripe = await getStripe();
      expect(stripe).toBeTruthy();
    });

    it('should cache Stripe instance', async () => {
      const stripe1 = await getStripe();
      const stripe2 = await getStripe();
      expect(stripe1).toBe(stripe2);
    });
  });

  describe('getPriceId', () => {
    it('should return correct price ID for basic monthly', () => {
      const priceId = getPriceId('basic', 'monthly');
      expect(priceId).toBe(STRIPE_PRICE_IDS.basic.monthly);
    });

    it('should return correct price ID for basic yearly', () => {
      const priceId = getPriceId('basic', 'yearly');
      expect(priceId).toBe(STRIPE_PRICE_IDS.basic.yearly);
    });

    it('should return correct price ID for professional monthly', () => {
      const priceId = getPriceId('professional', 'monthly');
      expect(priceId).toBe(STRIPE_PRICE_IDS.professional.monthly);
    });

    it('should return correct price ID for professional yearly', () => {
      const priceId = getPriceId('professional', 'yearly');
      expect(priceId).toBe(STRIPE_PRICE_IDS.professional.yearly);
    });

    it('should return correct price ID for enterprise monthly', () => {
      const priceId = getPriceId('enterprise', 'monthly');
      expect(priceId).toBe(STRIPE_PRICE_IDS.enterprise.monthly);
    });

    it('should return correct price ID for enterprise yearly', () => {
      const priceId = getPriceId('enterprise', 'yearly');
      expect(priceId).toBe(STRIPE_PRICE_IDS.enterprise.yearly);
    });

    it('should return empty string for invalid tier', () => {
      const priceId = getPriceId('invalid', 'monthly');
      expect(priceId).toBe('');
    });
  });

  describe('STRIPE_PRICE_IDS', () => {
    it('should have all required price IDs', () => {
      expect(STRIPE_PRICE_IDS).toHaveProperty('basic');
      expect(STRIPE_PRICE_IDS).toHaveProperty('professional');
      expect(STRIPE_PRICE_IDS).toHaveProperty('enterprise');

      expect(STRIPE_PRICE_IDS.basic).toHaveProperty('monthly');
      expect(STRIPE_PRICE_IDS.basic).toHaveProperty('yearly');
    });
  });
});
