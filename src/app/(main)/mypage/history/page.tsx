'use client';

import { Card, CardContent } from '@/components/ui/card';
import MobileHeader from '@/components/layout/MobileHeader';
import { ANALYSIS_MODULES } from '@/lib/constants';
import { useAnalysisHistory } from '@/hooks/useSupabaseData';

export default function HistoryPage() {
  const { analysisHistory } = useAnalysisHistory();

  const getModuleInfo = (type: string) =>
    ANALYSIS_MODULES.find((m) => m.type === type);

  return (
    <div>
      <MobileHeader title="분석 히스토리" showBack />

      <div className="px-4 py-4">
        {analysisHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary border border-border shadow-neo mb-4">
              <span className="text-3xl">📊</span>
            </div>
            <p className="font-bold text-foreground">분석 기록이 없어요</p>
            <p className="mt-1 text-sm text-muted-foreground">
              AI 분석을 사용하면 여기에 기록돼요
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {analysisHistory.map((item) => {
              const moduleInfo = getModuleInfo(item.moduleType);
              return (
                <Card key={item.id} className="shadow-neo">
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background border border-border">
                      <span className="text-xl">{moduleInfo?.icon || '📊'}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm">{moduleInfo?.title || item.moduleType}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                    {item.score !== undefined && (
                      <span className="text-lg font-bold text-primary">
                        {item.score}%
                      </span>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
