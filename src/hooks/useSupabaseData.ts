'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import type {
  ExPartner,
  CurrentRelationship,
  ConflictRecord,
  EmotionRecord,
  AnalysisResult,
  AnalysisModuleType,
} from '@/types';

export function useConflictCountByRelationship(relationshipId: string | undefined) {
  const userId = useUserId();
  const supabase = createClient();

  return useQuery({
    queryKey: ['conflict_count', relationshipId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('conflict_records')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId!)
        .eq('relationship_id', relationshipId!);
      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!userId && !!relationshipId,
  });
}

function useUserId() {
  return useAuthStore((s) => s.user?.id);
}

// ============================================
// ExPartners
// ============================================
export function useExPartners() {
  const userId = useUserId();
  const queryClient = useQueryClient();
  const supabase = createClient();

  const query = useQuery({
    queryKey: ['ex_partners', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ex_partners')
        .select('*')
        .eq('user_id', userId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapExPartner);
    },
    enabled: !!userId,
  });

  const addMutation = useMutation({
    mutationFn: async (input: Omit<ExPartner, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
      const { error } = await supabase.from('ex_partners').insert({
        user_id: userId!,
        nickname: input.nickname,
        mbti: input.mbti ?? null,
        personality: input.personality ?? null,
        conflict_types: input.conflictTypes,
        conflict_detail: input.conflictDetail ?? null,
        breakup_reason: input.breakupReason ?? null,
        satisfaction_score: 5,
        relationship_duration: input.relationshipDuration ?? null,
        style_answers: input.styleAnswers ?? {},
        good_points: input.goodPoints ?? null,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ex_partners'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('ex_partners').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ex_partners'] }),
  });

  return {
    exPartners: query.data ?? [],
    isLoading: query.isLoading,
    addExPartner: addMutation.mutateAsync,
    deleteExPartner: deleteMutation.mutateAsync,
  };
}

