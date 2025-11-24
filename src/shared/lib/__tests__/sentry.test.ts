/**
 * Sentry Utilities Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { captureException, captureMessage, setUser, addBreadcrumb } from '../sentry';
import * as Sentry from '@sentry/react';

// Mock Sentry
vi.mock('@sentry/react', () => ({
  init: vi.fn(),
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  setUser: vi.fn(),
  addBreadcrumb: vi.fn(),
  startSpan: vi.fn((_, callback) => callback()),
}));

describe('Sentry Utilities', () => {
  describe('captureException', () => {
    it('should capture exception', () => {
      const error = new Error('Test error');
      captureException(error);

      expect(Sentry.captureException).toHaveBeenCalledWith(error, {
        extra: undefined,
      });
    });

    it('should capture exception with context', () => {
      const error = new Error('Test error');
      const context = { userId: '123', action: 'test' };

      captureException(error, context);

      expect(Sentry.captureException).toHaveBeenCalledWith(error, {
        extra: context,
      });
    });
  });

  describe('captureMessage', () => {
    it('should capture message with default level', () => {
      const message = 'Test message';
      captureMessage(message);

      expect(Sentry.captureMessage).toHaveBeenCalledWith(message, 'info');
    });

    it('should capture message with custom level', () => {
      const message = 'Warning message';
      captureMessage(message, 'warning');

      expect(Sentry.captureMessage).toHaveBeenCalledWith(message, 'warning');
    });
  });

  describe('setUser', () => {
    it('should set user', () => {
      const user = { id: '123', email: 'test@example.com' };
      setUser(user);

      expect(Sentry.setUser).toHaveBeenCalledWith(user);
    });

    it('should clear user', () => {
      setUser(null);

      expect(Sentry.setUser).toHaveBeenCalledWith(null);
    });
  });

  describe('addBreadcrumb', () => {
    it('should add breadcrumb', () => {
      const message = 'User clicked button';
      addBreadcrumb(message);

      expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({
        message,
        data: undefined,
        level: 'info',
        timestamp: expect.any(Number),
      });
    });

    it('should add breadcrumb with data', () => {
      const message = 'User action';
      const data = { button: 'submit', page: 'checkout' };
      addBreadcrumb(message, data);

      expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({
        message,
        data,
        level: 'info',
        timestamp: expect.any(Number),
      });
    });
  });
});
