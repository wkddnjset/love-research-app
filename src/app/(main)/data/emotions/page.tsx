'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import MobileHeader from '@/components/layout/MobileHeader';
import { emotionRecordSchema, type EmotionRecordFormData } from '@/types/schemas/love-data';
import { useDataStore } from '@/stores/dataStore';
import { MOOD_OPTIONS } from '@/lib/constants';

export default function EmotionsPage() {
  const { emotions, addEmotion, deleteEmotion } = useDataStore();
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<EmotionRecordFormData>({
    resolver: zodResolver(emotionRecordSchema),
    defaultValues: { score: 5, tags: [] },
  });

  const getMoodEmoji = (mood: string) =>
    MOOD_OPTIONS.find((m) => m.value === mood)?.emoji || '😐';

  const getMoodLabel = (mood: string) =>
    MOOD_OPTIONS.find((m) => m.value === mood)?.label || mood;

  const onSubmit = (data: EmotionRecordFormData) => {
    addEmotion({
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
          <Button variant="ghost" size="sm" className="text-pink-500" onClick={() => setOpen(true)}>
            <Plus className="h-5 w-5" />
          </Button>
        }
      />

      <div className="px-4 py-4">
        {emotions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-4xl">📝</p>
            <p className="mt-4 font-medium text-gray-600">감정 일기가 비어있어요</p>
            <p className="mt-1 text-sm text-gray-400">
              오늘의 감정을 기록해보세요
            </p>
            <Button className="mt-4 bg-pink-500 hover:bg-pink-600" onClick={() => setOpen(true)}>
              <Plus className="mr-1 h-4 w-4" />
              감정 기록하기
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {emotions.map((emotion) => (
              <Card key={emotion.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{getMoodEmoji(emotion.mood)}</span>
                      <div className="flex-1">
                        <p className="font-medium">
                          {getMoodLabel(emotion.mood)} ({emotion.score}/10)
                        </p>
                        <p className="mt-0.5 text-sm text-gray-500 line-clamp-2">
                          {emotion.content}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {new Date(emotion.createdAt).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400"
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>감정 기록하기</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>오늘의 감정 *</Label>
              <Select onValueChange={(v) => setValue('mood', v as EmotionRecordFormData['mood'])}>
                <SelectTrigger><SelectValue placeholder="감정을 선택해주세요" /></SelectTrigger>
                <SelectContent>
                  {MOOD_OPTIONS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.emoji} {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.mood && <p className="text-xs text-red-500">{errors.mood.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>감정 점수 (1-10) *</Label>
              <Input type="number" min={1} max={10} {...register('score', { valueAsNumber: true })} />
              {errors.score && <p className="text-xs text-red-500">{errors.score.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>내용 *</Label>
              <Textarea {...register('content')} placeholder="오늘 어떤 일이 있었나요?" rows={4} />
              {errors.content && <p className="text-xs text-red-500">{errors.content.message}</p>}
            </div>

            <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600">
              저장하기
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
