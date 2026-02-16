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
import { breakupInputSchema, type BreakupInputFormData } from '@/types/schemas/analysis';
import { useAnalysisHistory } from '@/hooks/useSupabaseData';

import type { BreakupResult } from '@/types';

export default function BreakupPage() {
  const [result, setResult] = useState<BreakupResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addAnalysisResult } = useAnalysisHistory();

  const { register, handleSubmit, formState: { errors } } = useForm<BreakupInputFormData>({
    resolver: zodResolver(breakupInputSchema),
  });

  const onSubmit = async (data: BreakupInputFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/analysis/breakup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('분석 실패');
      const json = await res.json();
      setResult(json);
      await addAnalysisResult({ moduleType: 'breakup', inputData: data as unknown as Record<string, unknown>, result: json, score: json.continueProbability });
    } catch {
      toast.error('분석 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <MobileHeader title="헤어져야 할까" showBack />
      <div className="space-y-6 px-4 py-4">
        {!result ? (
          <Card className="shadow-neo">
            <CardContent className="p-5">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label>최근 갈등 상황 *</Label>
                  <Textarea {...register('recentConflicts')} placeholder="최근 갈등 상황을 설명해주세요" rows={4} />
                  {errors.recentConflicts && <p className="text-xs text-destructive">{errors.recentConflicts.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>같은 갈등 반복 횟수 *</Label>
                  <Input type="number" {...register('repeatCount', { valueAsNumber: true })} placeholder="예: 3" />
                  {errors.repeatCount && <p className="text-xs text-destructive">{errors.repeatCount.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>관계 만족도 (1~10) *</Label>
                  <Input type="number" {...register('satisfactionScore', { valueAsNumber: true })} min={1} max={10} />
                  {errors.satisfactionScore && <p className="text-xs text-destructive">{errors.satisfactionScore.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>미래 계획 일치도 (1~10) *</Label>
                  <Input type="number" {...register('futureAlignmentScore', { valueAsNumber: true })} min={1} max={10} />
                  {errors.futureAlignmentScore && <p className="text-xs text-destructive">{errors.futureAlignmentScore.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>교제 기간 (개월) *</Label>
                  <Input type="number" {...register('relationshipDuration', { valueAsNumber: true })} placeholder="예: 12" />
                  {errors.relationshipDuration && <p className="text-xs text-destructive">{errors.relationshipDuration.message}</p>}
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
              <ScoreGauge score={result.continueProbability} label="관계 지속 확률" size="lg" />
            </div>
            <ResultCard title="개선 가능성" icon="📈">
              <p className="font-medium">{result.improvementPossibility}</p>
            </ResultCard>
            <ResultCard title="장기 리스크" icon="⚠️">
              <ul className="list-disc space-y-1 pl-4">
                {result.longTermRisks.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </ResultCard>
            <ResultCard title="제3자 관점" icon="👤">
              <p className="italic">{result.thirdPersonComment}</p>
            </ResultCard>
            <Button onClick={() => setResult(null)} variant="outline" className="w-full shadow-neo hover-neo">다시 분석하기</Button>
          </div>
        )}
      </div>
    </div>
  );
}
