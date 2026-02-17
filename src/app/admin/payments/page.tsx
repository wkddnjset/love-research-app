'use client';

import { Card, CardContent } from '@/components/ui/card';

export default function AdminPaymentsPage() {
  return (
    <div className="animate-in fade-in duration-500">
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-foreground">결제 관리</h1>

      <div className="mb-8 grid grid-cols-3 gap-6">
        <Card className="border border-border shadow-neo">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">총 티켓 판매</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">0</p>
          </CardContent>
        </Card>
        <Card className="border border-border shadow-neo">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">이번 달 매출</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">₩0</p>
          </CardContent>
        </Card>
        <Card className="border border-border shadow-neo">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">결제 실패</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-destructive">0</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-border shadow-neo overflow-hidden rounded-lg">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/40">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-foreground">유저</th>
                  <th className="px-6 py-4 text-left font-semibold text-foreground">타입</th>
                  <th className="px-6 py-4 text-left font-semibold text-foreground">상태</th>
                  <th className="px-6 py-4 text-left font-semibold text-foreground">금액</th>
                  <th className="px-6 py-4 text-left font-semibold text-foreground">결제일</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    결제 내역이 없습니다.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
