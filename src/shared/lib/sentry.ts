/**
 * Sentry Error Tracking Configuration
 * Monitors production errors and performance
 */

import * as Sentry from '@sentry/react';

export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  const environment = import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE;

  // Only initialize if DSN is provided
  if (!dsn) {
    console.warn('Sentry DSN not configured. Error tracking is disabled.');
    return;
  }

  Sentry.init({
    dsn,
    environment,

    // Set sample rates
    tracesSampleRate: environment === 'production' ? 0.1 : 1.0, // 10% in prod, 100% in dev
    replaysSessionSampleRate: 0.1, // 10% of sessions
    replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

    // Integrations are automatically included in @sentry/react
    // BrowserTracing and Replay are included by default

    // Filter out sensitive data
    beforeSend(event, hint) {
      // Remove sensitive information from URLs and data
      if (event.request?.url) {
        event.request.url = event.request.url.replace(/token=[^&]+/g, 'token=[REDACTED]');
        event.request.url = event.request.url.replace(/api_key=[^&]+/g, 'api_key=[REDACTED]');
      }

      // Filter out low-priority errors
      const error = hint.originalException;
      if (error && typeof error === 'object' && 'message' in error) {
        const message = String(error.message).toLowerCase();

        // Ignore known non-critical errors
        if (
          message.includes('network request failed') ||
          message.includes('failed to fetch') ||
          message.includes('load failed') ||
          message.includes('cancelled')
        ) {
          return null; // Don't send to Sentry
        }
      }

      return event;
    },

    // Ignore certain errors
    ignoreErrors: [
      // Browser extensions
      'top.GLOBALS',
      'chrome-extension://',
      'moz-extension://',

      // Network errors (often not actionable)
      'NetworkError',
      'Network request failed',
      'Failed to fetch',

      // ResizeObserver loop errors (known browser issue)
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
    ],
  });

  console.log(`Sentry initialized (${environment})`);
}

/**
 * Manually capture an exception
 */
export function captureException(error: Error, context?: Record<string, unknown>) {
  Sentry.captureException(error, {
    extra: context,
  });
}

/**
 * Manually capture a message
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  Sentry.captureMessage(message, level);
}

/**
 * Set user context for error tracking
 */
export function setUser(user: { id: string; email?: string; username?: string } | null) {
  Sentry.setUser(user);
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(message: string, data?: Record<string, unknown>) {
  Sentry.addBreadcrumb({
    message,
    data,
    level: 'info',
    timestamp: Date.now() / 1000,
  });
}

/**
 * Start a performance span (replaces startTransaction in newer Sentry versions)
 */
export function startSpan<T>(name: string, op: string, callback: () => T): T {
  return Sentry.startSpan({ name, op }, callback);
}

export { Sentry };
