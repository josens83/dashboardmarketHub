/**
 * FeatureLock Component Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import FeatureLock from '../FeatureLock';

// Mock the Auth context
const mockCanUseFeature = vi.fn();

vi.mock('@/shared/contexts/AuthContext', () => ({
  useAuth: () => ({
    canUseFeature: mockCanUseFeature,
  }),
}));

// Mock PricingModal component
vi.mock('@/features/subscription', () => ({
  PricingModal: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="pricing-modal">Pricing Modal</div> : null,
}));

describe('FeatureLock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children when user has access to feature', () => {
    mockCanUseFeature.mockReturnValue(true);

    render(
      <FeatureLock feature="premium_charts">
        <div data-testid="protected-content">Premium Content</div>
      </FeatureLock>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.queryByText('프리미엄 기능')).not.toBeInTheDocument();
  });

  it('shows lock screen when user does not have access', () => {
    mockCanUseFeature.mockReturnValue(false);

    render(
      <FeatureLock feature="premium_charts">
        <div data-testid="protected-content">Premium Content</div>
      </FeatureLock>
    );

    // Content should be blurred (still in DOM but not accessible)
    expect(screen.getByText('프리미엄 기능')).toBeInTheDocument();
    expect(screen.getByText('이 기능은 프리미엄 요금제 이상에서 사용 가능합니다.')).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    mockCanUseFeature.mockReturnValue(false);

    render(
      <FeatureLock
        feature="premium_charts"
        fallback={<div data-testid="custom-fallback">Custom Fallback</div>}
      >
        <div data-testid="protected-content">Premium Content</div>
      </FeatureLock>
    );

    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
    expect(screen.queryByText('프리미엄 기능')).not.toBeInTheDocument();
  });

  it('hides upgrade button when showUpgrade is false', () => {
    mockCanUseFeature.mockReturnValue(false);

    render(
      <FeatureLock feature="premium_charts" showUpgrade={false}>
        <div>Premium Content</div>
      </FeatureLock>
    );

    expect(screen.getByText('프리미엄 기능')).toBeInTheDocument();
    expect(screen.queryByText('업그레이드')).not.toBeInTheDocument();
  });
});
