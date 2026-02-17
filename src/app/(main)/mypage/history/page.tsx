'use client';

import Link from 'next/link';
import { Sparkles, Heart, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MobileHeader from '@/components/layout/MobileHeader';
import { ANALYSIS_MODULES } from '@/lib/constants';
import { useAnalysisHistory } from '@/hooks/useSupabaseData';

const MODULE_ICONS: Record<string, React.ReactNode> = {
  report: <Sparkles className="h-5 w-5 text-white" />,
  compatibility: <Heart className="h-5 w-5 text-white" />,
};

const MODULE_GRADIENTS: Record<string, string> = {
  report: 'from-pink-400 to-rose-500',
  compatibility: 'from-violet-500 to-purple-600',
};

export default function HistoryPage() {
  const { analysisHistory } = useAnalysisHistory();

  const getModuleInfo = (type: string) =>
    ANALYSIS_MODULES.find((m) => m.type === type);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <MobileHeader title="분석 히스토리" showBack />

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 px-4 pb-8 pt-4">
        {analysisHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
              <Sparkles className="h-8 w-8" />
            </div>
            <p className="text-lg font-bold text-foreground">분석 기록이 없어요</p>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              AI 분석을 사용하면 여기에 기록돼요
            </p>
            <Link href="/analysis">
              <Button className="mt-4 shadow-neo hover-neo">
                <Sparkles className="mr-2 h-4 w-4" />
                분석 시작하기
              </Button>
            </Link>
          </div>
        ) : (
          <section className="space-y-3" aria-labelledby="history-heading">
            <h2 id="history-heading" className="sr-only">분석 기록 목록</h2>

            {/* 총 건수 요약 */}
            <div className="flex items-center justify-between px-1 pb-1">
              <p className="text-sm text-muted-foreground">
                총 <span className="font-bold text-foreground">{analysisHistory.length}건</span>의 분석 기록
              </p>
            </div>

            {analysisHistory.map((item) => {
              const moduleInfo = getModuleInfo(item.moduleType);
              const gradient = MODULE_GRADIENTS[item.moduleType] || 'from-gray-400 to-gray-500';
              return (
                <Link key={item.id} href={`/mypage/history/${item.id}`} className="block">
                  <Card className="group overflow-hidden border border-border shadow-neo hover-neo cursor-pointer rounded-2xl transition-all">
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-sm`}>
                        {MODULE_ICONS[item.moduleType] || <Sparkles className="h-5 w-5 text-white" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm text-foreground">{moduleInfo?.title || item.moduleType}</p>
                        <p className="text-xs text-muted-foreground tabular-nums">
                          {new Date(item.createdAt).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {item.score !== undefined && (
                          <span className="text-lg font-bold text-primary tabular-nums">
                            {item.score}%
                          </span>
                        )}
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
}
