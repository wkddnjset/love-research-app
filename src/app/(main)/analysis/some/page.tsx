'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import MobileHeader from '@/components/layout/MobileHeader';
import ScoreGauge from '@/features/analysis/components/ScoreGauge';
import ResultCard from '@/features/analysis/components/ResultCard';
import { someInputSchema, type SomeInputFormData } from '@/types/schemas/analysis';
import { useAnalysisHistory } from '@/hooks/useSupabaseData';

import type { SomeResult } from '@/types';

export default function SomePage() {
  const [result, setResult] = useState<SomeResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addAnalysisResult } = useAnalysisHistory();

  const { register, handleSubmit, formState: { errors } } = useForm<SomeInputFormData>({
    resolver: zodResolver(someInputSchema),
  });

  const onSubmit = async (data: SomeInputFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/analysis/some', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('분석 실패');
      const json = await res.json();
      setResult(json);
      await addAnalysisResult({ moduleType: 'some', inputData: data as unknown as Record<string, unknown>, result: json, score: json.successProbability });
    } catch {
      toast.error('분석 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <MobileHeader title="썸 성공 확률" showBack />
      <div className="space-y-6 px-4 py-4">
        {!result ? (
          <Card className="shadow-neo">
            <CardContent className="p-5">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label>만난 횟수 *</Label>
                  <Input type="number" {...register('meetCount', { valueAsNumber: true })} placeholder="예: 5" />
                  {errors.meetCount && <p className="text-xs text-destructive">{errors.meetCount.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>연락 빈도 *</Label>
                  <Input {...register('contactFrequency')} placeholder="예: 매일, 이틀에 한번" />
                  {errors.contactFrequency && <p className="text-xs text-destructive">{errors.contactFrequency.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>답장 속도 *</Label>
                  <Input {...register('replySpeed')} placeholder="예: 30분 이내, 1시간 이내" />
                  {errors.replySpeed && <p className="text-xs text-destructive">{errors.replySpeed.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>상대 행동 패턴 *</Label>
                  <Textarea {...register('partnerBehavior')} placeholder="상대가 보이는 행동을 설명해주세요" rows={3} />
                  {errors.partnerBehavior && <p className="text-xs text-destructive">{errors.partnerBehavior.message}</p>}
                </div>
                <Button type="submit" className="w-full shadow-neo hover-neo" disabled={isLoading}>
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />분석 중...</> : '분석하기'}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center py-4">
              <ScoreGauge score={result.successProbability} label="썸 성공 확률" size="lg" />
            </div>
            <ResultCard title="상대 관심도" icon="💓">
              <p className="text-lg font-bold">{result.interestLevel}</p>
            </ResultCard>
            <ResultCard title="밀당 전략" icon="🎯">
              <p>{result.pushPullStrategy}</p>
            </ResultCard>
            <ResultCard title="다음 액션" icon="👉">
              <p>{result.nextAction}</p>
            </ResultCard>
            <Button onClick={() => setResult(null)} variant="outline" className="w-full shadow-neo hover-neo">다시 분석하기</Button>
          </div>
        )}
      </div>
    </div>
  );
}
