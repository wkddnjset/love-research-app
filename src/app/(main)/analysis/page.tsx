'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ANALYSIS_MODULES, MAX_FREE_ANALYSIS } from '@/lib/constants';
import MobileHeader from '@/components/layout/MobileHeader';
import { useDataStore } from '@/stores/dataStore';

export default function AnalysisPage() {
  const { analysisHistory } = useDataStore();

  // 이번 달 사용 횟수 계산
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const usedCount = analysisHistory.filter((a) => a.createdAt >= monthStart).length;
  const isPremium = false; // TODO: 구독 상태 연동

  return (
    <div>
      <MobileHeader title="AI 분석" />

      <div className="space-y-4 px-4 py-4">
        {!isPremium && (
          <div className="rounded-xl bg-gray-50 px-4 py-3 text-center text-sm">
            이번 달 무료 분석{' '}
            <span className="font-bold text-pink-500">
              {usedCount}/{MAX_FREE_ANALYSIS}
            </span>
            회 사용
          </div>
        )}

        <div className="space-y-3">
          {ANALYSIS_MODULES.map((module) => (
            <Link key={module.type} href={`/analysis/${module.type}`}>
              <Card className={`border ${module.color} mb-3 transition-shadow hover:shadow-md`}>
                <CardContent className="flex items-center gap-4 p-4">
                  <span className="text-3xl">{module.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{module.title}</h3>
                      {module.type === 'report' && (
                        <Badge variant="secondary" className="text-xs">
                          종합
                        </Badge>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
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
