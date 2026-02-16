'use client';

import Link from 'next/link';
import { User, Crown, History, LogOut, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import MobileHeader from '@/components/layout/MobileHeader';

const MENU_ITEMS = [
  { href: '/mypage/profile', label: '프로필 편집', Icon: User },
  { href: '/mypage/subscription', label: '구독 관리', Icon: Crown },
  { href: '/mypage/history', label: '분석 히스토리', Icon: History },
];

export default function MyPage() {
  return (
    <div>
      <MobileHeader title="마이페이지" />

      <div className="px-4 py-4">
        {/* 프로필 카드 */}
        <Card className="mb-6">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-100">
              <User className="h-7 w-7 text-pink-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold">사용자</h2>
              <p className="text-sm text-gray-500">무료 플랜</p>
            </div>
          </CardContent>
        </Card>

        {/* 메뉴 */}
        <div className="space-y-1">
          {MENU_ITEMS.map(({ href, label, Icon }) => (
            <Link key={href} href={href}>
              <div className="flex items-center justify-between rounded-lg px-3 py-3 transition-colors hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-gray-500" />
                  <span className="text-sm">{label}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </Link>
          ))}
        </div>

        <Separator className="my-4" />

        <Button variant="ghost" className="w-full justify-start text-red-500">
          <LogOut className="mr-3 h-5 w-5" />
          로그아웃
        </Button>
      </div>
    </div>
  );
}
