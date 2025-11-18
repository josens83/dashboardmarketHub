/**
 * Unified Error Handler
 * 모든 에러를 일관되게 처리하는 유틸리티
 */

import { PostgrestError } from '@supabase/supabase-js';

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export interface ErrorResponse {
  message: string;
  code?: string;
  statusCode?: number;
  details?: any;
}

/**
 * Supabase 에러를 앱 에러로 변환
 */
export function handleSupabaseError(error: PostgrestError | Error): AppError {
  if ('code' in error && 'message' in error) {
    const pgError = error as PostgrestError;
    return new AppError(
      getUserFriendlyMessage(pgError.code, pgError.message),
      pgError.code,
      getStatusCode(pgError.code),
      pgError.details
    );
  }

  return new AppError(error.message || '알 수 없는 오류가 발생했습니다.');
}

/**
 * 에러 코드를 HTTP 상태 코드로 변환
 */
function getStatusCode(code: string): number {
  const codeMap: Record<string, number> = {
    '23505': 409, // Unique violation
    '23503': 404, // Foreign key violation
    '42501': 403, // Insufficient privilege
    '42P01': 404, // Undefined table
    'PGRST116': 404, // Not found
    'PGRST301': 401, // Unauthorized
  };

  return codeMap[code] || 500;
}

/**
 * 사용자 친화적인 에러 메시지로 변환
 */
function getUserFriendlyMessage(code: string, message: string): string {
  const messageMap: Record<string, string> = {
    '23505': '이미 존재하는 데이터입니다.',
    '23503': '관련된 데이터를 찾을 수 없습니다.',
    '42501': '이 작업을 수행할 권한이 없습니다.',
    '42P01': '요청한 리소스를 찾을 수 없습니다.',
    'PGRST116': '데이터를 찾을 수 없습니다.',
    'PGRST301': '로그인이 필요합니다.',
  };

  return messageMap[code] || message || '오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
}

/**
 * 에러를 로깅하고 사용자에게 표시할 메시지 반환
 */
export function handleError(error: unknown): ErrorResponse {
  console.error('[Error Handler]', error);

  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    // Supabase 에러인지 확인
    if ('code' in error) {
      const appError = handleSupabaseError(error);
      return {
        message: appError.message,
        code: appError.code,
        statusCode: appError.statusCode,
        details: appError.details,
      };
    }

    return {
      message: error.message,
      statusCode: 500,
    };
  }

  return {
    message: '알 수 없는 오류가 발생했습니다.',
    statusCode: 500,
  };
}

/**
 * 에러 로깅 (프로덕션에서는 Sentry 등으로 전송)
 */
export function logError(error: unknown, context?: Record<string, any>): void {
  const errorInfo = handleError(error);

  // 개발 환경
  if (import.meta.env.DEV) {
    console.group('🔴 Error Log');
    console.error('Message:', errorInfo.message);
    if (errorInfo.code) console.error('Code:', errorInfo.code);
    if (errorInfo.statusCode) console.error('Status:', errorInfo.statusCode);
    if (context) console.error('Context:', context);
    if (errorInfo.details) console.error('Details:', errorInfo.details);
    console.groupEnd();
  }

  // 프로덕션 환경 - Sentry 등으로 전송
  if (import.meta.env.PROD && import.meta.env.VITE_ERROR_TRACKING_ENDPOINT) {
    // TODO: Sentry.captureException(error, { extra: context });
  }
}

/**
 * 네트워크 에러 체크
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes('fetch') ||
      error.message.includes('network') ||
      error.message.includes('Failed to fetch')
    );
  }
  return false;
}

/**
 * 인증 에러 체크
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof AppError) {
    return error.statusCode === 401;
  }
  if (error instanceof Error && 'code' in error) {
    return (error as any).code === 'PGRST301';
  }
  return false;
}
