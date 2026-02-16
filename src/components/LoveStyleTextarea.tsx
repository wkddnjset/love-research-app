'use client';

import { Info } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const MAX_LENGTH = 1000;

interface LoveStyleTextareaProps {
  value: string;
  onChange: (value: string) => void;
}

export default function LoveStyleTextarea({ value, onChange }: LoveStyleTextareaProps) {
  const charCount = value.length;

  return (
    <div className="space-y-2">
      <Label>연애 스타일</Label>

      <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p className="text-xs leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">AI 분석의 핵심 데이터예요.</span>{' '}
          연애할 때 나의 성격, 표현 방식, 애정 언어, 갈등 해결 스타일 등을 자세히 적을수록 분석 정확도가 높아져요.
        </p>
      </div>

      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => {
            if (e.target.value.length <= MAX_LENGTH) {
              onChange(e.target.value);
            }
          }}
          placeholder={`예시:\n- 다정하고 적극적으로 표현하는 편이에요\n- 갈등이 생기면 바로 대화로 풀려고 해요\n- 애정 표현은 스킨십 > 말 > 행동 순이에요\n- 질투는 적당히 하는 걸 좋아해요`}
          rows={5}
          className="resize-none"
          maxLength={MAX_LENGTH}
        />
        <span className="absolute right-3 bottom-2 text-[11px] text-muted-foreground">
          {charCount}/{MAX_LENGTH}
        </span>
      </div>
    </div>
  );
}
