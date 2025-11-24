/**
 * Error Handler Utilities Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  AppError,
  handleSupabaseError,
  handleError,
  logError,
  isNetworkError,
  isAuthError,
} from '../error-handler';
import type { PostgrestError } from '@supabase/supabase-js';

describe('AppError', () => {
  it('should create AppError with message only', () => {
    const error = new AppError('Test error');
    expect(error.message).toBe('Test error');
    expect(error.name).toBe('AppError');
    expect(error.code).toBeUndefined();
    expect(error.statusCode).toBeUndefined();
  });

  it('should create AppError with all properties', () => {
    const error = new AppError('Test error', 'ERR001', 400, { detail: 'info' });
    expect(error.message).toBe('Test error');
    expect(error.code).toBe('ERR001');
    expect(error.statusCode).toBe(400);
    expect(error.details).toEqual({ detail: 'info' });
  });
});

describe('handleSupabaseError', () => {
  it('should handle PostgrestError with unique violation', () => {
    const pgError: PostgrestError = {
      message: 'duplicate key value',
      code: '23505',
      details: 'Key already exists',
      hint: '',
    };

    const appError = handleSupabaseError(pgError);
    expect(appError).toBeInstanceOf(AppError);
    expect(appError.message).toBe('이미 존재하는 데이터입니다.');
    expect(appError.code).toBe('23505');
    expect(appError.statusCode).toBe(409);
  });

  it('should handle PostgrestError with foreign key violation', () => {
    const pgError: PostgrestError = {
      message: 'foreign key constraint',
      code: '23503',
      details: '',
      hint: '',
    };

    const appError = handleSupabaseError(pgError);
    expect(appError.message).toBe('관련된 데이터를 찾을 수 없습니다.');
    expect(appError.statusCode).toBe(404);
  });

  it('should handle PostgrestError with insufficient privilege', () => {
    const pgError: PostgrestError = {
      message: 'permission denied',
      code: '42501',
      details: '',
      hint: '',
    };

    const appError = handleSupabaseError(pgError);
    expect(appError.message).toBe('이 작업을 수행할 권한이 없습니다.');
    expect(appError.statusCode).toBe(403);
  });

  it('should handle unknown PostgrestError code', () => {
    const pgError: PostgrestError = {
      message: 'Unknown error',
      code: 'UNKNOWN',
      details: '',
      hint: '',
    };

    const appError = handleSupabaseError(pgError);
    expect(appError.message).toBe('Unknown error');
    expect(appError.statusCode).toBe(500);
  });

  it('should handle generic Error', () => {
    const error = new Error('Generic error message');
    const appError = handleSupabaseError(error);
    expect(appError.message).toBe('Generic error message');
    expect(appError.code).toBeUndefined();
    expect(appError.statusCode).toBeUndefined();
  });
});

describe('handleError', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should handle AppError', () => {
    const error = new AppError('App error', 'ERR001', 400);
    const response = handleError(error);

    expect(response.message).toBe('App error');
    expect(response.code).toBe('ERR001');
    expect(response.statusCode).toBe(400);
  });

  it('should handle Error with code (Supabase error)', () => {
    const error = Object.assign(new Error('Supabase error'), {
      code: '23505',
    });

    const response = handleError(error);
    expect(response.message).toBe('이미 존재하는 데이터입니다.');
    expect(response.code).toBe('23505');
    expect(response.statusCode).toBe(409);
  });

  it('should handle generic Error', () => {
    const error = new Error('Generic error');
    const response = handleError(error);

    expect(response.message).toBe('Generic error');
    expect(response.statusCode).toBe(500);
  });

  it('should handle unknown error type', () => {
    const response = handleError('string error');

    expect(response.message).toBe('알 수 없는 오류가 발생했습니다.');
    expect(response.statusCode).toBe(500);
  });

  it('should handle null error', () => {
    const response = handleError(null);

    expect(response.message).toBe('알 수 없는 오류가 발생했습니다.');
    expect(response.statusCode).toBe(500);
  });
});

describe('logError', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'group').mockImplementation(() => {});
    vi.spyOn(console, 'groupEnd').mockImplementation(() => {});
  });

  it('should log error with context', () => {
    const error = new Error('Test error');
    const context = { userId: '123', action: 'test' };

    logError(error, context);

    // In dev mode, should call console methods
    expect(console.group).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
    expect(console.groupEnd).toHaveBeenCalled();
  });

  it('should log AppError', () => {
    const error = new AppError('App error', 'ERR001', 400);

    logError(error);

    expect(console.group).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });
});

describe('isNetworkError', () => {
  it('should identify fetch errors', () => {
    const error = new Error('Failed to fetch');
    expect(isNetworkError(error)).toBe(true);
  });

  it('should identify network errors', () => {
    const error = new Error('network error occurred');
    expect(isNetworkError(error)).toBe(true);
  });

  it('should identify fetch-related errors', () => {
    const error = new Error('fetch failed');
    expect(isNetworkError(error)).toBe(true);
  });

  it('should return false for non-network errors', () => {
    const error = new Error('Database error');
    expect(isNetworkError(error)).toBe(false);
  });

  it('should return false for non-Error types', () => {
    expect(isNetworkError('string')).toBe(false);
    expect(isNetworkError(null)).toBe(false);
    expect(isNetworkError(undefined)).toBe(false);
  });
});

describe('isAuthError', () => {
  it('should identify AppError with 401 status', () => {
    const error = new AppError('Unauthorized', 'AUTH_ERR', 401);
    expect(isAuthError(error)).toBe(true);
  });

  it('should identify Supabase auth error', () => {
    const error = Object.assign(new Error('Auth error'), {
      code: 'PGRST301',
    });
    expect(isAuthError(error)).toBe(true);
  });

  it('should return false for non-auth errors', () => {
    const error = new AppError('Not found', 'ERR404', 404);
    expect(isAuthError(error)).toBe(false);
  });

  it('should return false for generic errors', () => {
    const error = new Error('Generic error');
    expect(isAuthError(error)).toBe(false);
  });

  it('should return false for non-Error types', () => {
    expect(isAuthError('string')).toBe(false);
    expect(isAuthError(null)).toBe(false);
  });
});
