'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, RefreshCw, Sparkles, Heart, MessageSquareHeart, History } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import MobileHeader from '@/components/layout/MobileHeader';
import ScoreGauge from '@/features/analysis/components/ScoreGauge';
import ResultCard from '@/features/analysis/components/ResultCard';
import { useExPartners, useAnalysisHistory } from '@/hooks/useSupabaseData';
import { useRecentAnswers } from '@/hooks/useDailyQuestion';
import { useAuthStore } from '@/stores/authStore';

import type { LoveReportResult } from '@/types';

function canUpdateReport(lastReportAt?: string): boolean {
  if (!lastReportAt) return true;
  const last = new Date(lastReportAt);
  const now = new Date();
  const diffDays = (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= 7;
}

function daysUntilUpdate(lastReportAt?: string): number {
  if (!lastReportAt) return 0;
  const last = new Date(lastReportAt);
  const nextAvailable = new Date(last.getTime() + 7 * 24 * 60 * 60 * 1000);
  const now = new Date();
  return Math.max(0, Math.ceil((nextAvailable.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

export default function ReportPage() {
  const [result, setResult] = useState<LoveReportResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { exPartners } = useExPartners();
  const { addAnalysisResult } = useAnalysisHistory();
  const { data: recentAnswers } = useRecentAnswers(10);
  const { profile } = useAuthStore();

  const canUpdate = canUpdateReport(profile?.lastReportAt);
  const remaining = daysUntilUpdate(profile?.lastReportAt);

  const handleAnalyze = async () => {
    if (!canUpdate) {
      toast.error(`${remaining}일 후에 업데이트할 수 있어요`);
      return;
    }

    setIsLoading(true);
    try {
      const inputData = {
        mbti: profile?.mbti || null,
        mbtiWeights: profile?.mbtiWeights || null,
        exPartners: exPartners.map((p) => ({
          nickname: p.nickname,
          mbti: p.mbti,
          styleAnswers: p.styleAnswers,
          goodPoints: p.goodPoints,
          breakupReason: p.breakupReason,
          conflictTypes: p.conflictTypes,
        })),
      };
      const res = await fetch('/api/analysis/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputData),
      });
      if (!res.ok) throw new Error('분석 실패');
      const json = await res.json();
      setResult(json);
      await addAnalysisResult({
        moduleType: 'report',
        inputData: inputData,
        result: json,
      });
    } catch {
      toast.error('분석 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <MobileHeader title="나의 연애 성향" showBack />
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-5 px-4 pb-8 pt-4">
        {!result ? (
          <>
            <div className="relative overflow-hidden rounded-2xl border border-sidebar-border bg-gradient-to-br from-sidebar via-sidebar to-primary/5 p-6 shadow-neo">
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 shadow-sm ring-2 ring-white/20">
                  <Sparkles className="h-8 w-8 text-white" aria-hidden />
                </div>
                <h2 className="mt-4 text-xl font-bold text-foreground">나의 연애 성향 리포트</h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  누적된 데이터를 기반으로
                  <br />
                  나의 연애 패턴을 AI가 종합 분석합니다
                </p>
                <p className="mt-3 text-xs text-muted-foreground/70">
                  데이터가 많을수록 분석이 정확해져요
                </p>

                {!canUpdate && (
                  <div className="mt-4 rounded-xl bg-muted/50 px-4 py-2.5 text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                    <RefreshCw className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    {remaining}일 후 업데이트 가능 (주 1회)
                  </div>
                )}

                <Button
                  onClick={handleAnalyze}
                  className="mt-6 h-12 px-8 text-base font-bold shadow-neo hover-neo"
                  disabled={isLoading || !canUpdate}
                >
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden />분석 중...</>
                  ) : (
                    <><Sparkles className="mr-2 h-5 w-5" aria-hidden />리포트 생성하기</>
                  )}
                </Button>
              </div>
              <div className="absolute -right-4 -bottom-6 opacity-[0.06] dark:opacity-[0.1]" aria-hidden>
                <Heart className="h-32 w-32 text-foreground rotate-12" fill="currentColor" />
              </div>
            </div>

            <Card className="overflow-hidden border border-border shadow-neo rounded-2xl">
              <CardContent className="p-5">
                <h3 className="font-bold text-foreground flex items-center gap-2 text-base">
                  📋 분석에 사용되는 데이터
                </h3>
                <div className="mt-3 space-y-2">
                  {[
                    { label: 'MBTI', value: profile?.mbti || '미입력' },
                    { label: '과거 연애', value: `${exPartners.length}건` },
                    { label: '데일리 답변', value: `${recentAnswers?.length ?? 0}건 (최근 10개)` },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between rounded-lg bg-muted/30 px-4 py-2.5">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className="text-sm font-bold text-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 데일리 질문 유도 */}
            <Link href="/data/daily" className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl">
              <Card className="group overflow-hidden border border-primary/20 shadow-neo hover-neo cursor-pointer rounded-2xl">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                    <MessageSquareHeart className="h-5 w-5" aria-hidden />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">데일리 질문에 답변하세요</p>
                    <p className="text-xs text-muted-foreground">더 정확한 분석을 위해 매일 답변해주세요</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </>
        ) : (
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-b from-primary/10 to-background p-6 text-center shadow-neo">
              <Sparkles className="absolute top-3 right-3 h-5 w-5 text-primary/30" />
              <p className="text-xs font-medium text-muted-foreground tracking-wide uppercase">My Love Type</p>
              <h2 className="mt-2 text-2xl font-bold text-primary">{result.loveType}</h2>
            </div>

            {/* 지수 게이지 */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="overflow-hidden border border-border p-3 rounded-2xl shadow-neo">
                <div className="flex flex-col items-center">
                  <ScoreGauge score={result.emotionalDependency} label="감정 의존도" size="sm" />
                </div>
              </Card>
              <Card className="overflow-hidden border border-border p-3 rounded-2xl shadow-neo">
                <div className="flex flex-col items-center">
                  <ScoreGauge score={result.obsessionIndex} label="집착 지수" size="sm" />
                </div>
              </Card>
              <Card className="overflow-hidden border border-border p-3 rounded-2xl shadow-neo">
                <div className="flex flex-col items-center">
                  <ScoreGauge score={result.avoidanceIndex} label="회피 지수" size="sm" />
                </div>
              </Card>
              <Card className="overflow-hidden border border-border p-3 rounded-2xl shadow-neo">
                <div className="flex flex-col items-center">
                  <ScoreGauge score={result.longTermCompatibility} label="장기 적합도" size="sm" />
                </div>
              </Card>
            </div>

            <ResultCard title="이상형 추천" icon="💘">
              <p className="leading-relaxed">{result.idealTypeRecommendation}</p>
            </ResultCard>

            <ResultCard title="종합 분석" icon="📋">
              <p className="leading-relaxed">{result.summary}</p>
            </ResultCard>

            <Link href="/matching" className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl">
              <Card className="overflow-hidden border border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5 shadow-neo hover-neo cursor-pointer rounded-2xl">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                    <Heart className="h-6 w-6" fill="currentColor" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-foreground">소개 받기</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      나와 잘 맞는 상대를 매칭해드려요
                    </p>
                  </div>
                  <span className="text-xs font-bold text-primary">바로가기 &rarr;</span>
                </CardContent>
              </Card>
            </Link>

            <Link href="/mypage/history" className="block">
              <Card className="group overflow-hidden border border-border bg-muted/20 hover-neo cursor-pointer rounded-2xl transition-all">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <History className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">분석 히스토리</p>
                    <p className="text-xs text-muted-foreground">과거 분석 결과를 확인하세요</p>
                  </div>
                  <span className="text-xs font-medium text-primary shrink-0">보기 &rarr;</span>
                </CardContent>
              </Card>
            </Link>

            <Button onClick={() => setResult(null)} variant="outline" className="w-full shadow-neo hover-neo">
              다시 분석하기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
