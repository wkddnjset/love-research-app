'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, ArrowRight, Sparkles, Users, Copy, Check, MessageSquareHeart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ANALYSIS_MODULES } from '@/lib/constants';
import MobileHeader from '@/components/layout/MobileHeader';
import { useUserCode } from '@/hooks/useUserCode';
import { toast } from 'sonner';

const MODULE_ICONS: Record<string, React.ReactNode> = {
  report: <Sparkles className="h-6 w-6 text-white" />,
  compatibility: <Heart className="h-6 w-6 text-white" />,
};

export default function HomePage() {
  const userCode = useUserCode();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    if (!userCode) return;
    try {
      await navigator.clipboard.writeText(userCode);
      setCopied(true);
      toast.success('코드가 복사되었습니다!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('복사에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <MobileHeader title="사랑연구소" />

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-5 px-4 pb-8 pt-4">
        {/* 1. Hero / Greeting */}
        <div className="relative overflow-hidden rounded-2xl border border-sidebar-border bg-gradient-to-br from-sidebar via-sidebar to-primary/5 p-6 shadow-neo transition-shadow duration-300">
          <div className="relative z-10">
            <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-primary">
              안녕하세요 <span className="animate-pulse" aria-hidden>👋</span>
            </p>
            <h2 className="text-xl font-bold leading-tight tracking-tight text-foreground sm:text-2xl">
              데이터 기반{' '}
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                AI 연애 분석
              </span>
              <br />
              <span className="text-foreground/90">지금 바로 시작하세요</span>
            </h2>
          </div>
          <div className="absolute -right-6 -bottom-8 opacity-[0.07] dark:opacity-[0.12]" aria-hidden>
            <Heart className="h-44 w-44 text-foreground rotate-12" fill="currentColor" />
          </div>
          <div className="absolute right-12 top-4 opacity-[0.05] dark:opacity-[0.08]" aria-hidden>
            <Heart className="h-20 w-20 text-foreground -rotate-45" fill="currentColor" />
          </div>
        </div>

        {/* 2. 나의 코드 */}
        {userCode && (
          <Card className="overflow-hidden border border-primary/25 bg-card/80 shadow-neo backdrop-blur-sm">
            <CardContent className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  나의 코드
                </p>
                <p className="mt-1 font-mono text-lg font-bold tracking-[0.2em] text-primary tabular-nums">
                  {userCode}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-9 shrink-0 shadow-neo hover-neo border-primary/30 bg-background/80"
                onClick={handleCopyCode}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span className="ml-2 text-xs font-medium">{copied ? '복사됨' : '복사'}</span>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* 3. 데일리 연애 질문 CTA */}
        <Link href="/data/daily" className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl">
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-neo hover-neo transition-all duration-200">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105 group-hover:bg-primary/15">
                  <MessageSquareHeart className="h-6 w-6" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-card-foreground">데일리 연애 질문</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">오늘의 질문에 답해보세요</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center text-xs font-medium text-muted-foreground transition-colors group-hover:text-primary">
                답변하기
                <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>
        </Link>

        {/* 4. AI 분석 모듈 */}
        <section className="space-y-3" aria-labelledby="ai-analysis-heading">
          <div className="flex items-center justify-between px-0.5">
            <h3
              id="ai-analysis-heading"
              className="flex items-center gap-2 font-bold text-lg text-foreground"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sparkles className="h-4 w-4" aria-hidden />
              </span>
              AI 분석
            </h3>
            <Link
              href="/analysis"
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md"
            >
              전체보기
            </Link>
          </div>

          <div className="space-y-3">
            {ANALYSIS_MODULES.map((module) => (
              <Link
                key={module.type}
                href={`/analysis/${module.type}`}
                className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl"
              >
                <div
                  className={`relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r ${module.bgStyle} p-5 shadow-neo hover-neo transition-all duration-200`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${module.gradient} shadow-sm ring-2 ring-white/20`}
                    >
                      {MODULE_ICONS[module.type]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-base text-foreground">{module.title}</h4>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                        {module.description}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/60" aria-hidden />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 5. 매칭 서비스 배너 */}
        <Link href="/matching" className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl">
          <div className="group relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-sidebar to-primary/10 p-5 shadow-neo-md hover-neo transition-all duration-200">
            <div className="relative z-10 flex items-center justify-between gap-4">
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/30">
                  <Users className="h-6 w-6" aria-hidden />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-foreground">매칭 서비스</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    <span className="font-semibold text-primary">얼리버드 29,000원</span>
                    <span className="text-muted-foreground"> — 지금 선결제하세요</span>
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-xs font-bold text-primary whitespace-nowrap transition-transform duration-200 group-hover:translate-x-0.5">
                바로가기 →
              </span>
            </div>
          </div>
        </Link>

        {/* 6. 하단 */}
        <div className="rounded-2xl border border-border/50 bg-muted/20 px-4 py-5 text-center">
          <p className="text-xs text-muted-foreground leading-relaxed">
            사랑연구소는 여러분의 예쁜 사랑을 응원합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
