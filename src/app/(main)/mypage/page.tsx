'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { User, History, LogOut, ChevronRight, Copy, Check, Ticket, Heart, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MobileHeader from '@/components/layout/MobileHeader';
import { useAuth } from '@/hooks/useAuth';
import { useUserCode } from '@/hooks/useUserCode';
import { useMatchingTickets } from '@/hooks/useMatchingTickets';
import { useCompatibilityResults } from '@/hooks/useCompatibilityResults';
import { useAnalysisHistory } from '@/hooks/useSupabaseData';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

function getAge(birthYear?: number): number | null {
  if (birthYear == null) return null;
  const thisYear = new Date().getFullYear();
  return thisYear - birthYear;
}

const GENDER_LABELS: Record<string, string> = {
  male: '남성',
  female: '여성',
  other: '기타',
};

const MODULE_LABELS: Record<string, string> = {
  report: '연애 성향',
  compatibility: '궁합 분석',
};

const MODULE_GRADIENTS: Record<string, string> = {
  report: 'from-pink-400 to-rose-500',
  compatibility: 'from-violet-500 to-purple-600',
};

const MENU_ITEMS = [
  { href: '/mypage/profile', label: '프로필 편집', Icon: User },
  { href: '/matching', label: '매칭 서비스', Icon: Heart },
];

export default function MyPage() {
  const { user, logout } = useAuth();
  const profile = useAuthStore((s) => s.profile);
  const userCode = useUserCode();
  const { unusedCount } = useMatchingTickets();
  useCompatibilityResults(); // 훅 규칙 유지 (표시는 하지 않음)
  const { analysisHistory } = useAnalysisHistory();
  const [copied, setCopied] = useState(false);

  const age = useMemo(() => getAge(profile?.birthYear), [profile?.birthYear]);
  const latestReport = useMemo(
    () => analysisHistory.find((a) => a.moduleType === 'report'),
    [analysisHistory]
  );
  const loveType = latestReport?.result?.loveType as string | undefined;

  const handleCopyCode = async () => {
    if (!userCode) return;
    try {
      await navigator.clipboard.writeText(userCode);
      setCopied(true);
      toast.success('코드가 복사되었습니다!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('복사에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <MobileHeader title="마이페이지" />

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 px-4 pb-8 pt-4 space-y-5">
        {/* 프로필 카드 */}
        <Card className="overflow-hidden border border-border shadow-neo-md rounded-2xl p-0">
          <div className="border-b border-sidebar-border bg-gradient-to-br from-sidebar to-primary/5 p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 shadow-sm ring-2 ring-white/20">
                <User className="h-7 w-7 text-white" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold text-foreground truncate">
                  {user?.user_metadata?.name || '사용자'}
                </h2>
                <p className="text-xs text-muted-foreground">무료 플랜</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {profile?.mbti && (
                <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-bold text-primary ring-1 ring-primary/20">
                  {profile.mbti}
                </span>
              )}
              {age != null && age > 0 && (
                <span className="rounded-full bg-muted/80 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  만 {age}세
                </span>
              )}
              {profile?.gender && (
                <span className="rounded-full bg-muted/80 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  {GENDER_LABELS[profile.gender] ?? profile.gender}
                </span>
              )}
              {loveType ? (
                <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-bold text-primary ring-1 ring-primary/20 inline-flex items-center gap-1">
                  <Sparkles className="h-3 w-3 shrink-0" aria-hidden />
                  {loveType}
                </span>
              ) : (
                <Link
                  href="/analysis/report"
                  className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-colors inline-flex items-center"
                >
                  연애 리포트 받기
                </Link>
              )}
            </div>
          </div>

          {/* 보유 티켓 */}
          <Link href="/matching" className="block border-b border-border">
            <div className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-accent/30">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Ticket className="h-4 w-4" aria-hidden />
                </span>
                <span className="text-sm font-medium text-foreground">매칭 티켓</span>
              </div>
              <span className="text-sm font-bold tabular-nums text-primary">{unusedCount}매</span>
            </div>
          </Link>

          {userCode && (
            <div className="px-5 py-3 bg-card">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">나의 코드</p>
                  <p className="mt-0.5 font-mono text-lg font-bold tracking-[0.2em] text-primary tabular-nums">{userCode}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 shrink-0 shadow-neo hover-neo border-primary/30"
                  onClick={handleCopyCode}
                >
                  {copied ? <Check className="h-4 w-4 text-green-600 dark:text-green-400" /> : <Copy className="h-4 w-4" />}
                  <span className="ml-2 text-xs font-medium">{copied ? '복사됨' : '복사'}</span>
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* 최근 분석 */}
        <section className="space-y-3" aria-labelledby="recent-analysis-heading">
          <div className="flex items-center justify-between px-0.5">
            <h3 id="recent-analysis-heading" className="flex items-center gap-2 text-sm font-bold text-foreground">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <History className="h-4 w-4" aria-hidden />
              </span>
              최근 분석
            </h3>
            <Link href="/mypage/history" className="text-xs font-medium text-primary hover:underline">
              전체보기
            </Link>
          </div>

          {analysisHistory.length === 0 ? (
            <Link href="/analysis" className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl">
              <Card className="group overflow-hidden border border-dashed border-primary/30 bg-primary/5 shadow-neo hover-neo rounded-2xl">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Sparkles className="h-5 w-5" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-foreground">아직 분석 기록이 없어요</p>
                    <p className="text-xs text-muted-foreground">AI 분석을 시작해보세요</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-primary shrink-0" aria-hidden />
                </CardContent>
              </Card>
            </Link>
          ) : (
            <div className="space-y-2">
              {analysisHistory.slice(0, 3).map((item) => {
                const gradient = MODULE_GRADIENTS[item.moduleType] || 'from-gray-400 to-gray-500';
                return (
                  <Link
                    key={item.id}
                    href={`/mypage/history/${item.id}`}
                    className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl"
                  >
                    <Card className="group overflow-hidden border border-border shadow-neo hover-neo rounded-2xl transition-all">
                      <CardContent className="flex items-center gap-3 p-4">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-sm ring-2 ring-white/20`}>
                          {item.moduleType === 'report' ? (
                            <Sparkles className="h-5 w-5 text-white" aria-hidden />
                          ) : (
                            <Heart className="h-5 w-5 text-white" aria-hidden />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-sm text-foreground">
                            {MODULE_LABELS[item.moduleType] || item.moduleType}
                          </p>
                          <p className="text-xs text-muted-foreground tabular-nums">
                            {new Date(item.createdAt).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {item.score !== undefined && (
                            <span className="text-lg font-bold text-primary tabular-nums">{item.score}%</span>
                          )}
                          <ChevronRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" aria-hidden />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* 메뉴 */}
        <Card className="overflow-hidden border border-border shadow-neo rounded-2xl p-0">
          <div className="divide-y divide-border">
            {MENU_ITEMS.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
              >
                <div className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-accent/50">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-muted-foreground shrink-0" aria-hidden />
                    <span className="text-sm font-medium text-foreground">{label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden />
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <Button variant="ghost" className="w-full justify-start text-destructive hover:bg-destructive/10" onClick={logout}>
          <LogOut className="mr-3 h-5 w-5" aria-hidden />
          로그아웃
        </Button>
      </div>
    </div>
  );
}
