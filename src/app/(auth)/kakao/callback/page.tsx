'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, setAccessToken, profile } = useAuthStore();
  const [error, setError] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      router.replace('/login');
      return;
    }

    async function authenticate(code: string) {
      try {
        const res = await fetch('/api/auth/kakao', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        if (!res.ok) {
          throw new Error('Authentication failed');
        }

        const data = await res.json();
        setUser(data.user);
        setAccessToken(data.accessToken);

        // 프로필이 없으면 온보딩으로, 있으면 홈으로
        if (!profile) {
          router.replace('/onboarding');
        } else {
          router.replace('/home');
        }
      } catch {
        setError('로그인에 실패했습니다. 다시 시도해주세요.');
        setTimeout(() => router.replace('/login'), 2000);
      }
    }

    authenticate(code);
  }, [searchParams, router, setUser, setAccessToken]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      {error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : (
        <>
          <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
          <p className="text-sm text-gray-500">로그인 중...</p>
        </>
      )}
    </div>
  );
}

export default function KakaoCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
