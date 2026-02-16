'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import MobileHeader from '@/components/layout/MobileHeader';
import ScoreGauge from '@/features/analysis/components/ScoreGauge';
import ResultCard from '@/features/analysis/components/ResultCard';
import { useDataStore } from '@/stores/dataStore';
import { useAuthStore } from '@/stores/authStore';

import type { LoveReportResult } from '@/types';

export default function ReportPage() {
  const [result, setResult] = useState<LoveReportResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { exPartners, conflicts, emotions, addAnalysisResult } = useDataStore();
  const { profile } = useAuthStore();

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const inputData = {
        mbti: profile?.mbti || null,
        exPartners: exPartners.map((p) => ({ nickname: p.nickname, mbti: p.mbti, satisfaction: p.satisfactionScore, breakupReason: p.breakupReason })),
        conflictRecords: conflicts.map((c) => ({ type: c.conflictType, severity: c.severity, resolved: c.isResolved })),
        emotionRecords: emotions.map((e) => ({ mood: e.mood, score: e.score, content: e.content })),
      };
      const res = await fetch('/api/analysis/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputData),
      });
      if (!res.ok) throw new Error('분석 실패');
      const json = await res.json();
      setResult(json);
      addAnalysisResult('report', inputData as unknown as Record<string, unknown>, json);
    } catch {
      toast.error('분석 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <MobileHeader title="나의 연애 성향" showBack />
      <div className="space-y-6 px-4 py-4">
        {!result ? (
          <div className="flex flex-col items-center py-8">
            <span className="text-6xl">📊</span>
            <h2 className="mt-4 text-xl font-bold">나의 연애 성향 리포트</h2>
            <p className="mt-2 text-center text-sm text-gray-500">
              누적된 데이터를 기반으로
              <br />
              나의 연애 패턴을 종합 분석합니다
            </p>
            <p className="mt-4 text-xs text-gray-400">
              데이터가 많을수록 분석이 정확해져요
            </p>
            <Button
              onClick={handleAnalyze}
              className="mt-6 bg-pink-500 hover:bg-pink-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />분석 중...</>
              ) : (
                '리포트 생성하기'
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl bg-gradient-to-b from-pink-50 to-white p-6 text-center">
              <p className="text-sm text-gray-500">나의 연애 유형</p>
              <h2 className="mt-2 text-2xl font-bold text-pink-600">{result.loveType}</h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ScoreGauge score={result.emotionalDependency} label="감정 의존도" size="sm" />
              <ScoreGauge score={result.obsessionIndex} label="집착 지수" size="sm" />
              <ScoreGauge score={result.avoidanceIndex} label="회피 지수" size="sm" />
              <ScoreGauge score={result.longTermCompatibility} label="장기 연애 적합도" size="sm" />
            </div>

            <ResultCard title="이상형 추천" icon="💘">
              <p>{result.idealTypeRecommendation}</p>
            </ResultCard>

            <ResultCard title="종합 분석" icon="📋">
              <p>{result.summary}</p>
            </ResultCard>

            <Button onClick={() => setResult(null)} variant="outline" className="w-full">
              다시 분석하기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