function mapExPartner(row: Record<string, unknown>): ExPartner {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    nickname: row.nickname as string,
    mbti: (row.mbti as string) ?? undefined,
    personality: (row.personality as string) ?? undefined,
    conflictTypes: (row.conflict_types as string[]) ?? [],
    conflictDetail: (row.conflict_detail as string) ?? undefined,
    breakupReason: (row.breakup_reason as string) ?? undefined,
    relationshipDuration: (row.relationship_duration as number) ?? undefined,
    styleAnswers: (row.style_answers as Record<string, string>) ?? {},
    goodPoints: (row.good_points as string) ?? undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

// ============================================
// Relationships
// ============================================
export function useRelationships() {
  const userId = useUserId();
  const queryClient = useQueryClient();
  const supabase = createClient();

  const query = useQuery({
    queryKey: ['relationships', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('current_relationships')
        .select('*')
        .eq('user_id', userId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapRelationship);
    },
    enabled: !!userId,
  });

  const addMutation = useMutation({
    mutationFn: async (input: Omit<CurrentRelationship, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
      const { error } = await supabase.from('current_relationships').insert({
        user_id: userId!,
        nickname: input.nickname,
        mbti: input.mbti ?? null,
        personality: input.personality ?? null,
        stage: input.stage,
        start_date: input.startDate ?? null,
        is_active: input.isActive,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['relationships'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('current_relationships').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['relationships'] }),
  });

  const moveToExMutation = useMutation({
    mutationFn: async (input: {
      relationshipId: string;
      exData: Omit<ExPartner, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
    }) => {
      const { error: insertError } = await supabase.from('ex_partners').insert({
        user_id: userId!,
        nickname: input.exData.nickname,
        mbti: input.exData.mbti ?? null,
        personality: input.exData.personality ?? null,
        conflict_types: input.exData.conflictTypes,
        conflict_detail: input.exData.conflictDetail ?? null,
        breakup_reason: input.exData.breakupReason ?? null,
        satisfaction_score: 5,
        relationship_duration: input.exData.relationshipDuration ?? null,
        style_answers: input.exData.styleAnswers ?? {},
        good_points: input.exData.goodPoints ?? null,
      });
      if (insertError) throw insertError;

      const { error: deleteError } = await supabase
        .from('current_relationships')
        .delete()
        .eq('id', input.relationshipId);
      if (deleteError) throw deleteError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relationships'] });
      queryClient.invalidateQueries({ queryKey: ['ex_partners'] });
      queryClient.invalidateQueries({ queryKey: ['conflicts'] });
    },
  });

  return {
    relationships: query.data ?? [],
    isLoading: query.isLoading,
    addRelationship: addMutation.mutateAsync,
    deleteRelationship: deleteMutation.mutateAsync,
    moveToEx: moveToExMutation.mutateAsync,
    isMovingToEx: moveToExMutation.isPending,
  };
}

function mapRelationship(row: Record<string, unknown>): CurrentRelationship {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    nickname: row.nickname as string,
    mbti: (row.mbti as string) ?? undefined,
    personality: (row.personality as string) ?? undefined,
    stage: row.stage as 'some' | 'dating' | 'serious',
    startDate: (row.start_date as string) ?? undefined,
    isActive: row.is_active as boolean,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

// ============================================
// Conflicts
// ============================================
export function useConflicts() {
  const userId = useUserId();
  const queryClient = useQueryClient();
  const supabase = createClient();

  const query = useQuery({
    queryKey: ['conflicts', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('conflict_records')
        .select('*')
        .eq('user_id', userId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapConflict);
    },
    enabled: !!userId,
  });

  const addMutation = useMutation({
    mutationFn: async (input: Omit<ConflictRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
      const { error } = await supabase.from('conflict_records').insert({
        user_id: userId!,
        relationship_id: input.relationshipId,
        title: input.title,
        description: input.description,
        conflict_type: input.conflictType,
        severity: input.severity,
        is_resolved: input.isResolved,
        resolved_at: input.resolvedAt ?? null,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['conflicts'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('conflict_records').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['conflicts'] }),
  });

  return {
    conflicts: query.data ?? [],
    isLoading: query.isLoading,
    addConflict: addMutation.mutateAsync,
    deleteConflict: deleteMutation.mutateAsync,
  };
}

function mapConflict(row: Record<string, unknown>): ConflictRecord {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    relationshipId: row.relationship_id as string,
    title: row.title as string,
    description: row.description as string,
    conflictType: row.conflict_type as string,
    severity: row.severity as 1 | 2 | 3 | 4 | 5,
    isResolved: row.is_resolved as boolean,
    resolvedAt: (row.resolved_at as string) ?? undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

// ============================================
// Emotions
// ============================================
export function useEmotions() {
  const userId = useUserId();
  const queryClient = useQueryClient();
  const supabase = createClient();

  const query = useQuery({
    queryKey: ['emotions', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('emotion_records')
        .select('*')
        .eq('user_id', userId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapEmotion);
    },
    enabled: !!userId,
  });

  const addMutation = useMutation({
    mutationFn: async (input: Omit<EmotionRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
      const { error } = await supabase.from('emotion_records').insert({
        user_id: userId!,
        relationship_id: input.relationshipId ?? null,
        mood: input.mood,
        score: input.score,
        content: input.content,
        tags: input.tags,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['emotions'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('emotion_records').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['emotions'] }),
  });

  return {
    emotions: query.data ?? [],
    isLoading: query.isLoading,
    addEmotion: addMutation.mutateAsync,
    deleteEmotion: deleteMutation.mutateAsync,
  };
}

function mapEmotion(row: Record<string, unknown>): EmotionRecord {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    relationshipId: (row.relationship_id as string) ?? undefined,
    mood: row.mood as EmotionRecord['mood'],
    score: row.score as number,
    content: row.content as string,
    tags: (row.tags as string[]) ?? [],
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

// ============================================
// Analysis History
// ============================================
export function useAnalysisHistory() {
  const userId = useUserId();
  const queryClient = useQueryClient();
  const supabase = createClient();

  const query = useQuery({
    queryKey: ['analysis_results', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analysis_results')
        .select('*')
        .eq('user_id', userId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapAnalysisResult);
    },
    enabled: !!userId,
  });

  const addMutation = useMutation({
    mutationFn: async (input: {
      moduleType: AnalysisModuleType;
      inputData: Record<string, unknown>;
      result: Record<string, unknown>;
      score?: number;
    }) => {
      const { error } = await supabase.from('analysis_results').insert({
        user_id: userId!,
        module_type: input.moduleType,
        input_data: input.inputData,
        result: input.result,
        score: input.score ?? null,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['analysis_results'] }),
  });

  return {
    analysisHistory: query.data ?? [],
    isLoading: query.isLoading,
    addAnalysisResult: addMutation.mutateAsync,
  };
}

function mapAnalysisResult(row: Record<string, unknown>): AnalysisResult {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    moduleType: row.module_type as AnalysisModuleType,
    inputData: (row.input_data as Record<string, unknown>) ?? {},
    result: (row.result as Record<string, unknown>) ?? {},
    score: (row.score as number) ?? undefined,
    createdAt: row.created_at as string,
  };
}

// ============================================
// Monthly Usage Count (for free tier limit)
// ============================================
export function useMonthlyUsage() {
  const userId = useUserId();
  const supabase = createClient();

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const query = useQuery({
    queryKey: ['monthly_usage', userId, monthStart],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('analysis_results')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId!)
        .gte('created_at', monthStart);
      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!userId,
  });

  return {
    usedCount: query.data ?? 0,
    isLoading: query.isLoading,
  };
}
