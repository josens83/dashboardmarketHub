/**
 * Reports Hook
 * 리포트 관리를 위한 Hook
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/shared/lib/supabase';
import { handleError, logError } from '@/shared/utils/error-handler';
import { useToast } from './use-toast';
import { useAuth } from '@/shared/contexts/AuthContext';

export interface Report {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  type: string;
  data: any;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export function useReports() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const toast = useToast();

  /**
   * 리포트 목록 가져오기
   */
  const getReports = useCallback(async (): Promise<Report[]> => {
    if (!user) return [];

    setLoading(true);
    try {
      // @ts-ignore
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      const errorInfo = handleError(err);
      logError(err, { action: 'getReports', userId: user.id });
      toast.error(errorInfo.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  /**
   * 리포트 생성
   */
  const createReport = useCallback(
    async (reportData: {
      title: string;
      description?: string;
      type: string;
      data: any;
      is_public?: boolean;
    }): Promise<Report | null> => {
      if (!user) return null;

      setLoading(true);
      try {
        // @ts-ignore
        const { data, error } = await supabase
          .from('reports')
          .insert([
            {
              user_id: user.id,
              title: reportData.title,
              description: reportData.description || null,
              type: reportData.type,
              data: reportData.data,
              is_public: reportData.is_public || false,
            },
          ])
          .select()
          .single();

        if (error) throw error;

        // 활동 로그 기록
        // @ts-ignore
        await supabase.from('activity_logs').insert([
          {
            user_id: user.id,
            action: 'report_created',
            entity_type: 'report',
            entity_id: data.id,
            metadata: { title: reportData.title, type: reportData.type },
          },
        ]);

        toast.success('리포트가 저장되었습니다.');
        return data;
      } catch (err) {
        const errorInfo = handleError(err);
        logError(err, { action: 'createReport', userId: user.id });
        toast.error(errorInfo.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [user?.id]
  );

  /**
   * 리포트 업데이트
   */
  const updateReport = useCallback(
    async (
      reportId: string,
      updates: Partial<Omit<Report, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
    ): Promise<boolean> => {
      if (!user) return false;

      setLoading(true);
      try {
        // @ts-ignore
        const { error } = await supabase
          .from('reports')
          .update(updates)
          .eq('id', reportId)
          .eq('user_id', user.id);

        if (error) throw error;

        // 활동 로그 기록
        // @ts-ignore
        await supabase.from('activity_logs').insert([
          {
            user_id: user.id,
            action: 'report_updated',
            entity_type: 'report',
            entity_id: reportId,
          },
        ]);

        toast.success('리포트가 업데이트되었습니다.');
        return true;
      } catch (err) {
        const errorInfo = handleError(err);
        logError(err, { action: 'updateReport', reportId });
        toast.error(errorInfo.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [user?.id]
  );

  /**
   * 리포트 삭제
   */
  const deleteReport = useCallback(
    async (reportId: string): Promise<boolean> => {
      if (!user) return false;

      setLoading(true);
      try {
        // @ts-ignore
        const { error } = await supabase
          .from('reports')
          .delete()
          .eq('id', reportId)
          .eq('user_id', user.id);

        if (error) throw error;

        // 활동 로그 기록
        // @ts-ignore
        await supabase.from('activity_logs').insert([
          {
            user_id: user.id,
            action: 'report_deleted',
            entity_type: 'report',
            entity_id: reportId,
          },
        ]);

        toast.success('리포트가 삭제되었습니다.');
        return true;
      } catch (err) {
        const errorInfo = handleError(err);
        logError(err, { action: 'deleteReport', reportId });
        toast.error(errorInfo.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [user?.id]
  );

  return {
    loading,
    getReports,
    createReport,
    updateReport,
    deleteReport,
  };
}
