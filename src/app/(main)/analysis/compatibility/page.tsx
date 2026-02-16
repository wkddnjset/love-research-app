'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MobileHeader from '@/components/layout/MobileHeader';
import ScoreGauge from '@/features/analysis/components/ScoreGauge';
import ResultCard from '@/features/analysis/components/ResultCard';
import { compatibilityInputSchema, type CompatibilityInputFormData } from '@/types/schemas/analysis';
import { MBTI_OPTIONS } from '@/lib/constants';
import { useAnalysisHistory } from '@/hooks/useSupabaseData';

import type { CompatibilityResult } from '@/types';

export default function CompatibilityPage() {
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addAnalysisResult } = useAnalysisHistory();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CompatibilityInputFormData>({
    resolver: zodResolver(compatibilityInputSchema),
  });

  const onSubmit = async (data: CompatibilityInputFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/analysis/compatibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('분석 실패');
      const json = await res.json();
      setResult(json);
      await addAnalysisResult({ moduleType: 'compatibility', inputData: data as unknown as Record<string, unknown>, result: json, score: json.score });
    } catch {
      toast.error('분석 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <MobileHeader title="궁합 분석기" showBack />

      <div className="space-y-6 px-4 py-4">
        {!result ? (
          <Card className="shadow-neo">
            <CardContent className="p-5">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label>나의 MBTI *</Label>
                  <Select onValueChange={(v) => setValue('myMbti', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="선택해주세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {MBTI_OPTIONS.map((mbti) => (
                        <SelectItem key={mbti} value={mbti}>{mbti}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.myMbti && <p className="text-xs text-destructive">{errors.myMbti.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>상대 MBTI *</Label>
                  <Select onValueChange={(v) => setValue('partnerMbti', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="선택해주세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {MBTI_OPTIONS.map((mbti) => (
                        <SelectItem key={mbti} value={mbti}>{mbti}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.partnerMbti && <p className="text-xs text-destructive">{errors.partnerMbti.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>나의 성향</Label>
                  <Input {...register('myPersonality')} placeholder="예: 외향적, 감성적" />
                </div>

                <div className="space-y-2">
                  <Label>상대 성향</Label>
                  <Input {...register('partnerPersonality')} placeholder="예: 내향적, 논리적" />
                </div>

                <Button
                  type="submit"
                  className="w-full shadow-neo hover-neo"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      분석 중...
                    </>
                  ) : (
                    '궁합 분석하기'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center py-4">
              <ScoreGauge score={result.score} label="궁합 점수" size="lg" />
            </div>

            <ResultCard title="강점" icon="💪">
              <ul className="list-disc space-y-1 pl-4">
                {result.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </ResultCard>

            <ResultCard title="약점" icon="⚠️">
              <ul className="list-disc space-y-1 pl-4">
                {result.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </ResultCard>

            <ResultCard title="주의 포인트" icon="🚨">
              <ul className="list-disc space-y-1 pl-4">
                {result.cautions.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </ResultCard>

            <ResultCard title="조언" icon="💡">
              <p>{result.advice}</p>
            </ResultCard>

            <Button
              onClick={() => setResult(null)}
              variant="outline"
              className="w-full shadow-neo hover-neo"
            >
              다시 분석하기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
