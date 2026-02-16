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
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import MobileHeader from '@/components/layout/MobileHeader';
import { conflictRecordSchema, type ConflictRecordFormData } from '@/types/schemas/love-data';
import { useDataStore } from '@/stores/dataStore';
import { CONFLICT_TYPES } from '@/lib/constants';

export default function ConflictsPage() {
  const { conflicts, relationships, addConflict, deleteConflict } = useDataStore();
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ConflictRecordFormData>({
    resolver: zodResolver(conflictRecordSchema),
    defaultValues: { severity: 3, isResolved: false },
  });

  const onSubmit = (data: ConflictRecordFormData) => {
    addConflict({
      ...data,
      severity: data.severity as 1 | 2 | 3 | 4 | 5,
      isResolved: data.isResolved ?? false,
    });
    reset();
    setOpen(false);
  };

  return (
    <div>
      <MobileHeader
        title="갈등 기록"
        showBack
        rightAction={
          <Button variant="ghost" size="sm" className="text-pink-500" onClick={() => setOpen(true)}>
            <Plus className="h-5 w-5" />
          </Button>
        }
      />

      <div className="px-4 py-4">
        {conflicts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-4xl">⚡</p>
            <p className="mt-4 font-medium text-gray-600">갈등 기록이 없어요</p>
            <p className="mt-1 text-sm text-gray-400">
              갈등을 기록하면 패턴을 분석할 수 있어요
            </p>
            <Button className="mt-4 bg-pink-500 hover:bg-pink-600" onClick={() => setOpen(true)}>
              <Plus className="mr-1 h-4 w-4" />
              갈등 기록하기
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {conflicts.map((conflict) => (
              <Card key={conflict.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{conflict.title}</h3>
                        <Badge variant={conflict.isResolved ? 'secondary' : 'destructive'}>
                          {conflict.isResolved ? '해결됨' : '진행중'}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {conflict.conflictType} | 심각도 {conflict.severity}/5
                      </p>
                      <p className="mt-1 text-xs text-gray-400 line-clamp-2">
                        {conflict.description}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400"
                      onClick={() => deleteConflict(conflict.id)}
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
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>갈등 기록</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>관련 관계 *</Label>
              <Select onValueChange={(v) => setValue('relationshipId', v)}>
                <SelectTrigger><SelectValue placeholder="관계를 선택해주세요" /></SelectTrigger>
                <SelectContent>
                  {relationships.length > 0 ? (
                    relationships.map((r) => (
                      <SelectItem key={r.id} value={r.id}>{r.nickname}</SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>관계를 먼저 추가해주세요</SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.relationshipId && <p className="text-xs text-red-500">{errors.relationshipId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>제목 *</Label>
              <Input {...register('title')} placeholder="갈등 제목" />
              {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>내용 *</Label>
              <Textarea {...register('description')} placeholder="상황을 자세히 적어주세요" rows={4} />
              {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>갈등 유형 *</Label>
              <Select onValueChange={(v) => setValue('conflictType', v)}>
                <SelectTrigger><SelectValue placeholder="유형 선택" /></SelectTrigger>
                <SelectContent>
                  {CONFLICT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.conflictType && <p className="text-xs text-red-500">{errors.conflictType.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>심각도 (1-5) *</Label>
              <Input type="number" min={1} max={5} {...register('severity', { valueAsNumber: true })} />
              {errors.severity && <p className="text-xs text-red-500">{errors.severity.message}</p>}
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
