'use client';

import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ANALYSIS_MODULES } from '@/lib/constants';
import MobileHeader from '@/components/layout/MobileHeader';

export default function HomePage() {
  return (
    <div>
      <MobileHeader title="사랑연구소" />

      <div className="space-y-6 px-4 py-4">
        {/* 인사 영역 */}
        <div className="rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 p-5">
          <p className="text-sm text-gray-500">안녕하세요 👋</p>
          <h2 className="mt-1 text-xl font-bold text-gray-900">
            오늘의 연애 고민은 무엇인가요?
          </h2>
        </div>

        {/* 오늘의 감정 기록 CTA */}
        <Card className="border-pink-100">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                <Heart className="h-5 w-5 text-pink-500" />
              </div>
              <div>
                <p className="text-sm font-medium">오늘의 감정 기록</p>
                <p className="text-xs text-gray-500">지금 기분은 어떤가요?</p>
              </div>
            </div>
            <Link href="/data/emotions">
              <Button variant="ghost" size="sm">
                기록하기
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* AI 분석 모듈 */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">AI 분석</h3>
            <Link href="/analysis" className="text-sm text-pink-500">
              전체보기
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {ANALYSIS_MODULES.slice(0, 4).map((module) => (
              <Link key={module.type} href={`/analysis/${module.type}`}>
                <Card className={`border ${module.color} transition-shadow hover:shadow-md`}>
                  <CardContent className="p-4">
                    <span className="text-2xl">{module.icon}</span>
                    <p className="mt-2 text-sm font-medium">{module.title}</p>
                    <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">
                      {module.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
