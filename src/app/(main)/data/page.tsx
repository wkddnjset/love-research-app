'use client';

import Link from 'next/link';
import { Users, Heart, MessageSquareHeart, ArrowRight } from 'lucide-react';
import MobileHeader from '@/components/layout/MobileHeader';

const DATA_SECTIONS = [
  {
    href: '/data/daily',
    title: '데일리 연애 질문',
    description: '매일 새로운 질문에 답하고, 나를 더 깊이 이해해요',
    Icon: MessageSquareHeart,
    gradient: 'from-pink-400 to-rose-500',
    bgStyle: 'from-pink-500/5 to-rose-500/5 dark:from-pink-500/10 dark:to-rose-500/10',
  },
  {
    href: '/data/ex-partners',
    title: '지난 연애 회고',
    description: '과거 연애 패턴을 분석하여 나를 더 깊이 이해해요',
    Icon: Users,
    gradient: 'from-violet-500 to-purple-600',
    bgStyle: 'from-violet-500/5 to-purple-500/5 dark:from-violet-500/10 dark:to-purple-500/10',
  },
  {
    href: '/data/relationships',
    title: '현재 관계',
    description: '지금 만나고 있는 사람의 정보를 관리하세요',
    Icon: Heart,
    gradient: 'from-orange-400 to-amber-500',
    bgStyle: 'from-orange-500/5 to-amber-500/5 dark:from-orange-500/10 dark:to-amber-500/10',
  },
];

export default function DataPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <MobileHeader title="연애 기록" />

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-5 px-4 pb-8 pt-4">
        <div className="rounded-2xl border border-sidebar-border bg-gradient-to-br from-sidebar to-primary/5 px-5 py-4 text-center shadow-neo">
          <p className="text-sm font-bold text-foreground">
            데이터를 많이 입력할수록 <span className="text-primary">AI 분석</span>이 더 정확해져요
          </p>
        </div>

        <section className="space-y-3" aria-labelledby="data-sections-heading">
          <h2 id="data-sections-heading" className="sr-only">기록 메뉴</h2>
          {DATA_SECTIONS.map(({ href, title, description, Icon, gradient, bgStyle }) => (
            <Link
              key={href}
              href={href}
              className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl"
            >
              <div
                className={`group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r ${bgStyle} p-5 shadow-neo hover-neo transition-all duration-200`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-sm ring-2 ring-white/20`}
                  >
                    <Icon className="h-6 w-6 text-white" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-base text-foreground">{title}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{description}</p>
                  </div>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-muted-foreground transition-all duration-200 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </div>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
