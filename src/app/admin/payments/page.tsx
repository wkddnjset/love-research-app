'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AdminPaymentsPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">결제 관리</h1>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-500">총 구독자</p>
            <p className="mt-1 text-2xl font-bold">0</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-500">이번 달 매출</p>
            <p className="mt-1 text-2xl font-bold">₩0</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-500">결제 실패</p>
            <p className="mt-1 text-2xl font-bold text-red-500">0</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">유저</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">플랜</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">상태</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">금액</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">결제일</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  결제 내역이 없습니다.
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
