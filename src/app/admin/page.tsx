'use client';

import { Users, CreditCard, BarChart3, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const STATS = [
  { label: '총 유저', value: '0', Icon: Users, gradient: 'from-blue-400 to-blue-500' },
  { label: '매칭 티켓', value: '0', Icon: CreditCard, gradient: 'from-emerald-400 to-emerald-500' },
  { label: '이번 달 분석', value: '0', Icon: BarChart3, gradient: 'from-violet-400 to-violet-500' },
  { label: '이번 달 매출', value: '₩0', Icon: TrendingUp, gradient: 'from-pink-400 to-rose-500' },
];

export default function AdminDashboardPage() {
  return (
    <div className="animate-in fade-in duration-500">
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-foreground">대시보드</h1>

      <div className="grid grid-cols-4 gap-6">
        {STATS.map(({ label, value, Icon, gradient }) => (
          <Card key={label} className="border border-border shadow-neo">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-sm`}>
                  <Icon className="h-6 w-6 text-white" aria-hidden />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="mt-0.5 text-xl font-bold tabular-nums text-foreground">{value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8 border border-border shadow-neo">
        <CardContent className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">최근 가입 유저</h2>
          <p className="text-sm text-muted-foreground">아직 가입한 유저가 없습니다.</p>
        </CardContent>
      </Card>
    </div>
  );
}
