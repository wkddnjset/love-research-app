'use client';

import Link from 'next/link';
import { Heart, ArrowRight, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ANALYSIS_MODULES } from '@/lib/constants';
import MobileHeader from '@/components/layout/MobileHeader';

export default function HomePage() {
  return (
    <div>
      <MobileHeader title="사랑연구소" />

      <div className="space-y-6 px-4 py-4">
        {/* 인사 영역 */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-secondary to-card p-6 shadow-neo-md">
          <div className="relative z-10">
            <p className="text-sm font-medium text-muted-foreground">안녕하세요 👋</p>
            <h2 className="mt-2 text-xl font-bold text-foreground leading-tight">
              오늘의 <span className="text-primary">연애 고민</span>은
              <br />
              무엇인가요?
            </h2>
          </div>
          <div className="absolute right-[-10px] bottom-[-20px] opacity-10 rotate-12">
            <Heart className="h-32 w-32 text-primary" fill="currentColor" />
          </div>
        </div>

        {/* 오늘의 감정 기록 CTA */}
        <Card className="group shadow-neo hover-neo">
          <CardContent className="flex items-center justify-between p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary shadow-neo group-hover:scale-110 transition-transform">
                <Heart className="h-6 w-6" fill="currentColor" />
              </div>
              <div>
                <p className="text-base font-bold text-card-foreground">오늘의 감정 기록</p>
                <p className="text-xs text-muted-foreground">지금 기분은 어떤가요?</p>
              </div>
            </div>
            <Link href="/data/emotions">
              <Button variant="ghost" size="sm">
                기록하기
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* AI 분석 모듈 */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              AI 분석
            </h3>
            <Link href="/analysis" className="text-sm font-medium text-primary hover:underline">
              전체보기
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {ANALYSIS_MODULES.slice(0, 4).map((module) => (
              <Link key={module.type} href={`/analysis/${module.type}`}>
                <Card className="shadow-neo hover-neo h-full">
                  <CardContent className="p-4 flex flex-col h-full justify-between">
                    <div>
                      <div className="mb-3 w-fit p-2 rounded-lg bg-background border border-border">
                        <span className="text-2xl">{module.icon}</span>
                      </div>
                      <p className="text-sm font-bold text-foreground">{module.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {module.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* 하단 배너 */}
        <div className="p-4 rounded-xl bg-sidebar border border-sidebar-border text-center">
          <p className="text-xs text-muted-foreground">
            사랑연구소는 여러분의 예쁜 사랑을 응원합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
