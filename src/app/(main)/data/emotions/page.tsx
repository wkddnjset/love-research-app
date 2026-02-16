'use client';

import { useState } from 'react';
import { Plus, Trash2, ChevronRight, ChevronLeft, Info } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import MobileHeader from '@/components/layout/MobileHeader';
import { emotionRecordSchema, type EmotionRecordFormData } from '@/types/schemas/love-data';
import { useEmotions, useRelationships } from '@/hooks/useSupabaseData';
import { MOOD_OPTIONS, EMOTION_TAGS } from '@/lib/constants';
import { cn } from '@/lib/utils';

const TOTAL_STEPS = 2;

export default function EmotionsPage() {
  const { emotions, addEmotion, deleteEmotion } = useEmotions();
  const { relationships } = useRelationships();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedScore, setSelectedScore] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<EmotionRecordFormData>({
    resolver: zodResolver(emotionRecordSchema),
    defaultValues: { score: 5, tags: [] },
  });

  const getMoodEmoji = (mood: string) =>
    MOOD_OPTIONS.find((m) => m.value === mood)?.emoji || '😐';

  const getMoodLabel = (mood: string) =>
    MOOD_OPTIONS.find((m) => m.value === mood)?.label || mood;

  const openDialog = () => {
    reset({ score: 5, tags: [] });
    setSelectedMood('');
    setSelectedScore(5);
    setSelectedTags([]);
    setStep(0);
    setOpen(true);
  };

  const onSubmit = async (data: EmotionRecordFormData) => {
    await addEmotion({
      ...data,
      tags: data.tags ?? [],
    });
    reset();
    setOpen(false);
  };

  return (
    <div>
      <MobileHeader
        title="감정 일기"
        showBack
        rightAction={
          <Button variant="ghost" size="sm" className="text-primary" onClick={openDialog}>
            <Plus className="h-5 w-5" />
          </Button>
        }
      />

      <div className="px-4 py-4">
        {emotions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary border border-border shadow-neo mb-4">
              <span className="text-3xl">📝</span>
            </div>
            <p className="font-bold text-foreground">감정 일기가 비어있어요</p>
            <p className="mt-1 text-sm text-muted-foreground">
              오늘의 감정을 기록해보세요
            </p>
            <Button className="mt-4 shadow-neo hover-neo" onClick={openDialog}>
              <Plus className="mr-1 h-4 w-4" />
              감정 기록하기
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {emotions.map((emotion) => (
              <Card key={emotion.id} className="shadow-neo">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background border border-border">
                        <span className="text-xl">{getMoodEmoji(emotion.mood)}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm">
                          {getMoodLabel(emotion.mood)} ({emotion.score}/10)
                        </p>
                        <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
                          {emotion.content}
                        </p>
                        {emotion.tags.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {emotion.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <p className="mt-1 text-xs text-muted-foreground">
                          {new Date(emotion.createdAt).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground"
                      onClick={() => deleteEmotion(emotion.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="sticky top-0 z-10 bg-card border-b border-border px-5 py-4">
            <DialogTitle>감정 기록하기</DialogTitle>
            <div className="flex items-center gap-1 pt-2">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-1.5 flex-1 rounded-full transition-colors',
                    i <= step ? 'bg-primary' : 'bg-muted',
                  )}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              {step === 0 && '감정 + 점수'}
              {step === 1 && '내용 + 태그'}
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="px-5 pb-5">
            {/* Step 0: 감정 + 점수 */}
            {step === 0 && (
              <div className="space-y-5 pt-4">
                <div className="space-y-3">
                  <Label>오늘의 감정 *</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {MOOD_OPTIONS.map((m) => (
                      <button
                        key={m.value}
                        type="button"
                        onClick={() => {
                          setSelectedMood(m.value);
                          setValue('mood', m.value as EmotionRecordFormData['mood']);
                        }}
                        className={cn(
                          'flex flex-col items-center gap-1 rounded-xl border p-3 transition-all',
                          selectedMood === m.value
                            ? 'border-primary bg-primary/10 shadow-neo'
                            : 'border-border bg-background hover:border-primary/50',
                        )}
                      >
                        <span className="text-2xl">{m.emoji}</span>
                        <span className={cn(
                          'text-xs font-medium',
                          selectedMood === m.value ? 'text-primary' : 'text-muted-foreground',
                        )}>
                          {m.label}
                        </span>
                      </button>
                    ))}
                  </div>
                  {errors.mood && <p className="text-xs text-destructive">{errors.mood.message}</p>}
                </div>

                <div className="space-y-3">
                  <Label>감정 점수 (1-10) *</Label>
                  <div className="flex items-center justify-center gap-1.5">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => {
                          setSelectedScore(n);
                          setValue('score', n);
                        }}
                        className={cn(
                          'h-8 w-8 rounded-full border text-xs font-bold transition-all',
                          n <= selectedScore
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border bg-background text-muted-foreground hover:border-primary/50',
                        )}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <p className="text-center text-xs text-muted-foreground">
                    {selectedScore <= 3 ? '많이 힘들어요' : selectedScore <= 5 ? '그저 그래요' : selectedScore <= 7 ? '괜찮아요' : '기분 좋아요!'}
                  </p>
                  {errors.score && <p className="text-xs text-destructive">{errors.score.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>관련 관계</Label>
                  <Select onValueChange={(v) => setValue('relationshipId', v === '__none__' ? undefined : v)}>
                    <SelectTrigger><SelectValue placeholder="관계 선택 (선택사항)" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">선택 안 함</SelectItem>
                      {relationships.map((r) => (
                        <SelectItem key={r.id} value={r.id}>{r.nickname}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    감정을 매일 기록하면 연애 패턴과 감정 변화를 파악할 수 있어요
                  </p>
                </div>

                <Button type="button" onClick={() => setStep(1)} className="w-full shadow-neo hover-neo">
                  다음 <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Step 1: 내용 + 태그 */}
            {step === 1 && (
              <div className="space-y-5 pt-4">
                <div className="space-y-2">
                  <Label>내용 *</Label>
                  <Textarea
                    {...register('content')}
                    placeholder="오늘 어떤 일이 있었나요? 연애와 관련된 감정을 자유롭게 적어주세요."
                    rows={5}
                    maxLength={2000}
                  />
                  {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
                </div>

                <div className="space-y-3">
                  <Label>태그</Label>
                  <p className="text-xs text-muted-foreground">해당하는 태그를 선택해주세요 (중복 선택 가능)</p>
                  <div className="flex flex-wrap gap-2">
                    {EMOTION_TAGS.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            const next = isSelected
                              ? selectedTags.filter((t) => t !== tag)
                              : [...selectedTags, tag];
                            setSelectedTags(next);
                            setValue('tags', next);
                          }}
                          className={cn(
                            'rounded-lg border px-3 py-2 text-xs font-medium transition-all',
                            isSelected
                              ? 'border-primary bg-primary/10 text-primary shadow-neo'
                              : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground',
                          )}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Summary */}
                <div className="rounded-xl border border-border bg-card/50 p-4 space-y-2">
                  <p className="text-sm font-bold text-foreground">입력 요약</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedMood && (
                      <Badge variant="secondary">
                        {getMoodEmoji(selectedMood)} {getMoodLabel(selectedMood)}
                      </Badge>
                    )}
                    <Badge variant="outline">{selectedScore}/10</Badge>
                    {selectedTags.length > 0 && (
                      <Badge variant="outline">태그 {selectedTags.length}개</Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setStep(0)} className="flex-1">
                    <ChevronLeft className="mr-1 h-4 w-4" /> 이전
                  </Button>
                  <Button type="submit" className="flex-1 shadow-neo hover-neo">
                    저장하기
                  </Button>
                </div>
              </div>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
