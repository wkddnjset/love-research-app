'use client';

import Link from 'next/link';
import { Users, Heart, AlertTriangle, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import MobileHeader from '@/components/layout/MobileHeader';

const DATA_SECTIONS = [
  {
    href: '/data/ex-partners',
    title: '지난 연애 회고',
    description: '과거 연애 패턴을 분석하여 나를 더 깊이 이해해요',
    Icon: Users,
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-950/30',
  },
  {
    href: '/data/relationships',
    title: '현재 관계',
    description: '지금 만나고 있는 사람의 정보를 관리하세요',
    Icon: Heart,
    color: 'text-primary',
    bg: 'bg-secondary',
  },
  {
    href: '/data/conflicts',
    title: '갈등 기록',
    description: '갈등 패턴을 분석하여 반복을 방지해요',
    Icon: AlertTriangle,
    color: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-950/30',
  },
  {
    href: '/data/emotions',
    title: '감정 일기',
    description: '매일의 감정을 기록하고 패턴을 파악하세요',
    Icon: BookOpen,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
  },
];

export default function DataPage() {
  return (
    <div>
      <MobileHeader title="연애 기록" />

      <div className="space-y-3 px-4 py-4">
        <p className="text-sm text-muted-foreground">
          데이터를 많이 입력할수록 AI 분석이 더 정확해져요
        </p>

        {DATA_SECTIONS.map(({ href, title, description, Icon, color, bg }) => (
          <Link key={href} href={href}>
            <Card className="mb-3 shadow-neo hover-neo">
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl border border-border ${bg}`}>
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{title}</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
