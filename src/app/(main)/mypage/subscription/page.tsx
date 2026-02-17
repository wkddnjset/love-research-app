'use client';

import Link from 'next/link';
import { Ticket, Heart, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MobileHeader from '@/components/layout/MobileHeader';
import { useMatchingTickets } from '@/hooks/useMatchingTickets';
import { MATCHING_EARLYBIRD_PRICE } from '@/lib/constants';

export default function SubscriptionPage() {
  const { tickets, unusedCount } = useMatchingTickets();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <MobileHeader title="매칭 티켓" showBack />

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-5 px-4 pb-8 pt-4">
        <Card className="overflow-hidden border border-primary/25 shadow-neo-md rounded-2xl bg-card/95">
          <CardContent className="p-5 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto">
              <Ticket className="h-6 w-6" aria-hidden />
            </span>
            <p className="mt-2 text-sm text-muted-foreground">보유 매칭 티켓</p>
            <p className="mt-1 text-3xl font-bold text-primary tabular-nums">{unusedCount}<span className="text-base font-medium text-muted-foreground ml-1">매</span></p>
          </CardContent>
        </Card>

        <Link href="/matching" className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl">
          <Card className="overflow-hidden border border-border shadow-neo hover-neo cursor-pointer rounded-2xl">
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Heart className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <p className="font-bold text-foreground">매칭 티켓 구매</p>
                  <p className="text-xs text-muted-foreground">
                    얼리버드 <span className="font-semibold text-primary">{MATCHING_EARLYBIRD_PRICE.toLocaleString()}원</span>
                  </p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" aria-hidden />
            </CardContent>
          </Card>
        </Link>

        {tickets.length > 0 && (
          <Card className="overflow-hidden border border-border shadow-neo rounded-2xl">
            <CardContent className="p-5">
              <h3 className="flex items-center gap-2 font-bold text-foreground mb-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Ticket className="h-3.5 w-3.5" aria-hidden />
                </span>
                구매 내역
              </h3>
              <div className="space-y-2">
                {tickets.map((t: { id: string; purchase_type: string; price: number; status: string; purchased_at: string }) => (
                  <div key={t.id} className="flex items-center justify-between rounded-xl bg-muted/30 px-3 py-2.5">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {t.purchase_type === 'earlybird' ? '얼리버드' : '정가'} 티켓
                      </p>
                      <p className="text-xs text-muted-foreground tabular-nums">
                        {new Date(t.purchased_at).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground tabular-nums">{t.price.toLocaleString()}원</p>
                      <p className={`text-[10px] font-medium ${t.status === 'unused' ? 'text-primary' : 'text-muted-foreground'}`}>
                        {t.status === 'unused' ? '미사용' : t.status === 'used' ? '사용완료' : '환불'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="rounded-2xl border border-border/50 bg-muted/20 px-4 py-5 text-center">
          <p className="text-xs text-muted-foreground leading-relaxed">
            매칭 서비스는 남/여 각 300명 이상 가입 시 오픈됩니다
            <br />
            서비스 미오픈 시 전액 환불 보장
          </p>
        </div>
      </div>
    </div>
  );
}
