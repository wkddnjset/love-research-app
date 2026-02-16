'use client';

import MobileHeader from '@/components/layout/MobileHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MBTI_OPTIONS } from '@/lib/constants';

export default function ProfilePage() {
  return (
    <div>
      <MobileHeader title="프로필 편집" showBack />

      <div className="space-y-6 px-4 py-4">
        <div className="space-y-2">
          <Label>MBTI</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="MBTI를 선택해주세요" />
            </SelectTrigger>
            <SelectContent>
              {MBTI_OPTIONS.map((mbti) => (
                <SelectItem key={mbti} value={mbti}>
                  {mbti}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>출생연도</Label>
          <Input type="number" placeholder="예: 1995" />
        </div>

        <div className="space-y-2">
          <Label>성별</Label>
          <Select>
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
          <Input placeholder="예: 다정하고 적극적인 편" />
        </div>

        <Button className="w-full bg-pink-500 hover:bg-pink-600">
          저장하기
        </Button>
      </div>
    </div>
  );
}
