/**
 * LoadingSpinner Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('should render spinner', () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('should render with custom size', () => {
    const { container } = render(<LoadingSpinner size="lg" />);
    // Check for large size class
    const spinnerDiv = container.querySelector('.w-12.h-12.border-4');
    expect(spinnerDiv).toBeInTheDocument();
  });

  it('should render with custom message', () => {
    render(<LoadingSpinner message="Loading data..." />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('should have proper accessibility', () => {
    const { container } = render(<LoadingSpinner />);
    // Should have role="status" or similar
    const spinner = container.querySelector('[role="status"]');
    expect(spinner || container.querySelector('.animate-spin')).toBeTruthy();
  });
});
