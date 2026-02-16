'use client';

import { useState } from 'react';
import { Plus, Trash2, ChevronRight, ChevronLeft, Info } from 'lucide-react';
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
import { useConflicts, useRelationships } from '@/hooks/useSupabaseData';
import { CONFLICT_TYPES, SEVERITY_LEVELS } from '@/lib/constants';
import { cn } from '@/lib/utils';

const TOTAL_STEPS = 2;

export default function ConflictsPage() {
  const { conflicts, addConflict, deleteConflict } = useConflicts();
  const { relationships } = useRelationships();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedType, setSelectedType] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState(3);
  const [isResolved, setIsResolved] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ConflictRecordFormData>({
    resolver: zodResolver(conflictRecordSchema),
    defaultValues: { severity: 3, isResolved: false },
  });

  const getSeverityLabel = (severity: number) =>
    SEVERITY_LEVELS.find((s) => s.value === severity)?.label || `${severity}`;

  const getSeverityEmoji = (severity: number) =>
    SEVERITY_LEVELS.find((s) => s.value === severity)?.emoji || '';

  const openDialog = () => {
    reset({ severity: 3, isResolved: false });
    setSelectedType('');
    setSelectedSeverity(3);
    setIsResolved(false);
    setStep(0);
    setOpen(true);
  };

  const onSubmit = async (data: ConflictRecordFormData) => {
    await addConflict({
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
          <Button variant="ghost" size="sm" className="text-primary" onClick={openDialog}>
            <Plus className="h-5 w-5" />
          </Button>
        }
      />

      <div className="px-4 py-4">
        {conflicts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary border border-border shadow-neo mb-4">
              <span className="text-3xl">⚡</span>
            </div>
            <p className="font-bold text-foreground">갈등 기록이 없어요</p>
            <p className="mt-1 text-sm text-muted-foreground">
              갈등을 기록하면 패턴을 분석할 수 있어요
            </p>
            <Button className="mt-4 shadow-neo hover-neo" onClick={openDialog}>
              <Plus className="mr-1 h-4 w-4" />
              갈등 기록하기
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {conflicts.map((conflict) => (
              <Card key={conflict.id} className="shadow-neo">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{conflict.title}</h3>
                        <Badge variant={conflict.isResolved ? 'secondary' : 'destructive'}>
                          {conflict.isResolved ? '해결됨' : '진행중'}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {conflict.conflictType} | {getSeverityEmoji(conflict.severity)} {getSeverityLabel(conflict.severity)}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {conflict.description}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground"
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
        <DialogContent className="max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="sticky top-0 z-10 bg-card border-b border-border px-5 py-4">
            <DialogTitle>갈등 기록</DialogTitle>
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
              {step === 0 && '갈등 상황'}
              {step === 1 && '상세 + 심각도'}
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="px-5 pb-5">
            {/* Step 0: 갈등 상황 */}
            {step === 0 && (
              <div className="space-y-5 pt-4">
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
                  {errors.relationshipId && <p className="text-xs text-destructive">{errors.relationshipId.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>제목 *</Label>
                  <Input {...register('title')} placeholder="갈등 제목" />
                  {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>갈등 유형 *</Label>
                  <div className="flex flex-wrap gap-2">
                    {CONFLICT_TYPES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          setSelectedType(t);
                          setValue('conflictType', t);
                        }}
                        className={cn(
                          'rounded-lg border px-3 py-2 text-xs font-medium transition-all',
                          selectedType === t
                            ? 'border-primary bg-primary/10 text-primary shadow-neo'
                            : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground',
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  {errors.conflictType && <p className="text-xs text-destructive">{errors.conflictType.message}</p>}
                </div>

                <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    갈등을 구체적으로 기록할수록 패턴 분석에 도움이 돼요
                  </p>
                </div>

                <Button type="button" onClick={() => setStep(1)} className="w-full shadow-neo hover-neo">
                  다음 <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Step 1: 상세 + 심각도 */}
            {step === 1 && (
              <div className="space-y-5 pt-4">
                <div className="space-y-2">
                  <Label>상황 설명 *</Label>
                  <Textarea {...register('description')} placeholder="상황을 자세히 적어주세요" rows={5} maxLength={2000} />
                  {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
                </div>

                <div className="space-y-3">
                  <Label>심각도 *</Label>
                  <div className="flex flex-wrap gap-2">
                    {SEVERITY_LEVELS.map((s) => (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => {
                          setSelectedSeverity(s.value);
                          setValue('severity', s.value);
                        }}
                        className={cn(
                          'flex items-center gap-1.5 rounded-lg border px-3 py-2.5 text-xs font-medium transition-all',
                          selectedSeverity === s.value
                            ? 'border-primary bg-primary/10 text-primary shadow-neo'
                            : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground',
                        )}
                      >
                        <span>{s.emoji}</span>
                        <span>{s.label}</span>
                      </button>
                    ))}
                  </div>
                  {errors.severity && <p className="text-xs text-destructive">{errors.severity.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>해결 여부</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsResolved(false);
                        setValue('isResolved', false);
                      }}
                      className={cn(
                        'rounded-lg border px-3 py-2.5 text-sm font-medium transition-all',
                        !isResolved
                          ? 'border-primary bg-primary/10 text-primary shadow-neo'
                          : 'border-border bg-background text-muted-foreground hover:border-primary/50',
                      )}
                    >
                      진행 중
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsResolved(true);
                        setValue('isResolved', true);
                      }}
                      className={cn(
                        'rounded-lg border px-3 py-2.5 text-sm font-medium transition-all',
                        isResolved
                          ? 'border-primary bg-primary/10 text-primary shadow-neo'
                          : 'border-border bg-background text-muted-foreground hover:border-primary/50',
                      )}
                    >
                      해결됨
                    </button>
                  </div>
                </div>

                {/* Summary */}
                <div className="rounded-xl border border-border bg-card/50 p-4 space-y-2">
                  <p className="text-sm font-bold text-foreground">입력 요약</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedType && <Badge variant="secondary">{selectedType}</Badge>}
                    <Badge variant="outline">
                      {getSeverityEmoji(selectedSeverity)} {getSeverityLabel(selectedSeverity)}
                    </Badge>
                    <Badge variant={isResolved ? 'secondary' : 'destructive'}>
                      {isResolved ? '해결됨' : '진행 중'}
                    </Badge>
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
