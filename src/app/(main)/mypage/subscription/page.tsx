'use client';

import { Crown, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MobileHeader from '@/components/layout/MobileHeader';

const PREMIUM_FEATURES = [
  'AI 분석 무제한',
  '전체 연애 성향 리포트',
  '히스토리 분석',
  '우선 분석 처리',
];

export default function SubscriptionPage() {
  const paymentLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK;

  return (
    <div>
      <MobileHeader title="구독 관리" showBack />

      <div className="space-y-6 px-4 py-4">
        {/* 현재 플랜 */}
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">현재 플랜</p>
            <h2 className="mt-1 text-xl font-bold">무료 플랜</h2>
            <p className="mt-1 text-sm text-gray-500">월 3회 AI 분석 가능</p>
          </CardContent>
        </Card>

        {/* 프리미엄 안내 */}
        <Card className="border-pink-200 bg-gradient-to-b from-pink-50 to-white">
          <CardContent className="p-5">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-pink-500" />
              <h3 className="text-lg font-bold">프리미엄</h3>
            </div>
            <div className="mt-4 space-y-2">
              {PREMIUM_FEATURES.map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-pink-500" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            <Button
              className="mt-6 w-full bg-pink-500 hover:bg-pink-600"
              onClick={() => {
                if (paymentLink) window.open(paymentLink, '_blank');
              }}
            >
              프리미엄 구독하기
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
