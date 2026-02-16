'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MBTI_OPTIONS } from '@/lib/constants';
import { useAuthStore } from '@/stores/authStore';

export default function OnboardingPage() {
  const router = useRouter();
  const { setProfile } = useAuthStore();
  const [mbti, setMbti] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [gender, setGender] = useState('');
  const [loveStyle, setLoveStyle] = useState('');

  const handleSubmit = () => {
    const profile = {
      id: crypto.randomUUID(),
      userId: '',
      mbti: mbti || undefined,
      birthYear: birthYear ? Number(birthYear) : undefined,
      gender: (gender || undefined) as 'male' | 'female' | 'other' | undefined,
      loveStyle: loveStyle || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProfile(profile);
    // TODO: bkend.ai에 프로필 저장
    router.replace('/home');
  };

  const handleSkip = () => {
    router.replace('/home');
  };

  return (
    <div className="flex min-h-screen flex-col px-6 py-12">
      <div className="mb-8 flex flex-col items-center gap-2">
        <Heart className="h-10 w-10 text-pink-500" fill="currentColor" />
        <h1 className="text-xl font-bold">프로필을 알려주세요</h1>
        <p className="text-center text-sm text-gray-500">
          더 정확한 분석을 위해 간단한 정보를 입력해주세요.
          <br />
          나중에 언제든 수정할 수 있어요.
        </p>
      </div>

      <div className="flex-1 space-y-5">
        <div className="space-y-2">
          <Label>MBTI</Label>
          <Select value={mbti} onValueChange={setMbti}>
            <SelectTrigger>
              <SelectValue placeholder="MBTI를 선택해주세요" />
            </SelectTrigger>
            <SelectContent>
              {MBTI_OPTIONS.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>출생연도</Label>
          <Input
            type="number"
            placeholder="예: 1995"
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>성별</Label>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger>
              <SelectValue placeholder="성별을 선택해주세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">남성</SelectItem>
              <SelectItem value="female">여성</SelectItem>
              <SelectItem value="other">기타</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>연애 스타일</Label>
          <Input
            placeholder="예: 다정하고 적극적인 편"
            value={loveStyle}
            onChange={(e) => setLoveStyle(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <Button onClick={handleSubmit} className="w-full bg-pink-500 hover:bg-pink-600">
          시작하기
        </Button>
        <Button onClick={handleSkip} variant="ghost" className="w-full text-gray-500">
          나중에 할게요
        </Button>
      </div>
    </div>
  );
}
