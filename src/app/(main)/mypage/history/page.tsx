'use client';

import { Card, CardContent } from '@/components/ui/card';
import MobileHeader from '@/components/layout/MobileHeader';
import { ANALYSIS_MODULES } from '@/lib/constants';
import { useDataStore } from '@/stores/dataStore';

export default function HistoryPage() {
  const { analysisHistory } = useDataStore();

  const getModuleInfo = (type: string) =>
    ANALYSIS_MODULES.find((m) => m.type === type);

  return (
    <div>
      <MobileHeader title="분석 히스토리" showBack />

      <div className="px-4 py-4">
        {analysisHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-4xl">📊</p>
            <p className="mt-4 font-medium text-gray-600">분석 기록이 없어요</p>
            <p className="mt-1 text-sm text-gray-400">
              AI 분석을 사용하면 여기에 기록돼요
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {analysisHistory.map((item) => {
              const moduleInfo = getModuleInfo(item.moduleType);
              return (
                <Card key={item.id}>
                  <CardContent className="flex items-center gap-3 p-4">
                    <span className="text-2xl">{moduleInfo?.icon || '📊'}</span>
                    <div className="flex-1">
                      <p className="font-medium">{moduleInfo?.title || item.moduleType}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                    {item.score !== undefined && (
                      <span className="text-lg font-bold text-pink-500">
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
