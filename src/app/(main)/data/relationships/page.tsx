'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import MobileHeader from '@/components/layout/MobileHeader';
import { currentRelationshipSchema, type CurrentRelationshipFormData } from '@/types/schemas/love-data';
import { useDataStore } from '@/stores/dataStore';
import { MBTI_OPTIONS, RELATIONSHIP_STAGES } from '@/lib/constants';

export default function RelationshipsPage() {
  const { relationships, addRelationship, deleteRelationship } = useDataStore();
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CurrentRelationshipFormData>({
    resolver: zodResolver(currentRelationshipSchema),
    defaultValues: { isActive: true },
  });

  const getStageLabel = (stage: string) =>
    RELATIONSHIP_STAGES.find((s) => s.value === stage)?.label || stage;

  const onSubmit = (data: CurrentRelationshipFormData) => {
    addRelationship({
      ...data,
      isActive: data.isActive ?? true,
    });
    reset();
    setOpen(false);
  };

  return (
    <div>
      <MobileHeader
        title="현재 관계"
        showBack
        rightAction={
          <Button variant="ghost" size="sm" className="text-pink-500" onClick={() => setOpen(true)}>
            <Plus className="h-5 w-5" />
          </Button>
        }
      />

      <div className="px-4 py-4">
        {relationships.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-4xl">💑</p>
            <p className="mt-4 font-medium text-gray-600">현재 관계가 없어요</p>
            <p className="mt-1 text-sm text-gray-400">
              썸이나 연인 정보를 추가해보세요
            </p>
            <Button className="mt-4 bg-pink-500 hover:bg-pink-600" onClick={() => setOpen(true)}>
              <Plus className="mr-1 h-4 w-4" />
              관계 추가하기
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {relationships.map((rel) => (
              <Card key={rel.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{rel.nickname}</h3>
                        <Badge variant={rel.isActive ? 'default' : 'secondary'}>
                          {getStageLabel(rel.stage)}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {rel.mbti || 'MBTI 미입력'}
                        {rel.startDate && ` | ${rel.startDate}`}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400"
                      onClick={() => deleteRelationship(rel.id)}
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
            <DialogTitle>관계 추가</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>별명 *</Label>
              <Input {...register('nickname')} placeholder="별명을 입력해주세요" />
              {errors.nickname && <p className="text-xs text-red-500">{errors.nickname.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>관계 단계 *</Label>
              <Select onValueChange={(v) => setValue('stage', v as 'some' | 'dating' | 'serious')}>
                <SelectTrigger><SelectValue placeholder="관계 단계 선택" /></SelectTrigger>
                <SelectContent>
                  {RELATIONSHIP_STAGES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.stage && <p className="text-xs text-red-500">{errors.stage.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>MBTI</Label>
              <Select onValueChange={(v) => setValue('mbti', v)}>
                <SelectTrigger><SelectValue placeholder="MBTI 선택" /></SelectTrigger>
                <SelectContent>
                  {MBTI_OPTIONS.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>성격 특성</Label>
              <Input {...register('personality')} placeholder="예: 다정하고 내성적인 편" />
            </div>

            <div className="space-y-2">
              <Label>시작일</Label>
              <Input type="date" {...register('startDate')} />
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
