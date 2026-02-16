'use client';

import { Users, CreditCard, BarChart3, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const STATS = [
  { label: '총 유저', value: '0', Icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
  { label: '활성 구독', value: '0', Icon: CreditCard, color: 'text-green-500', bg: 'bg-green-50' },
  { label: '이번 달 분석', value: '0', Icon: BarChart3, color: 'text-purple-500', bg: 'bg-purple-50' },
  { label: '이번 달 매출', value: '₩0', Icon: TrendingUp, color: 'text-pink-500', bg: 'bg-pink-50' },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">대시보드</h1>

      <div className="grid grid-cols-2 gap-4">
        {STATS.map(({ label, value, Icon, color, bg }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${bg}`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="text-xl font-bold">{value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardContent className="p-6">
          <h2 className="mb-4 font-semibold">최근 가입 유저</h2>
          <p className="text-sm text-gray-500">아직 가입한 유저가 없습니다.</p>
        </CardContent>
      </Card>
    </div>
  );
}
