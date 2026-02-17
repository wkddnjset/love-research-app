'use client';

import { Heart, Sparkles, Users } from 'lucide-react';
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
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col items-center">
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 shadow-neo-md">
            <Heart className="h-10 w-10 text-white" fill="currentColor" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">사랑연구소</h1>
          <p className="text-center text-sm text-muted-foreground leading-relaxed">
            나의 연애 데이터를 기억하는 AI
            <br />
            데이터 기반 맞춤형 연애 분석
          </p>
        </div>

        <div className="flex w-full max-w-xs flex-col gap-3">
          <Button
            onClick={handleKakaoLogin}
            className="h-12 w-full bg-[#FEE500] text-[#191919] hover:bg-[#FDD835] shadow-neo hover-neo border border-[#E5CF00] text-base font-bold"
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.47 1.607 4.647 4.041 5.897l-.953 3.49a.3.3 0 00.459.319l4.072-2.713c.776.106 1.57.162 2.381.162 5.523 0 10-3.477 10-7.655C22 6.477 17.523 3 12 3z" />
            </svg>
            카카오톡으로 로그인
          </Button>
          <p className="text-center text-[10px] text-muted-foreground">
            시작하면 서비스 이용약관에 동의하게 됩니다
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 text-center w-full max-w-xs">
          {[
            { Icon: Sparkles, label: '연애 성향 분석', gradient: 'from-pink-400 to-rose-500' },
            { Icon: Heart, label: '궁합 분석', gradient: 'from-violet-500 to-purple-600' },
            { Icon: Users, label: '매칭 서비스', gradient: 'from-orange-400 to-amber-500' },
            { Icon: Heart, label: '데일리 질문', gradient: 'from-teal-400 to-cyan-500' },
          ].map(({ Icon, label, gradient }) => (
            <div key={label} className="rounded-xl border border-border bg-card px-4 py-3 shadow-neo">
              <div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${gradient} shadow-sm`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <p className="mt-2 text-xs font-bold text-card-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
