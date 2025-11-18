/**
 * Application Constants
 * 앱 전역에서 사용되는 상수 정의
 */

// API & Network
export const API_TIMEOUT = 30000; // 30 seconds
export const MAX_RETRIES = 3;
export const RETRY_DELAY = 1000; // 1 second

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// File Upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

// Cache
export const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Session
export const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

// Realtime
export const WEBSOCKET_RECONNECT_DELAY = 3000; // 3 seconds
export const WEBSOCKET_MAX_RETRIES = 5;

// Toast
export const TOAST_DURATION = 3000; // 3 seconds
export const TOAST_MAX_ITEMS = 5;

// Features
export const FEATURE_FLAGS = {
  ENABLE_WEBSOCKETS: true,
  ENABLE_ANALYTICS: true,
  ENABLE_COLLABORATION: true,
  ENABLE_WEBHOOKS: true,
  ENABLE_API_ACCESS: true,
} as const;

// Subscription Limits
export const SUBSCRIPTION_LIMITS = {
  FREE: {
    PDF_EXPORTS: 3,
    DATA_EXPORTS: 0,
    SAVED_REPORTS: 3,
    COMPARISONS: 2,
    TEAM_MEMBERS: 1,
  },
  BASIC: {
    PDF_EXPORTS: Infinity,
    DATA_EXPORTS: Infinity,
    SAVED_REPORTS: 50,
    COMPARISONS: Infinity,
    TEAM_MEMBERS: 1,
  },
  PROFESSIONAL: {
    PDF_EXPORTS: Infinity,
    DATA_EXPORTS: Infinity,
    SAVED_REPORTS: Infinity,
    COMPARISONS: Infinity,
    TEAM_MEMBERS: 5,
  },
  ENTERPRISE: {
    PDF_EXPORTS: Infinity,
    DATA_EXPORTS: Infinity,
    SAVED_REPORTS: Infinity,
    COMPARISONS: Infinity,
    TEAM_MEMBERS: Infinity,
  },
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  REPORTS: '/reports',
  SETTINGS: '/settings',
  ADMIN: '/admin',
  PRICING: '/pricing',
  DOCS: '/docs',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  FAQ: '/faq',
  CONTACT: '/contact',
} as const;

// External Links
export const EXTERNAL_LINKS = {
  DOCUMENTATION: 'https://docs.example.com',
  SUPPORT: 'https://support.example.com',
  STATUS: 'https://status.example.com',
  GITHUB: 'https://github.com/example',
} as const;

// App Meta
export const APP_NAME = 'Dashboard Market Hub';
export const APP_DESCRIPTION = '유료 대시보드 구축 서비스 시장 분석 플랫폼';
export const APP_VERSION = '1.0.0';
export const APP_AUTHOR = 'Dashboard Market Hub Team';
