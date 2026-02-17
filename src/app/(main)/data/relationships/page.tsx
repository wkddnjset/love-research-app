'use client';

import { useState } from 'react';
import { Plus, Trash2, ArrowRight, ChevronRight, ChevronLeft, Info, AlertTriangle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import MobileHeader from '@/components/layout/MobileHeader';
import MbtiSlider from '@/components/MbtiSlider';
import { currentRelationshipSchema, type CurrentRelationshipFormData, exPartnerSchema, type ExPartnerFormData } from '@/types/schemas/love-data';
import { useRelationships, useConflictCountByRelationship } from '@/hooks/useSupabaseData';
import { RELATIONSHIP_STAGES, CONFLICT_TYPES, RELATIONSHIP_STYLE_QUESTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { CurrentRelationship } from '@/types';

const ADD_TOTAL_STEPS = 2;
const EX_TOTAL_STEPS = 4;

export default function RelationshipsPage() {
  const { relationships, addRelationship, deleteRelationship, moveToEx, isMovingToEx } = useRelationships();
  const [addOpen, setAddOpen] = useState(false);
  const [addStep, setAddStep] = useState(0);
  const [addMbti, setAddMbti] = useState('');

  // EX move state
  const [exOpen, setExOpen] = useState(false);
  const [exStep, setExStep] = useState(0);
  const [exTarget, setExTarget] = useState<CurrentRelationship | null>(null);
  const [exMbti, setExMbti] = useState('');
  const [exStyleAnswers, setExStyleAnswers] = useState<Record<string, string>>({});
  const [exSelectedConflicts, setExSelectedConflicts] = useState<string[]>([]);

  const conflictCountQuery = useConflictCountByRelationship(exTarget?.id);

  const addForm = useForm<CurrentRelationshipFormData>({
    resolver: zodResolver(currentRelationshipSchema),
    defaultValues: { isActive: true },
  });

  const exForm = useForm<ExPartnerFormData>({
    resolver: zodResolver(exPartnerSchema),
    defaultValues: { conflictTypes: [], styleAnswers: {}, goodPoints: '' },
  });

  const getStageLabel = (stage: string) =>
    RELATIONSHIP_STAGES.find((s) => s.value === stage)?.label || stage;

  // Add dialog
  const openAddDialog = () => {
    addForm.reset({ isActive: true });
    setAddMbti('');
    setAddStep(0);
    setAddOpen(true);
  };

  const onAddSubmit = async (data: CurrentRelationshipFormData) => {
    await addRelationship({
      ...data,
      mbti: addMbti || undefined,
      isActive: data.isActive ?? true,
    });
    addForm.reset();
    setAddMbti('');
    setAddOpen(false);
  };

  // EX move dialog
  const openExDialog = (rel: CurrentRelationship) => {
    setExTarget(rel);
    setExMbti(rel.mbti || '');
    setExStyleAnswers({});
    setExSelectedConflicts([]);

    const duration = rel.startDate
      ? Math.max(1, Math.round((Date.now() - new Date(rel.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30)))
      : undefined;

    exForm.reset({
      nickname: rel.nickname,
      personality: rel.personality || '',
      conflictTypes: [],
      conflictDetail: '',
      styleAnswers: {},
      goodPoints: '',
      breakupReason: '',
      relationshipDuration: duration,
    });
    setExStep(0);
    setExOpen(true);
  };

  const onExSubmit = async (data: ExPartnerFormData) => {
    if (!exTarget) return;
    await moveToEx({
      relationshipId: exTarget.id,
      exData: {
        nickname: data.nickname ?? exTarget.nickname,
        mbti: exMbti || undefined,
        personality: data.personality ?? undefined,
        conflictTypes: data.conflictTypes ?? [],
        conflictDetail: data.conflictDetail ?? undefined,
        breakupReason: data.breakupReason ?? undefined,
        relationshipDuration: data.relationshipDuration,
        styleAnswers: exStyleAnswers,
        goodPoints: data.goodPoints ?? undefined,
      },
    });
    exForm.reset();
    setExOpen(false);
    setExTarget(null);
  };

  const exAnsweredCount = Object.keys(exStyleAnswers).length;

  // Watched values for add form
  const watchedStage = addForm.watch('stage');
  const watchedStartDate = addForm.watch('startDate');

  return (
    <div>
      <MobileHeader
        title="현재 관계"
        showBack
        rightAction={
          <Button variant="ghost" size="sm" className="text-primary" onClick={openAddDialog}>
            <Plus className="h-5 w-5" />
          </Button>
        }
      />

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 px-5 py-5">
        {relationships.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary border border-border shadow-neo mb-4">
              <span className="text-3xl">💑</span>
            </div>
            <p className="font-bold text-foreground">현재 관계가 없어요</p>
            <p className="mt-1 text-sm text-muted-foreground">
              썸이나 연인 정보를 추가해보세요
            </p>
            <Button className="mt-4 shadow-neo hover-neo" onClick={openAddDialog}>
              <Plus className="mr-1 h-4 w-4" />
              관계 추가하기
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {relationships.map((rel) => (
              <Card key={rel.id} className="shadow-neo">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{rel.nickname}</h3>
                        <Badge variant={rel.isActive ? 'default' : 'secondary'}>
                          {getStageLabel(rel.stage)}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {rel.mbti || 'MBTI 미입력'}
                        {rel.startDate && ` | ${rel.startDate}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary"
                        onClick={() => openExDialog(rel)}
                        title="EX로 이동"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground"
                        onClick={() => deleteRelationship(rel.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ========== Add Relationship - 2-step wizard ========== */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="sticky top-0 z-10 bg-card border-b border-border px-5 py-4">
            <DialogTitle>관계 추가</DialogTitle>
            <div className="flex items-center gap-1 pt-2">
              {Array.from({ length: ADD_TOTAL_STEPS }, (_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-1.5 flex-1 rounded-full transition-colors',
                    i <= addStep ? 'bg-primary' : 'bg-muted',
                  )}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              {addStep === 0 && '기본 정보'}
              {addStep === 1 && '상세 + 저장'}
            </p>
          </DialogHeader>

          <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="px-5 pb-5">
            {/* Step 0: 기본 정보 */}
            {addStep === 0 && (
              <div className="space-y-5 pt-4">
                <div className="space-y-2">
                  <Label>별명 *</Label>
                  <Input {...addForm.register('nickname')} placeholder="별명을 입력해주세요" />
                  {addForm.formState.errors.nickname && (
                    <p className="text-xs text-destructive">{addForm.formState.errors.nickname.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>관계 단계 *</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {RELATIONSHIP_STAGES.map((s) => (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => addForm.setValue('stage', s.value as 'some' | 'dating' | 'serious')}
                        className={cn(
                          'rounded-lg border px-3 py-2.5 text-sm font-medium transition-all',
                          watchedStage === s.value
                            ? 'border-primary bg-primary/10 text-primary shadow-neo'
                            : 'border-border bg-background text-muted-foreground hover:border-primary/50',
                        )}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                  {addForm.formState.errors.stage && (
                    <p className="text-xs text-destructive">{addForm.formState.errors.stage.message}</p>
                  )}
                </div>

                <MbtiSlider value={addMbti} onChange={setAddMbti} />

                <div className="space-y-2">
                  <Label>성격 특성</Label>
                  <Input {...addForm.register('personality')} placeholder="예: 다정하고 내성적인 편" />
                  <p className="text-xs text-muted-foreground">상대의 성격을 간단히 설명해주세요</p>
                </div>

                <Button type="button" onClick={() => setAddStep(1)} className="w-full shadow-neo hover-neo">
                  다음 <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Step 1: 상세 + 저장 */}
            {addStep === 1 && (
              <div className="space-y-5 pt-4">
                <div className="space-y-2">
                  <Label>시작일</Label>
                  <Input type="date" {...addForm.register('startDate')} />
                </div>

                <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    AI가 관계 데이터를 종합 분석할 때 사용돼요
                  </p>
                </div>

                {/* Summary badges */}
                <div className="rounded-xl border border-border bg-card/50 p-4 space-y-2">
                  <p className="text-sm font-bold text-foreground">입력 요약</p>
                  <div className="flex flex-wrap gap-2">
                    {watchedStage && (
                      <Badge variant="secondary">{getStageLabel(watchedStage)}</Badge>
                    )}
                    {addMbti && <Badge variant="secondary">{addMbti}</Badge>}
                    {watchedStartDate && (
                      <Badge variant="outline">{watchedStartDate}</Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setAddStep(0)} className="flex-1">
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

      {/* ========== Move to EX - 4-step wizard ========== */}
      <Dialog open={exOpen} onOpenChange={setExOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="sticky top-0 z-10 bg-card border-b border-border px-5 py-4">
            <DialogTitle>EX로 이동</DialogTitle>
            <div className="flex items-center gap-1 pt-2">
              {Array.from({ length: EX_TOTAL_STEPS }, (_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-1.5 flex-1 rounded-full transition-colors',
                    i <= exStep ? 'bg-primary' : 'bg-muted',
                  )}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              {exStep === 0 && '기본 정보'}
              {exStep === 1 && `소통 스타일 분석 (${exAnsweredCount}/10)`}
              {exStep === 2 && '좋았던 점과 갈등'}
              {exStep === 3 && '이별과 마무리'}
            </p>
          </DialogHeader>

          <form onSubmit={exForm.handleSubmit(onExSubmit)} className="px-5 pb-5">
            {/* Step 0: 기본 정보 (pre-filled) */}
            {exStep === 0 && (
              <div className="space-y-5 pt-4">
                {/* Cascade warning */}
                {(conflictCountQuery.data ?? 0) > 0 && (
                  <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                    <p className="text-xs leading-relaxed text-destructive">
                      이 관계에 연결된 갈등 기록 <strong>{conflictCountQuery.data}개</strong>가 함께 삭제됩니다
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>별명</Label>
                  <Input {...exForm.register('nickname')} />
                </div>

                <div className="space-y-2">
                  <Label>교제 기간 (개월)</Label>
                  <Input type="number" min={0} {...exForm.register('relationshipDuration', { valueAsNumber: true })} placeholder="예: 12" />
                </div>

                <div className="space-y-2">
                  <Label>성격 특성</Label>
                  <Input {...exForm.register('personality')} placeholder="예: 외향적이고 활발한 성격" />
                </div>

                <MbtiSlider value={exMbti} onChange={setExMbti} />

                <Button type="button" onClick={() => setExStep(1)} className="w-full shadow-neo hover-neo">
                  다음 <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Step 1: 10가지 소통 스타일 질문 */}
            {exStep === 1 && (
              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    <span className="font-semibold text-foreground">AI가 관계 패턴을 분석하는 핵심 데이터예요.</span>{' '}
                    상대의 소통 방식을 떠올리며 가장 가까운 항목을 선택해주세요.
                  </p>
                </div>

                {RELATIONSHIP_STYLE_QUESTIONS.map((q) => (
                  <div key={q.id} className="rounded-xl border border-border bg-card/50 p-4">
                    <p className="text-sm font-bold text-foreground mb-1">{q.title}</p>
                    <p className="text-xs text-muted-foreground mb-3">{q.question}</p>
                    <div className="space-y-1.5">
                      {q.options.map((opt) => {
                        const isSelected = exStyleAnswers[q.id] === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setExStyleAnswers((prev) => ({ ...prev, [q.id]: opt.value }));
                              exForm.setValue('styleAnswers', { ...exStyleAnswers, [q.id]: opt.value });
                            }}
                            className={cn(
                              'w-full rounded-lg border px-3 py-2.5 text-left text-xs font-medium transition-all',
                              isSelected
                                ? 'border-primary bg-primary/10 text-primary shadow-neo'
                                : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground',
                            )}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="flex gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setExStep(0)} className="flex-1">
                    <ChevronLeft className="mr-1 h-4 w-4" /> 이전
                  </Button>
                  <Button type="button" onClick={() => setExStep(2)} className="flex-1 shadow-neo hover-neo">
                    다음 <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: 좋았던 점 + 갈등 */}
            {exStep === 2 && (
              <div className="space-y-5 pt-4">
                <div className="space-y-2">
                  <Label>좋았던 점</Label>
                  <p className="text-xs text-muted-foreground">이 관계에서 행복했던 순간이나 상대의 장점을 적어주세요</p>
                  <Textarea
                    {...exForm.register('goodPoints')}
                    placeholder="예: 항상 내 이야기를 잘 들어줬고, 힘들 때 든든한 존재였어요..."
                    rows={4}
                    maxLength={1000}
                  />
                </div>

                <div className="space-y-3">
                  <div>
                    <Label>주요 갈등 유형</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">해당하는 항목을 모두 선택해주세요</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {CONFLICT_TYPES.map((t) => {
                      const isSelected = exSelectedConflicts.includes(t);
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            const next = isSelected
                              ? exSelectedConflicts.filter((c) => c !== t)
                              : [...exSelectedConflicts, t];
                            setExSelectedConflicts(next);
                            exForm.setValue('conflictTypes', next);
                          }}
                          className={cn(
                            'rounded-lg border px-3 py-2 text-xs font-medium transition-all',
                            isSelected
                              ? 'border-primary bg-primary/10 text-primary shadow-neo'
                              : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground',
                          )}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                  {exSelectedConflicts.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <Label>갈등 상황 상세 설명</Label>
                      <Textarea
                        {...exForm.register('conflictDetail')}
                        placeholder={`예: ${exSelectedConflicts[0]}에서 자주 다퉜는데...`}
                        rows={4}
                        maxLength={1000}
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setExStep(1)} className="flex-1">
                    <ChevronLeft className="mr-1 h-4 w-4" /> 이전
                  </Button>
                  <Button type="button" onClick={() => setExStep(3)} className="flex-1 shadow-neo hover-neo">
                    다음 <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: 이별 + 최종 저장 */}
            {exStep === 3 && (
              <div className="space-y-5 pt-4">
                <div className="space-y-2">
                  <Label>이별 사유</Label>
                  <p className="text-xs text-muted-foreground">어떤 이유로 관계가 끝나게 되었나요?</p>
                  <Textarea
                    {...exForm.register('breakupReason')}
                    placeholder="솔직하게 적을수록 AI 분석이 정확해져요"
                    rows={4}
                    maxLength={500}
                  />
                </div>

                {/* Cascade warning again on final step */}
                {(conflictCountQuery.data ?? 0) > 0 && (
                  <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                    <p className="text-xs leading-relaxed text-destructive">
                      이 관계에 연결된 갈등 기록 <strong>{conflictCountQuery.data}개</strong>가 함께 삭제됩니다
                    </p>
                  </div>
                )}

                {/* Summary */}
                <div className="rounded-xl border border-border bg-card/50 p-4 space-y-2">
                  <p className="text-sm font-bold text-foreground">작성 요약</p>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline">소통 스타일 {exAnsweredCount}/10</Badge>
                    {exSelectedConflicts.length > 0 && (
                      <Badge variant="outline">갈등 유형 {exSelectedConflicts.length}개</Badge>
                    )}
                    {exMbti && <Badge variant="secondary">{exMbti}</Badge>}
                  </div>
                  {exAnsweredCount < 5 && (
                    <p className="text-xs text-primary">
                      소통 스타일을 더 많이 입력하면 분석 정확도가 높아져요
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setExStep(2)} className="flex-1">
                    <ChevronLeft className="mr-1 h-4 w-4" /> 이전
                  </Button>
                  <Button type="submit" disabled={isMovingToEx} className="flex-1 shadow-neo hover-neo">
                    {isMovingToEx ? '이동 중...' : 'EX로 이동'}
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
