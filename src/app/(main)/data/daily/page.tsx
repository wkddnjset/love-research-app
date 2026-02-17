'use client';

import { useState, useEffect, useCallback } from 'react';
import { MessageSquareHeart, Send, Check, ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import MobileHeader from '@/components/layout/MobileHeader';
import { useQuestionForDate, useAnswerForQuestion, useSubmitAnswer, useRecentAnswers } from '@/hooks/useDailyQuestion';

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });
}

function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return toLocalDateStr(d);
}

function getToday() {
  return toLocalDateStr(new Date());
}

function toLocalDateStr(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getDayOffset(dateStr: string) {
  const today = new Date(getToday() + 'T00:00:00');
  const target = new Date(dateStr + 'T00:00:00');
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

function getDayLabel(dateStr: string) {
  const offset = getDayOffset(dateStr);
  if (offset === 0) return '오늘';
  if (offset === -1) return '어제';
  if (offset === 1) return '내일';
  if (offset < 0) return `${Math.abs(offset)}일 전`;
  return `${offset}일 후`;
}

export default function DailyQuestionPage() {
  const [selectedDate, setSelectedDate] = useState(getToday);
  const { data: question, isLoading: qLoading } = useQuestionForDate(selectedDate);
  const { data: existingAnswer } = useAnswerForQuestion(question?.id);
  const submitMutation = useSubmitAnswer();
  const { data: recentAnswers } = useRecentAnswers(10);
  const [answer, setAnswer] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const today = getToday();
  const offset = getDayOffset(selectedDate);
  const canGoPrev = offset > -3;
  const canGoNext = offset < 3;

  // 기존 답변이 로드되면 textarea에 반영
  useEffect(() => {
    if (existingAnswer) {
      setAnswer(existingAnswer.answer);
      setIsEditing(false);
    } else {
      setAnswer('');
      setIsEditing(false);
    }
  }, [existingAnswer, selectedDate]);

  const handleDateChange = useCallback((days: number) => {
    setSelectedDate((prev) => {
      const next = addDays(prev, days);
      const nextOffset = getDayOffset(next);
      if (nextOffset < -3 || nextOffset > 3) return prev;
      return next;
    });
  }, []);

  const handleSubmit = async () => {
    if (!question || !answer.trim()) return;
    try {
      await submitMutation.mutateAsync({ questionId: question.id, answer: answer.trim() });
      setIsEditing(false);
      toast.success(existingAnswer ? '답변이 수정되었습니다!' : '답변이 저장되었습니다!');
    } catch {
      toast.error('저장에 실패했습니다.');
    }
  };

  const isAnswered = !!existingAnswer && !isEditing;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <MobileHeader title="데일리 연애 질문" showBack />

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-5 px-4 pb-8 pt-4">
        {/* 날짜 네비게이션 */}
        <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-3 shadow-neo">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDateChange(-1)}
            disabled={!canGoPrev}
            className="h-9 w-9 p-0"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </Button>
          <div className="text-center">
            <p className="text-sm font-bold text-foreground">{getDayLabel(selectedDate)}</p>
            <p className="text-xs text-muted-foreground">{formatDate(selectedDate)}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDateChange(1)}
            disabled={!canGoNext}
            className="h-9 w-9 p-0"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </Button>
        </div>

        {/* 날짜 도트 인디케이터 */}
        <div className="flex items-center justify-center gap-1.5">
          {Array.from({ length: 7 }, (_, i) => i - 3).map((d) => {
            const dotDate = addDays(today, d);
            const isSelected = dotDate === selectedDate;
            const isCurrent = d === 0;
            return (
              <button
                key={d}
                onClick={() => setSelectedDate(dotDate)}
                className={`h-2 rounded-full transition-all ${
                  isSelected
                    ? 'w-6 bg-primary'
                    : isCurrent
                      ? 'w-2 bg-primary/40'
                      : 'w-2 bg-muted-foreground/20'
                }`}
                aria-label={formatDate(dotDate)}
              />
            );
          })}
        </div>

        {qLoading ? (
          <div className="flex items-center justify-center py-20" aria-busy="true">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden />
          </div>
        ) : !question ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-neo mb-4">
              <MessageSquareHeart className="h-8 w-8" aria-hidden />
            </div>
            <p className="text-lg font-bold text-foreground">아직 등록된 질문이 없어요</p>
            <p className="mt-2 text-sm text-muted-foreground">곧 새로운 질문이 추가됩니다!</p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* 질문 카드 */}
            <div className="relative overflow-hidden rounded-2xl border border-sidebar-border bg-gradient-to-br from-sidebar to-primary/5 p-6 shadow-neo">
              <div className="relative z-10">
                <Badge className="mb-3 bg-primary/15 text-primary border-0 text-xs font-bold ring-1 ring-primary/20">
                  #{question.keyword}
                </Badge>
                <h2 className="text-lg font-bold text-foreground leading-relaxed">
                  {question.question}
                </h2>
                <p className="mt-2 text-xs text-muted-foreground">
                  답변은 연애 성향 리포트에 반영돼요
                </p>
              </div>
              <div className="absolute -right-4 -bottom-6 opacity-[0.07] dark:opacity-[0.12]" aria-hidden>
                <MessageSquareHeart className="h-32 w-32 text-foreground rotate-12" />
              </div>
            </div>

            {/* 답변 완료 상태 */}
            {isAnswered ? (
              <Card className="overflow-hidden border border-green-500/30 bg-green-500/5 shadow-neo rounded-2xl">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-green-500/15 mt-0.5">
                        <Check className="h-5 w-5 text-green-600 dark:text-green-400" aria-hidden />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-foreground">답변 완료</p>
                        <p className="mt-1.5 text-sm text-foreground/80 leading-relaxed">
                          {existingAnswer.answer}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsEditing(true);
                        setAnswer(existingAnswer.answer);
                      }}
                      className="shrink-0 h-8 px-2.5 text-muted-foreground hover:text-primary"
                    >
                      <Pencil className="h-3.5 w-3.5 mr-1" aria-hidden />
                      수정
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* 답변 입력/수정 */
              <Card className="overflow-hidden border border-border shadow-neo rounded-2xl">
                <CardContent className="p-5 space-y-4">
                  {isEditing && (
                    <p className="text-xs font-medium text-primary">답변 수정 중</p>
                  )}
                  <Textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="나의 생각을 자유롭게 적어주세요..."
                    rows={4}
                    maxLength={1000}
                    className="text-base leading-relaxed rounded-xl"
                  />
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground tabular-nums">{answer.length}/1000</span>
                    <div className="flex gap-2">
                      {isEditing && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIsEditing(false);
                            setAnswer(existingAnswer?.answer || '');
                          }}
                        >
                          취소
                        </Button>
                      )}
                      <Button
                        onClick={handleSubmit}
                        disabled={!answer.trim() || submitMutation.isPending}
                        className="shadow-neo hover-neo"
                      >
                        {submitMutation.isPending ? (
                          '저장 중...'
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" aria-hidden />
                            {isEditing ? '수정하기' : '답변하기'}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* 최근 답변 목록 */}
        {recentAnswers && recentAnswers.length > 0 && (
          <section className="space-y-3" aria-labelledby="recent-answers-heading">
            <h3 id="recent-answers-heading" className="flex items-center gap-2 px-0.5 font-bold text-foreground">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ChevronRight className="h-4 w-4" aria-hidden />
              </span>
              최근 답변
            </h3>
            {recentAnswers.map((item) => (
              <Card key={item.id} className="border border-border shadow-neo rounded-2xl overflow-hidden">
                <CardContent className="p-4">
                  {item.question && (
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-[10px] shrink-0">#{item.question.keyword}</Badge>
                      <p className="text-xs text-muted-foreground truncate flex-1 min-w-0">
                        {item.question.question}
                      </p>
                    </div>
                  )}
                  <p className="text-sm text-foreground leading-relaxed line-clamp-2">{item.answer}</p>
                  <p className="mt-2 text-[10px] text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString('ko-KR')}
                  </p>
                </CardContent>
              </Card>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
