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
import { exPartnerSchema, type ExPartnerFormData } from '@/types/schemas/love-data';
import { useDataStore } from '@/stores/dataStore';
import { MBTI_OPTIONS, CONFLICT_TYPES } from '@/lib/constants';

export default function ExPartnersPage() {
  const { exPartners, addExPartner, deleteExPartner } = useDataStore();
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ExPartnerFormData>({
    resolver: zodResolver(exPartnerSchema),
    defaultValues: { conflictTypes: [], satisfactionScore: 5 },
  });

  const onSubmit = (data: ExPartnerFormData) => {
    addExPartner({
      ...data,
      conflictTypes: data.conflictTypes ?? [],
    });
    reset();
    setOpen(false);
  };

  return (
    <div>
      <MobileHeader
        title="전 애인 기록"
        showBack
        rightAction={
          <Button variant="ghost" size="sm" className="text-pink-500" onClick={() => setOpen(true)}>
            <Plus className="h-5 w-5" />
          </Button>
        }
      />

      <div className="px-4 py-4">
        {exPartners.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-4xl">💝</p>
            <p className="mt-4 font-medium text-gray-600">아직 기록이 없어요</p>
            <p className="mt-1 text-sm text-gray-400">
              전 애인 정보를 입력하면
              <br />
              더 정확한 분석을 받을 수 있어요
            </p>
            <Button className="mt-4 bg-pink-500 hover:bg-pink-600" onClick={() => setOpen(true)}>
              <Plus className="mr-1 h-4 w-4" />
              첫 기록 추가하기
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {exPartners.map((partner) => (
              <Card key={partner.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{partner.nickname}</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {partner.mbti || '-'} | 만족도 {partner.satisfactionScore}/10
                      </p>
                      {partner.breakupReason && (
                        <p className="mt-1 text-xs text-gray-400">{partner.breakupReason}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400"
                      onClick={() => deleteExPartner(partner.id)}
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
            <DialogTitle>전 애인 추가</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>별명 *</Label>
              <Input {...register('nickname')} placeholder="별명을 입력해주세요" />
              {errors.nickname && <p className="text-xs text-red-500">{errors.nickname.message}</p>}
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
              <Input {...register('personality')} placeholder="예: 외향적이고 활발한 성격" />
            </div>

            <div className="space-y-2">
              <Label>만족도 (1-10) *</Label>
              <Input type="number" min={1} max={10} {...register('satisfactionScore', { valueAsNumber: true })} />
              {errors.satisfactionScore && <p className="text-xs text-red-500">{errors.satisfactionScore.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>교제 기간 (개월)</Label>
              <Input type="number" min={0} {...register('relationshipDuration', { valueAsNumber: true })} />
            </div>

            <div className="space-y-2">
              <Label>이별 사유</Label>
              <Textarea {...register('breakupReason')} placeholder="이별 사유를 적어주세요" />
            </div>

            <div className="space-y-2">
              <Label>주요 갈등 유형</Label>
              <Select onValueChange={(v) => setValue('conflictTypes', [v])}>
                <SelectTrigger><SelectValue placeholder="갈등 유형 선택" /></SelectTrigger>
                <SelectContent>
                  {CONFLICT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
