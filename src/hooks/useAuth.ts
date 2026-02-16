'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export function useAuth({ required = false } = {}) {
  const router = useRouter();
  const { user, accessToken, isLoading, setLoading } = useAuthStore();

  useEffect(() => {
    // zustand persist hydration 후 로딩 해제
    setLoading(false);
  }, [setLoading]);

  useEffect(() => {
    if (!isLoading && required && !accessToken) {
      router.replace('/login');
    }
  }, [isLoading, required, accessToken, router]);

  return {
    user,
    accessToken,
    isLoading,
    isAuthenticated: !!accessToken,
  };
}
