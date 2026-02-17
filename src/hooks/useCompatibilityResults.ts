'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/authStore';

export function useCompatibilityResults() {
  const userId = useAuthStore((s) => s.user?.id);
  const supabase = createClient();

  const query = useQuery({
    queryKey: ['compatibility_results', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('compatibility_results')
        .select('*')
        .or(`requester_id.eq.${userId},target_id.eq.${userId}`)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!userId,
  });

  return {
    results: query.data ?? [],
    isLoading: query.isLoading,
  };
}
