'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Search, Share2, Copy, Check, UserRound, Sparkles, Heart, History } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import MobileHeader from '@/components/layout/MobileHeader';
import ScoreGauge from '@/features/analysis/components/ScoreGauge';
import ResultCard from '@/features/analysis/components/ResultCard';
import { compatibilityInputSchema, type CompatibilityInputFormData } from '@/types/schemas/analysis';
import { useUserCode } from '@/hooks/useUserCode';

interface CompatResult {
  found: boolean;
  message?: string;
  targetCode?: string;
  targetMbti?: string;
  score?: number;
  strengths?: string[];
  weaknesses?: string[];
  cautions?: string[];
  advice?: string;
}

export default function CompatibilityPage() {
  const [result, setResult] = useState<CompatResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const myCode = useUserCode();

  const { register, handleSubmit, formState: { errors } } = useForm<CompatibilityInputFormData>({
    resolver: zodResolver(compatibilityInputSchema),
  });

  const onSubmit = async (data: CompatibilityInputFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/analysis/compatibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || '분석 실패');
      }
      const json = await res.json();
      setResult(json);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '분석 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/invite/${myCode}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('링크가 복사되었습니다!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('링크 복사에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <MobileHeader title="궁합 분석기" showBack />

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-5 px-4 pb-8 pt-4">
        {!result ? (
          <>
            <div className="relative overflow-hidden rounded-2xl border border-sidebar-border bg-gradient-to-br from-sidebar via-sidebar to-primary/5 p-6 shadow-neo">
              <div className="relative z-10">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-sm ring-2 ring-white/20">
                  <Heart className="h-7 w-7 text-white" aria-hidden />
                </div>
                <h2 className="text-lg font-bold text-foreground">실제 데이터 기반 궁합 분석</h2>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                  상대방의 고유 코드를 입력하면
                  <br />
                  서로의 연애 데이터를 AI가 정밀 분석해요
                </p>
              </div>
              <div className="absolute -right-4 -bottom-6 opacity-[0.06] dark:opacity-[0.1]" aria-hidden>
                <Heart className="h-32 w-32 text-foreground rotate-12" fill="currentColor" />
              </div>
            </div>

            <Card className="overflow-hidden border border-border shadow-neo rounded-2xl">
              <CardContent className="p-5">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-foreground">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <UserRound className="h-3.5 w-3.5" aria-hidden />
                      </span>
                      상대방 코드
                    </label>
                    <Input
                      {...register('targetCode')}
                      placeholder="코드를 입력하세요"
                      className="h-12 text-center font-mono text-lg tracking-widest uppercase"
                      maxLength={9}
                    />
                    {errors.targetCode && (
                      <p className="text-xs text-destructive">{errors.targetCode.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-bold shadow-neo hover-neo"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" />분석 중...</>
                    ) : (
                      <><Search className="mr-2 h-5 w-5" />궁합 분석하기</>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* 공유하기 섹션 */}
            <Card className="overflow-hidden border border-dashed border-primary/30 bg-primary/5 rounded-2xl">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                    <Share2 className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">상대방에게 코드를 공유하세요</p>
                    <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                      미가입 상대에게 링크를 보내면 가입 후 바로 궁합을 확인할 수 있어요
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 shadow-neo hover-neo"
                      onClick={handleShare}
                    >
                      {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
                      {copied ? '복사됨!' : '초대 링크 복사'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : result.found === false ? (
          <Card className="overflow-hidden border border-border shadow-neo-md rounded-2xl">
            <CardContent className="flex flex-col items-center py-10 p-5 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <UserRound className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="mt-4 text-lg font-bold text-foreground">아직 가입하지 않은 사용자예요</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                링크를 공유해 상대방을 초대하면
                <br />
                궁합 분석을 시작할 수 있어요!
              </p>
              <Button
                className="mt-6 shadow-neo hover-neo"
                onClick={handleShare}
              >
                <Share2 className="mr-2 h-4 w-4" />
                초대 링크 공유하기
              </Button>
              <Button
                variant="ghost"
                className="mt-2"
                onClick={() => setResult(null)}
              >
                다른 코드로 시도
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-b from-primary/10 to-background p-6 text-center shadow-neo">
              <Sparkles className="absolute top-3 right-3 h-5 w-5 text-primary/30" />
              <p className="text-xs font-medium text-muted-foreground tracking-wide uppercase">Compatibility Score</p>
              <div className="mt-3 flex justify-center">
                <ScoreGauge score={result.score ?? 0} label="" size="lg" />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                상대 MBTI: <span className="font-bold text-foreground">{result.targetMbti || '비공개'}</span>
              </p>
            </div>

            <ResultCard title="우리의 강점" icon="💪">
              <ul className="space-y-1.5">
                {result.strengths?.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </ResultCard>

            <ResultCard title="주의할 점" icon="⚡">
              <ul className="space-y-1.5">
                {result.weaknesses?.map((w, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </ResultCard>

            <ResultCard title="꼭 기억하세요" icon="💡">
              <p className="leading-relaxed">{result.advice}</p>
            </ResultCard>

            <Link href="/mypage/history" className="block">
              <Card className="group overflow-hidden border border-border bg-muted/20 hover-neo cursor-pointer rounded-2xl transition-all">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <History className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">분석 히스토리</p>
                    <p className="text-xs text-muted-foreground">과거 분석 결과를 확인하세요</p>
                  </div>
                  <span className="text-xs font-medium text-primary shrink-0">보기 &rarr;</span>
                </CardContent>
              </Card>
            </Link>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 shadow-neo hover-neo"
                onClick={handleShare}
              >
                <Share2 className="mr-2 h-4 w-4" />
                결과 공유
              </Button>
              <Button
                variant="outline"
                className="flex-1 shadow-neo hover-neo"
                onClick={() => setResult(null)}
              >
                다시 분석
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
