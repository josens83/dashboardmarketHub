/**
 * Supabase Query Hook
 * Supabase 쿼리를 위한 재사용 가능한 Hook
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/shared/lib/supabase';
import { handleError, logError } from '@/shared/utils/error-handler';
import { useToast } from './use-toast';

export interface UseSupabaseQueryOptions<T> {
  table: string;
  select?: string;
  filters?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
  enabled?: boolean; // 자동 실행 여부
  onSuccess?: (data: T[]) => void;
  onError?: (error: Error) => void;
}

export interface UseSupabaseQueryResult<T> {
  data: T[] | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useSupabaseQuery<T = any>(
  options: UseSupabaseQueryOptions<T>
): UseSupabaseQueryResult<T> {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const toast = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // @ts-ignore
      let query = supabase.from(options.table).select(options.select || '*');

      // 필터 적용
      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      // 정렬
      if (options.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending ?? true,
        });
      }

      // 제한
      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data: result, error: queryError } = await query;

      if (queryError) {
        throw queryError;
      }

      setData((result || []) as T[]);
      options.onSuccess?.((result || []) as T[]);
    } catch (err) {
      const errorInfo = handleError(err);
      const errorObj = new Error(errorInfo.message);
      setError(errorObj);
      logError(err, { table: options.table });
      toast.error(errorInfo.message);
      options.onError?.(errorObj);
    } finally {
      setLoading(false);
    }
  }, [options.table, JSON.stringify(options.filters), options.select]);

  useEffect(() => {
    if (options.enabled !== false) {
      fetchData();
    }
  }, [fetchData, options.enabled]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
