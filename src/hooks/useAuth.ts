'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { createClient } from '@/lib/supabase/client';

export function useAuth({ required = false } = {}) {
  const router = useRouter();
  const { user, isLoading, setUser, setProfile, setLoading, logout } = useAuthStore();

  useEffect(() => {
    const supabase = createClient();

    // 초기 사용자 로드
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()
          .then(({ data }) => {
            if (data) setProfile(data as unknown as import('@/types').UserProfile);
          });
      }
      setLoading(false);
    });

    // Auth 상태 변경 리스너
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [setUser, setProfile, setLoading]);

  useEffect(() => {
    if (!isLoading && required && !user) {
      router.replace('/login');
    }
  }, [isLoading, required, user, router]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout: async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      logout();
      router.replace('/login');
    },
  };
}
