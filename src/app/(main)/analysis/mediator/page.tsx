'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MobileHeader from '@/components/layout/MobileHeader';
import ScoreGauge from '@/features/analysis/components/ScoreGauge';
import ResultCard from '@/features/analysis/components/ResultCard';
import { mediatorInputSchema, type MediatorInputFormData } from '@/types/schemas/analysis';
import { MBTI_OPTIONS, CONFLICT_TYPES, RELATIONSHIP_STAGES } from '@/lib/constants';
import { useDataStore } from '@/stores/dataStore';

import type { MediatorResult } from '@/types';

export default function MediatorPage() {
  const [result, setResult] = useState<MediatorResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addAnalysisResult } = useDataStore();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<MediatorInputFormData>({
    resolver: zodResolver(mediatorInputSchema),
  });

  const onSubmit = async (data: MediatorInputFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/analysis/mediator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('분석 실패');
      const json = await res.json();
      setResult(json);
      addAnalysisResult('mediator', data as unknown as Record<string, unknown>, json, json.recoveryProbability);
    } catch {
      toast.error('분석 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <MobileHeader title="싸움 중재기" showBack />
      <div className="space-y-6 px-4 py-4">
        {!result ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>현재 상황 *</Label>
              <Textarea {...register('situation')} placeholder="어떤 상황인지 자세히 설명해주세요" rows={4} />
              {errors.situation && <p className="text-xs text-red-500">{errors.situation.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>상대 MBTI</Label>
              <Select onValueChange={(v) => setValue('partnerMbti', v)}>
                <SelectTrigger><SelectValue placeholder="선택 (모르면 생략)" /></SelectTrigger>
                <SelectContent>
                  {MBTI_OPTIONS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>관계 단계 *</Label>
              <Select onValueChange={(v) => setValue('relationshipStage', v)}>
                <SelectTrigger><SelectValue placeholder="선택해주세요" /></SelectTrigger>
                <SelectContent>
                  {RELATIONSHIP_STAGES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.relationshipStage && <p className="text-xs text-red-500">{errors.relationshipStage.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>갈등 유형 *</Label>
              <Select onValueChange={(v) => setValue('conflictType', v)}>
                <SelectTrigger><SelectValue placeholder="선택해주세요" /></SelectTrigger>
                <SelectContent>
                  {CONFLICT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.conflictType && <p className="text-xs text-red-500">{errors.conflictType.message}</p>}
            </div>
            <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600" disabled={isLoading}>
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />분석 중...</> : '🕊️ 중재 분석하기'}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center py-4">
              <ScoreGauge score={result.recoveryProbability} label="회복 가능성" size="lg" />
            </div>
            <ResultCard title="절대 하면 안 되는 말" icon="🚫">
              <ul className="list-disc space-y-1 pl-4">
                {result.dontSay.map((s, i) => <li key={i} className="text-red-600">{s}</li>)}
              </ul>
            </ResultCard>
            <ResultCard title="화해 전략" icon="🕊️">
              <ol className="list-decimal space-y-2 pl-4">
                {result.reconciliationSteps.map((s) => <li key={s.step}>{s.action}</li>)}
              </ol>
            </ResultCard>
            <ResultCard title="타이밍" icon="⏰">
              <p>감정 진정 시간: {result.cooldownTime}</p>
              <p>연락 타이밍: {result.contactTiming}</p>
            </ResultCard>
            <Button onClick={() => setResult(null)} variant="outline" className="w-full">다시 분석하기</Button>
          </div>
        )}
      </div>
    </div>
  );
}
