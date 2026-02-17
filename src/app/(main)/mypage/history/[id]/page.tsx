'use client';

import { use } from 'react';
import Link from 'next/link';
import { Sparkles, Heart, ChevronLeft, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MobileHeader from '@/components/layout/MobileHeader';
import ScoreGauge from '@/features/analysis/components/ScoreGauge';
import ResultCard from '@/features/analysis/components/ResultCard';
import { useAnalysisDetail } from '@/hooks/useSupabaseData';

import type { LoveReportResult, CompatibilityAnalysisResult } from '@/types';

const MODULE_META: Record<string, { title: string; gradient: string; Icon: typeof Sparkles }> = {
  report: { title: '나의 연애 성향', gradient: 'from-pink-400 to-rose-500', Icon: Sparkles },
  compatibility: { title: '궁합 분석', gradient: 'from-violet-500 to-purple-600', Icon: Heart },
};

export default function HistoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: analysis, isLoading } = useAnalysisDetail(id);

  const meta = MODULE_META[analysis?.moduleType ?? ''] ?? MODULE_META.report;

  if (isLoading) {
    return (
      <div>
        <MobileHeader title="분석 상세" showBack />
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div>
        <MobileHeader title="분석 상세" showBack />
        <div className="flex flex-col items-center justify-center px-5 py-20 text-center">
          <p className="font-bold text-foreground">결과를 찾을 수 없어요</p>
          <p className="mt-1 text-sm text-muted-foreground">삭제되었거나 존재하지 않는 분석입니다</p>
          <Link href="/mypage/history">
            <Button variant="outline" className="mt-4 shadow-neo hover-neo">
              <ChevronLeft className="mr-1 h-4 w-4" />
              히스토리로 돌아가기
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isReport = analysis.moduleType === 'report';
  const reportResult = isReport ? (analysis.result as unknown as LoveReportResult) : null;
  const compatResult = !isReport ? (analysis.result as unknown as CompatibilityAnalysisResult) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <MobileHeader title={meta.title} showBack />

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4 px-4 pb-8 pt-4">
        {/* 헤더 카드 */}
        <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-b from-primary/10 to-background p-6 text-center shadow-neo">
          <div className="relative z-10">
            <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${meta.gradient} shadow-sm`}>
              <meta.Icon className="h-7 w-7 text-white" />
            </div>
            {isReport && reportResult ? (
              <>
                <p className="mt-3 text-xs font-medium text-muted-foreground tracking-wide uppercase">My Love Type</p>
                <h2 className="mt-1 text-2xl font-bold text-primary">{reportResult.loveType}</h2>
              </>
            ) : compatResult ? (
              <>
                <p className="mt-3 text-xs font-medium text-muted-foreground tracking-wide uppercase">Compatibility Score</p>
                <div className="mt-3 flex justify-center">
                  <ScoreGauge score={compatResult.score ?? analysis.score ?? 0} label="" size="lg" />
                </div>
              </>
            ) : null}
            <div className="mt-3 flex items-center justify-center gap-1 text-xs text-muted-foreground/70">
              <Clock className="h-3 w-3" />
              {new Date(analysis.createdAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        </div>

        {/* 리포트 상세 */}
        {isReport && reportResult && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Card className="overflow-hidden border border-border p-3 rounded-2xl shadow-neo">
                <div className="flex flex-col items-center">
                  <ScoreGauge score={reportResult.emotionalDependency} label="감정 의존도" size="sm" />
                </div>
              </Card>
              <Card className="overflow-hidden border border-border p-3 rounded-2xl shadow-neo">
                <div className="flex flex-col items-center">
                  <ScoreGauge score={reportResult.obsessionIndex} label="집착 지수" size="sm" />
                </div>
              </Card>
              <Card className="overflow-hidden border border-border p-3 rounded-2xl shadow-neo">
                <div className="flex flex-col items-center">
                  <ScoreGauge score={reportResult.avoidanceIndex} label="회피 지수" size="sm" />
                </div>
              </Card>
              <Card className="overflow-hidden border border-border p-3 rounded-2xl shadow-neo">
                <div className="flex flex-col items-center">
                  <ScoreGauge score={reportResult.longTermCompatibility} label="장기 적합도" size="sm" />
                </div>
              </Card>
            </div>

            <ResultCard title="이상형 추천" icon="💘">
              <p className="leading-relaxed">{reportResult.idealTypeRecommendation}</p>
            </ResultCard>

            <ResultCard title="종합 분석" icon="📋">
              <p className="leading-relaxed">{reportResult.summary}</p>
            </ResultCard>
          </>
        )}

        {/* 궁합 상세 */}
        {!isReport && compatResult && (
          <>
            <ResultCard title="우리의 강점" icon="💪">
              <ul className="space-y-1.5">
                {compatResult.strengths?.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </ResultCard>

            <ResultCard title="주의할 점" icon="⚡">
              <ul className="space-y-1.5">
                {compatResult.weaknesses?.map((w, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </ResultCard>

            {compatResult.cautions && compatResult.cautions.length > 0 && (
              <ResultCard title="주의 사항" icon="🔔">
                <ul className="space-y-1.5">
                  {compatResult.cautions.map((c, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-500" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </ResultCard>
            )}

            <ResultCard title="꼭 기억하세요" icon="💡">
              <p className="leading-relaxed">{compatResult.advice}</p>
            </ResultCard>
          </>
        )}

        {/* 하단 네비게이션 */}
        <div className="flex gap-3 pt-2">
          <Link href="/mypage/history" className="flex-1">
            <Button variant="outline" className="w-full shadow-neo hover-neo">
              <ChevronLeft className="mr-1 h-4 w-4" />
              전체 히스토리
            </Button>
          </Link>
          <Link href={isReport ? '/analysis/report' : '/analysis/compatibility'} className="flex-1">
            <Button className="w-full shadow-neo hover-neo">
              다시 분석하기
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
