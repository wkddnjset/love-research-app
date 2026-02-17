'use client';

import Link from 'next/link';
import { Sparkles, Heart, ArrowRight } from 'lucide-react';
import { ANALYSIS_MODULES } from '@/lib/constants';
import MobileHeader from '@/components/layout/MobileHeader';

const MODULE_ICONS: Record<string, React.ReactNode> = {
  report: <Sparkles className="h-7 w-7 text-white" />,
  compatibility: <Heart className="h-7 w-7 text-white" />,
};

export default function AnalysisPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <MobileHeader title="AI 분석" />

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-5 px-4 pb-8 pt-4">
        {/* 안내 */}
        <div className="rounded-2xl border border-sidebar-border bg-gradient-to-br from-sidebar to-primary/5 px-5 py-4 text-center shadow-neo">
          <span className="inline-flex items-center gap-2 text-sm font-bold text-foreground">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-4 w-4" aria-hidden />
            </span>
            모든 분석 서비스는 <span className="text-primary">무료</span>로 이용 가능해요
          </span>
        </div>

        {/* 모듈 카드 */}
        <section className="space-y-3" aria-labelledby="analysis-modules-heading">
          <h2 id="analysis-modules-heading" className="sr-only">분석 도구 목록</h2>
          {ANALYSIS_MODULES.map((module) => (
            <Link
              key={module.type}
              href={`/analysis/${module.type}`}
              className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl"
            >
              <div
                className={`group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r ${module.bgStyle} p-5 shadow-neo hover-neo transition-all duration-200`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div
                      className={`mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${module.gradient} shadow-sm ring-2 ring-white/20`}
                    >
                      {MODULE_ICONS[module.type]}
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{module.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                      {module.description}
                    </p>
                  </div>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-all group-hover:scale-110">
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </div>
                </div>
                {(module.type === 'compatibility' || module.type === 'report') && (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    {module.type === 'compatibility' && (
                      <>
                        <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] font-bold text-primary ring-1 ring-primary/20">
                          코드 기반
                        </span>
                        <span className="rounded-full bg-muted/80 px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                          링크 공유
                        </span>
                      </>
                    )}
                    {module.type === 'report' && (
                      <>
                        <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] font-bold text-primary ring-1 ring-primary/20">
                          주 1회 업데이트
                        </span>
                        <span className="rounded-full bg-muted/80 px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                          데일리 질문 반영
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
