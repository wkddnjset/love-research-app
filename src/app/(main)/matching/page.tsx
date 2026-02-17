'use client';

import { useState } from 'react';
import { Heart, Ticket, Users, Sparkles, Minus, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import MobileHeader from '@/components/layout/MobileHeader';
import { useMatchingTickets } from '@/hooks/useMatchingTickets';
import { useAuthStore } from '@/stores/authStore';
import { usePaddle } from '@/hooks/usePaddle';
import {
  MATCHING_EARLYBIRD_PRICE,
  MATCHING_REGULAR_PRICE,
  MATCHING_MAX_TICKETS,
  MATCHING_MIN_USERS,
} from '@/lib/constants';

export default function MatchingPage() {
  const [ticketCount, setTicketCount] = useState(1);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { unusedCount } = useMatchingTickets();
  const { user } = useAuthStore();
  const paddle = usePaddle();

  const totalPrice = MATCHING_EARLYBIRD_PRICE * ticketCount;
  const maxPurchasable = MATCHING_MAX_TICKETS - unusedCount;

  const handlePurchase = async () => {
    if (!paddle || !user) {
      toast.error('잠시 후 다시 시도해주세요');
      return;
    }

    const priceId = process.env.NEXT_PUBLIC_PADDLE_EARLYBIRD_PRICE_ID;
    if (!priceId) {
      toast.error('결제 설정이 필요합니다');
      return;
    }

    setIsPurchasing(true);
    try {
      paddle.Checkout.open({
        items: [{ priceId, quantity: ticketCount }],
        customData: {
          user_id: user.id,
          ticket_count: ticketCount,
          purchase_type: 'earlybird',
        },
      });
    } catch {
      toast.error('결제 창을 열 수 없습니다');
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <MobileHeader title="매칭 서비스" showBack />

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-5 px-4 pb-8 pt-4">
        {/* 히어로 섹션 */}
        <div className="relative overflow-hidden rounded-2xl border border-sidebar-border bg-gradient-to-br from-sidebar via-sidebar to-primary/5 p-6 text-center shadow-neo">
          <div className="relative z-10">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 shadow-sm ring-2 ring-white/20">
              <Heart className="h-8 w-8 text-white" fill="currentColor" aria-hidden />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">소개팅 매칭</h1>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              AI가 분석한 연애 성향 데이터를 기반으로
              <br />
              나와 잘 맞는 상대를 매칭해드려요
            </p>
          </div>
          <div className="absolute -right-6 -bottom-8 opacity-[0.06] dark:opacity-[0.1]" aria-hidden>
            <Heart className="h-40 w-40 text-foreground rotate-12" fill="currentColor" />
          </div>
        </div>

        {/* 서비스 오픈 조건 */}
        <Card className="overflow-hidden border border-border shadow-neo rounded-2xl">
          <CardContent className="p-5">
            <h3 className="flex items-center gap-2 font-bold text-base text-foreground">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Users className="h-4 w-4" aria-hidden />
              </span>
              서비스 오픈 조건
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              남성/여성 각각 <span className="font-bold text-foreground">{MATCHING_MIN_USERS}명</span> 이상
              가입자가 모이면 매칭 서비스가 시작됩니다.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-3 text-center">
                <p className="text-xs text-muted-foreground">남성 가입자</p>
                <p className="mt-1 text-lg font-bold text-blue-600 dark:text-blue-400">모집 중</p>
              </div>
              <div className="rounded-2xl border border-pink-500/20 bg-pink-500/10 p-3 text-center">
                <p className="text-xs text-muted-foreground">여성 가입자</p>
                <p className="mt-1 text-lg font-bold text-pink-600 dark:text-pink-400">모집 중</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 가격 안내 */}
        <Card className="overflow-hidden border border-border shadow-neo rounded-2xl">
          <CardContent className="p-5">
            <h3 className="flex items-center gap-2 font-bold text-base text-foreground">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Ticket className="h-4 w-4" aria-hidden />
              </span>
              매칭 티켓 가격
            </h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/5 p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                      얼리버드
                    </span>
                    <span className="text-xs line-through text-muted-foreground">
                      {MATCHING_REGULAR_PRICE.toLocaleString()}원
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">서비스 오픈 전 선결제 할인</p>
                </div>
                <p className="text-2xl font-bold text-primary tabular-nums">
                  {MATCHING_EARLYBIRD_PRICE.toLocaleString()}<span className="text-sm font-medium">원</span>
                </p>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-muted/30 p-4">
                <div>
                  <p className="text-sm font-bold text-foreground">정가 (오픈 후)</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">1회 매칭 / 남녀 동일</p>
                </div>
                <p className="text-xl font-bold text-muted-foreground tabular-nums">
                  {MATCHING_REGULAR_PRICE.toLocaleString()}<span className="text-sm font-medium">원</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 보유 티켓 */}
        {unusedCount > 0 && (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-center">
            <Ticket className="inline h-4 w-4 text-primary mr-1.5" aria-hidden />
            <span className="text-sm font-bold text-foreground">
              보유 매칭 티켓: <span className="text-primary">{unusedCount}매</span>
            </span>
          </div>
        )}

        {/* 수량 선택 + 결제 */}
        <Card className="overflow-hidden border border-primary/25 bg-card/95 shadow-neo-md rounded-2xl">
          <CardContent className="p-5">
            <h3 className="flex items-center gap-2 font-bold text-base text-foreground">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sparkles className="h-4 w-4" aria-hidden />
              </span>
              얼리버드 선결제
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              최대 {MATCHING_MAX_TICKETS}매까지 선구매 가능
              {unusedCount > 0 && ` (현재 보유 ${unusedCount}매)`}
            </p>

            <div className="mt-4 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full shadow-neo hover-neo border-primary/30"
                onClick={() => setTicketCount((c) => Math.max(1, c - 1))}
                disabled={ticketCount <= 1}
              >
                <Minus className="h-4 w-4" aria-hidden />
              </Button>
              <div className="text-center min-w-[4rem]">
                <span className="text-3xl font-bold tabular-nums text-foreground">{ticketCount}</span>
                <span className="ml-1 text-sm text-muted-foreground">매</span>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full shadow-neo hover-neo border-primary/30"
                onClick={() => setTicketCount((c) => Math.min(maxPurchasable, c + 1))}
                disabled={ticketCount >= maxPurchasable}
              >
                <Plus className="h-4 w-4" aria-hidden />
              </Button>
            </div>

            <div className="mt-4 rounded-2xl bg-muted/30 px-4 py-3 text-center">
              <span className="text-sm text-muted-foreground">총 결제 금액</span>
              <p className="text-2xl font-bold text-primary tabular-nums">{totalPrice.toLocaleString()}원</p>
            </div>

            <Button
              className="mt-4 w-full h-12 text-base font-bold shadow-neo hover-neo"
              onClick={handlePurchase}
              disabled={isPurchasing || maxPurchasable <= 0}
            >
              {isPurchasing ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden />결제 진행 중...</>
              ) : maxPurchasable <= 0 ? (
                '최대 구매 수량에 도달했어요'
              ) : (
                <><Heart className="mr-2 h-5 w-5" aria-hidden />얼리버드 결제하기</>
              )}
            </Button>

            <p className="mt-3 text-center text-[10px] text-muted-foreground leading-relaxed">
              서비스 미오픈 시 전액 환불 보장
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
