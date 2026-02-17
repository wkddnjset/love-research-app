'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/authStore';

export function useMatchingTickets() {
  const userId = useAuthStore((s) => s.user?.id);
  const supabase = createClient();

  const query = useQuery({
    queryKey: ['matching_tickets', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matching_tickets')
        .select('*')
        .eq('user_id', userId!)
        .order('purchased_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!userId,
  });

  const unusedCount = (query.data ?? []).filter((t: { status: string }) => t.status === 'unused').length;

  return {
    tickets: query.data ?? [],
    unusedCount,
    isLoading: query.isLoading,
  };
}
