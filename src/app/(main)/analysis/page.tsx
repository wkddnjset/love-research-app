'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ANALYSIS_MODULES, MAX_FREE_ANALYSIS } from '@/lib/constants';
import MobileHeader from '@/components/layout/MobileHeader';
import { useMonthlyUsage } from '@/hooks/useSupabaseData';

export default function AnalysisPage() {
  const { usedCount } = useMonthlyUsage();
  const isPremium = false; // TODO: 구독 상태 연동

  return (
    <div>
      <MobileHeader title="AI 분석" />

      <div className="space-y-4 px-4 py-4">
        {!isPremium && (
          <div className="rounded-xl border border-border bg-secondary px-4 py-3 text-center text-sm shadow-neo">
            <Sparkles className="inline h-4 w-4 text-primary mr-1" />
            이번 달 무료 분석{' '}
            <span className="font-bold text-primary">
              {usedCount}/{MAX_FREE_ANALYSIS}
            </span>
            회 사용
          </div>
        )}

        <div className="space-y-3">
          {ANALYSIS_MODULES.map((module) => (
            <Link key={module.type} href={`/analysis/${module.type}`}>
              <Card className="mb-3 shadow-neo hover-neo">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background border border-border">
                    <span className="text-2xl">{module.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{module.title}</h3>
                      {module.type === 'report' && (
                        <Badge variant="secondary" className="text-xs">
                          종합
                        </Badge>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {module.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
