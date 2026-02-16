'use client';

import { Crown, Check, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MobileHeader from '@/components/layout/MobileHeader';
import { usePaddle } from '@/hooks/usePaddle';

const PREMIUM_FEATURES = [
  'AI 분석 무제한',
  '전체 연애 성향 리포트',
  '히스토리 분석',
  '우선 분석 처리',
];

export default function SubscriptionPage() {
  const paddle = usePaddle();
  const priceId = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID;

  const handleSubscribe = () => {
    if (!paddle || !priceId) return;
    paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
    });
  };

  return (
    <div>
      <MobileHeader title="구독 관리" showBack />

      <div className="space-y-6 px-4 py-4">
        {/* 현재 플랜 */}
        <Card className="shadow-neo">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">현재 플랜</p>
            <h2 className="mt-1 text-xl font-bold text-foreground">무료 플랜</h2>
            <p className="mt-1 text-sm text-muted-foreground">월 3회 AI 분석 가능</p>
          </CardContent>
        </Card>

        {/* 프리미엄 안내 */}
        <Card className="shadow-neo-md border-primary/30 bg-gradient-to-b from-secondary to-card">
          <CardContent className="p-5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                <Crown className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold">프리미엄</h3>
            </div>
            <div className="mt-4 space-y-2.5">
              {PREMIUM_FEATURES.map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
            <Button
              className="mt-6 w-full shadow-neo hover-neo"
              onClick={handleSubscribe}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              프리미엄 구독하기
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
