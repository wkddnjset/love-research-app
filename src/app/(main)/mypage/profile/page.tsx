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
  const [birthYear, setBirthYear] = useState('');
  const [gender, setGender] = useState('');
  const [loveStyle, setLoveStyle] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setMbti(profile.mbti ?? '');
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
        mbti: data.mbti ?? undefined,
        birthYear: data.birth_year ?? undefined,
        gender: data.gender ?? undefined,
        loveStyle: data.love_style ?? undefined,
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
    <div>
      <MobileHeader title="프로필 편집" showBack />

      <div className="px-4 py-4">
        <Card className="shadow-neo">
          <CardContent className="p-5 space-y-6">
            <MbtiSlider value={mbti} onChange={setMbti} />

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
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />저장 중...</>
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
