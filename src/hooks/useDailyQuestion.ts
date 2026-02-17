'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import type { DailyQuestion, DailyAnswer } from '@/types';

function useUserId() {
  return useAuthStore((s) => s.user?.id);
}

export function useTodayQuestion() {
  const supabase = createClient();
  const today = new Date().toISOString().split('T')[0];

  return useQuery({
    queryKey: ['daily_question', today],
    queryFn: async () => {
      // 오늘 날짜에 예약된 질문 우선
      const { data: scheduled } = await supabase
        .from('daily_questions')
        .select('*')
        .eq('scheduled_date', today)
        .eq('is_active', true)
        .limit(1)
        .single();

      if (scheduled) return mapQuestion(scheduled);

      // 없으면 날짜 미지정 중 랜덤 (날짜 기반 시드)
      const { data: pool } = await supabase
        .from('daily_questions')
        .select('*')
        .is('scheduled_date', null)
        .eq('is_active', true);

      if (!pool || pool.length === 0) return null;

      const dayNum = Math.floor(new Date(today).getTime() / 86400000);
      const idx = dayNum % pool.length;
      return mapQuestion(pool[idx]);
    },
  });
}

export function useTodayAnswer(questionId?: string) {
  const userId = useUserId();
  const supabase = createClient();

  return useQuery({
    queryKey: ['daily_answer', userId, questionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_answers')
        .select('*')
        .eq('user_id', userId!)
        .eq('question_id', questionId!)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data ? mapAnswer(data) : null;
    },
    enabled: !!userId && !!questionId,
  });
}

export function useSubmitAnswer() {
  const userId = useUserId();
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (input: { questionId: string; answer: string }) => {
      const { error } = await supabase.from('daily_answers').upsert(
        {
          user_id: userId!,
          question_id: input.questionId,
          answer: input.answer,
        },
        { onConflict: 'user_id,question_id' }
      );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily_answer'] });
      queryClient.invalidateQueries({ queryKey: ['daily_answers_recent'] });
    },
  });
}

export function useRecentAnswers(limit = 7) {
  const userId = useUserId();
  const supabase = createClient();

  return useQuery({
    queryKey: ['daily_answers_recent', userId, limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_answers')
        .select('*, daily_questions(*)')
        .eq('user_id', userId!)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data ?? []).map((row: Record<string, unknown>) => ({
        ...mapAnswer(row),
        question: row.daily_questions ? mapQuestion(row.daily_questions as Record<string, unknown>) : undefined,
      }));
    },
    enabled: !!userId,
  });
}

function mapQuestion(row: Record<string, unknown>): DailyQuestion {
  return {
    id: row.id as string,
    question: row.question as string,
    keyword: row.keyword as string,
    scheduledDate: (row.scheduled_date as string) ?? undefined,
    isActive: row.is_active as boolean,
    createdBy: (row.created_by as string) ?? undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function mapAnswer(row: Record<string, unknown>): DailyAnswer {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    questionId: row.question_id as string,
    answer: row.answer as string,
    createdAt: row.created_at as string,
  };
}
