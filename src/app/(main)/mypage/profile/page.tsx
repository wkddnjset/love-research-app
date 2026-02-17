'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import MobileHeader from '@/components/layout/MobileHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import MbtiSlider from '@/components/MbtiSlider';
import BirthYearPicker from '@/components/BirthYearPicker';
import GenderSelector from '@/components/GenderSelector';
import LoveStyleTextarea from '@/components/LoveStyleTextarea';
import { useAuthStore } from '@/stores/authStore';
import { createClient } from '@/lib/supabase/client';

export default function ProfilePage() {
  const { user, profile, setProfile } = useAuthStore();
  const [mbti, setMbti] = useState('');
  const [mbtiWeights, setMbtiWeights] = useState<number[]>([]);
  const [birthYear, setBirthYear] = useState('');
  const [gender, setGender] = useState('');
  const [loveStyle, setLoveStyle] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setMbti(profile.mbti ?? '');
      setMbtiWeights(profile.mbtiWeights ?? []);
      setBirthYear(profile.birthYear ? String(profile.birthYear) : '');
      setGender(profile.gender ?? '');
      setLoveStyle(profile.loveStyle ?? '');
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
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
        .upsert(profileData, { onConflict: 'user_id' })
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

      toast.success('프로필이 저장되었습니다.');
    } catch {
      toast.error('저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <MobileHeader title="프로필 편집" showBack />

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 px-4 pb-8 pt-4">
        <Card className="overflow-hidden border border-border shadow-neo rounded-2xl">
          <CardContent className="p-5 space-y-6">
            <MbtiSlider value={mbti} weights={mbtiWeights} onChange={(m, w) => { setMbti(m); if (w) setMbtiWeights(w); }} />

            <div className="h-px bg-border" />

            <BirthYearPicker value={birthYear} onChange={setBirthYear} />

            <div className="h-px bg-border" />

            <GenderSelector value={gender} onChange={setGender} />

            <div className="h-px bg-border" />

            <LoveStyleTextarea value={loveStyle} onChange={setLoveStyle} />

            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full shadow-neo hover-neo"
            >
              {isSaving ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />저장 중...</>
              ) : (
                '저장하기'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
