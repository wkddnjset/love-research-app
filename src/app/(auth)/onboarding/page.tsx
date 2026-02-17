'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import MbtiSlider from '@/components/MbtiSlider';
import BirthYearPicker from '@/components/BirthYearPicker';
import GenderSelector from '@/components/GenderSelector';
import LoveStyleTextarea from '@/components/LoveStyleTextarea';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { createClient } from '@/lib/supabase/client';

export default function OnboardingPage() {
  const router = useRouter();
  useAuth();
  const { user, setProfile } = useAuthStore();
  const [mbti, setMbti] = useState('');
  const [mbtiWeights, setMbtiWeights] = useState<number[]>([]);
  const [birthYear, setBirthYear] = useState('');
  const [gender, setGender] = useState('');
  const [loveStyle, setLoveStyle] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      router.replace('/login');
      return;
    }

    setIsSaving(true);
    try {
      const supabase = createClient();
      const profileData = {
        user_id: user.id,
        mbti: mbti || null,
        mbti_weights: mbtiWeights.length === 4 ? mbtiWeights : null,
        birth_year: birthYear ? Number(birthYear) : null,
        gender: gender || null,
        love_style: loveStyle || null,
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) throw error;

      setProfile({
        id: data.id,
        userId: data.user_id,
        userCode: data.user_code ?? '',
        mbti: data.mbti ?? undefined,
        mbtiWeights: (data.mbti_weights as number[]) ?? undefined,
        birthYear: data.birth_year ?? undefined,
        gender: data.gender ?? undefined,
        loveStyle: data.love_style ?? undefined,
        lastReportAt: data.last_report_at ?? undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      });

      router.replace('/home');
    } catch {
      toast.error('프로필 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkip = () => {
    router.replace('/home');
  };

  return (
    <div className="flex min-h-screen flex-col px-6 py-12">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-1">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 shadow-neo-md">
            <Heart className="h-8 w-8 text-white" fill="currentColor" />
          </div>
          <h1 className="mt-2 text-xl font-bold text-foreground">프로필을 알려주세요</h1>
          <p className="text-center text-sm text-muted-foreground leading-relaxed">
            더 정확한 분석을 위해 간단한 정보를 입력해주세요.
            <br />
            나중에 언제든 수정할 수 있어요.
          </p>
        </div>

        <Card className="flex-1 shadow-neo">
          <CardContent className="p-5 space-y-6">
            <MbtiSlider value={mbti} onChange={(m, w) => { setMbti(m); if (w) setMbtiWeights(w); }} />
            <div className="h-px bg-border" />
            <BirthYearPicker value={birthYear} onChange={setBirthYear} />
            <div className="h-px bg-border" />
            <GenderSelector value={gender} onChange={setGender} />
            <div className="h-px bg-border" />
            <LoveStyleTextarea value={loveStyle} onChange={setLoveStyle} />
          </CardContent>
        </Card>

        <div className="mt-6 space-y-3">
          <Button onClick={handleSubmit} disabled={isSaving} className="w-full shadow-neo hover-neo">
            {isSaving ? '저장 중...' : '시작하기'}
          </Button>
          <Button onClick={handleSkip} variant="ghost" className="w-full text-muted-foreground">
            나중에 할게요
          </Button>
        </div>
      </div>
    </div>
  );
}
