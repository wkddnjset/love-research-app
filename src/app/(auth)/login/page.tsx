'use client';

import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const handleKakaoLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="mb-8 flex flex-col items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary shadow-neo-md border border-border">
          <Heart className="h-10 w-10 text-primary" fill="currentColor" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">사랑연구소</h1>
        <p className="text-center text-muted-foreground">
          나의 연애 데이터를 기억하는 AI
          <br />
          데이터 기반 맞춤형 연애 분석
        </p>
      </div>

      <div className="flex w-full max-w-xs flex-col gap-3">
        <Button
          onClick={handleKakaoLogin}
          className="h-12 w-full max-w-xs bg-[#FEE500] text-[#191919] hover:bg-[#FDD835] shadow-neo hover-neo border-2 border-[#E5CF00]"
        >
          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.47 1.607 4.647 4.041 5.897l-.953 3.49a.3.3 0 00.459.319l4.072-2.713c.776.106 1.57.162 2.381.162 5.523 0 10-3.477 10-7.655C22 6.477 17.523 3 12 3z" />
          </svg>
          카카오톡으로 로그인
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          시작하면 서비스 이용약관에 동의하게 됩니다
        </p>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 text-center">
        {[
          { icon: '💕', label: '궁합 분석' },
          { icon: '🕊️', label: '싸움 중재' },
          { icon: '💔', label: '이별 분석' },
          { icon: '🦋', label: '썸 분석' },
        ].map(({ icon, label }) => (
          <div key={label} className="rounded-xl border border-border bg-card px-4 py-3 shadow-neo">
            <span className="text-2xl">{icon}</span>
            <p className="mt-1 text-sm font-medium text-card-foreground">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
