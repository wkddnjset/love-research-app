'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function AdminUsersPage() {
  return (
    <div className="animate-in fade-in duration-500">
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-foreground">유저 관리</h1>

      <div className="mb-6 flex items-center gap-4">
        <Input placeholder="유저 검색 (이메일, 닉네임)..." className="h-10 w-80" />
      </div>

      <Card className="border border-border shadow-neo overflow-hidden rounded-lg">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/40">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-foreground">닉네임</th>
                  <th className="px-6 py-4 text-left font-semibold text-foreground">이메일</th>
                  <th className="px-6 py-4 text-left font-semibold text-foreground">플랜</th>
                  <th className="px-6 py-4 text-left font-semibold text-foreground">분석 횟수</th>
                  <th className="px-6 py-4 text-left font-semibold text-foreground">가입일</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    아직 가입한 유저가 없습니다.
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
