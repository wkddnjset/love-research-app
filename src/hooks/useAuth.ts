'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { createClient } from '@/lib/supabase/client';
import type { UserProfile } from '@/types';

function mapProfile(data: Record<string, unknown>): UserProfile {
  return {
    id: data.id as string,
    userId: data.user_id as string,
    userCode: data.user_code as string,
    mbti: (data.mbti as string) ?? undefined,
    birthYear: (data.birth_year as number) ?? undefined,
    gender: (data.gender as UserProfile['gender']) ?? undefined,
    loveStyle: (data.love_style as string) ?? undefined,
    lastReportAt: (data.last_report_at as string) ?? undefined,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string,
  };
}

export function useAuth({ required = false } = {}) {
  const router = useRouter();
  const { user, isLoading, setUser, setProfile, setLoading, logout } = useAuthStore();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()
          .then(({ data }) => {
            if (data) setProfile(mapProfile(data as Record<string, unknown>));
          });
      }
      setLoading(false);
    });

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
