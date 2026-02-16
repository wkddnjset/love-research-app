'use client';

import Link from 'next/link';
import { User, Crown, History, LogOut, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import MobileHeader from '@/components/layout/MobileHeader';
import { useAuth } from '@/hooks/useAuth';

const MENU_ITEMS = [
  { href: '/mypage/profile', label: '프로필 편집', Icon: User },
  { href: '/mypage/subscription', label: '구독 관리', Icon: Crown },
  { href: '/mypage/history', label: '분석 히스토리', Icon: History },
];

export default function MyPage() {
  const { user, logout } = useAuth();

  return (
    <div>
      <MobileHeader title="마이페이지" />

      <div className="px-4 py-4">
        {/* 프로필 카드 */}
        <Card className="mb-6 shadow-neo-md">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primary shadow-neo">
              <User className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{user?.user_metadata?.name || '사용자'}</h2>
              <p className="text-sm text-muted-foreground">무료 플랜</p>
            </div>
          </CardContent>
        </Card>

        {/* 메뉴 */}
        <Card className="shadow-neo">
          <div className="divide-y divide-border">
            {MENU_ITEMS.map(({ href, label, Icon }) => (
              <Link key={href} href={href}>
                <div className="flex items-center justify-between px-4 py-3.5 transition-colors hover:bg-accent">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <Separator className="my-4" />

        <Button variant="ghost" className="w-full justify-start text-destructive" onClick={logout}>
          <LogOut className="mr-3 h-5 w-5" />
          로그아웃
        </Button>
      </div>
    </div>
  );
}
