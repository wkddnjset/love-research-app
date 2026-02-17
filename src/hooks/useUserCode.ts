'use client';

import { useAuthStore } from '@/stores/authStore';

export function useUserCode() {
  const profile = useAuthStore((s) => s.profile);
  return profile?.userCode ?? null;
}
