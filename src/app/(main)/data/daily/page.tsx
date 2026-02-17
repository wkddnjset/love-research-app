'use client';

import { useState } from 'react';
import { MessageSquareHeart, Send, Check, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import MobileHeader from '@/components/layout/MobileHeader';
import { useTodayQuestion, useTodayAnswer, useSubmitAnswer, useRecentAnswers } from '@/hooks/useDailyQuestion';

export default function DailyQuestionPage() {
  const { data: question, isLoading: qLoading } = useTodayQuestion();
  const { data: existingAnswer } = useTodayAnswer(question?.id);
  const submitMutation = useSubmitAnswer();
  const { data: recentAnswers } = useRecentAnswers(7);
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const isAnswered = !!existingAnswer || submitted;

  const handleSubmit = async () => {
    if (!question || !answer.trim()) return;
    try {
      await submitMutation.mutateAsync({ questionId: question.id, answer: answer.trim() });
      setSubmitted(true);
      toast.success('답변이 저장되었습니다!');
    } catch {
      toast.error('저장에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <MobileHeader title="데일리 연애 질문" showBack />

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-5 px-4 pb-8 pt-4">
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
            <div className="relative overflow-hidden rounded-2xl border border-sidebar-border bg-gradient-to-br from-sidebar to-primary/5 p-6 shadow-neo">
              <div className="relative z-10">
                <Badge className="mb-3 bg-primary/15 text-primary border-0 text-xs font-bold ring-1 ring-primary/20">
                  #{question.keyword}
                </Badge>
                <h2 className="text-lg font-bold text-foreground leading-relaxed">
                  {question.question}
                </h2>
                <p className="mt-2 text-xs text-muted-foreground">
                  매일 새로운 질문에 답하면 연애 성향 리포트에 반영돼요
                </p>
              </div>
              <div className="absolute -right-4 -bottom-6 opacity-[0.07] dark:opacity-[0.12]" aria-hidden>
                <MessageSquareHeart className="h-32 w-32 text-foreground rotate-12" />
              </div>
            </div>

            {isAnswered ? (
              <Card className="overflow-hidden border border-green-500/30 bg-green-500/5 shadow-neo rounded-2xl">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-500/15">
                    <Check className="h-6 w-6 text-green-600 dark:text-green-400" aria-hidden />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">오늘의 답변 완료!</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      내일 새로운 질문이 준비되어 있어요
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="overflow-hidden border border-border shadow-neo rounded-2xl">
                <CardContent className="p-5 space-y-4">
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
                          답변하기
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

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
