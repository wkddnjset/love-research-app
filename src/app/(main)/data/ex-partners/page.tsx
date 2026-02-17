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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import MobileHeader from '@/components/layout/MobileHeader';
import MbtiSlider from '@/components/MbtiSlider';
import { exPartnerSchema, type ExPartnerFormData } from '@/types/schemas/love-data';
import { useExPartners } from '@/hooks/useSupabaseData';
import { CONFLICT_TYPES, RELATIONSHIP_STYLE_QUESTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';

const TOTAL_STEPS = 4;

export default function ExPartnersPage() {
  const { exPartners, addExPartner, deleteExPartner } = useExPartners();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [mbti, setMbti] = useState('');
  const [styleAnswers, setStyleAnswers] = useState<Record<string, string>>({});
  const [selectedConflicts, setSelectedConflicts] = useState<string[]>([]);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ExPartnerFormData>({
    resolver: zodResolver(exPartnerSchema),
    defaultValues: { conflictTypes: [], styleAnswers: {}, goodPoints: '' },
  });

  const openDialog = () => {
    reset({ conflictTypes: [], conflictDetail: '', styleAnswers: {}, goodPoints: '' });
    setMbti('');
    setStyleAnswers({});
    setSelectedConflicts([]);
    setStep(0);
    setOpen(true);
  };

  const onSubmit = async (data: ExPartnerFormData) => {
    await addExPartner({
      ...data,
      mbti: mbti || undefined,
      conflictTypes: data.conflictTypes ?? [],
      conflictDetail: data.conflictDetail ?? undefined,
      styleAnswers: styleAnswers,
      goodPoints: data.goodPoints ?? undefined,
    });
    reset();
    setMbti('');
    setStyleAnswers({});
    setSelectedConflicts([]);
    setOpen(false);
  };

  const answeredCount = Object.keys(styleAnswers).length;

  return (
    <div>
      <MobileHeader
        title="지난 연애 회고"
        showBack
        rightAction={
          <Button variant="ghost" size="sm" className="text-primary" onClick={openDialog}>
            <Plus className="h-5 w-5" />
          </Button>
        }
      />

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 px-5 py-5">
        {exPartners.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary border border-border shadow-neo mb-4">
              <span className="text-3xl">💭</span>
            </div>
            <p className="font-bold text-foreground">아직 회고 기록이 없어요</p>
            <p className="mt-1 text-sm text-muted-foreground">
              지난 연애를 돌아보면
              <br />
              나의 연애 패턴을 파악할 수 있어요
            </p>
            <Button className="mt-4 shadow-neo hover-neo" onClick={openDialog}>
              <Plus className="mr-1 h-4 w-4" />
              첫 회고 작성하기
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {exPartners.map((partner) => (
              <Card key={partner.id} className="shadow-neo">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{partner.nickname}</h3>
                        {partner.mbti && (
                          <Badge variant="secondary">{partner.mbti}</Badge>
                        )}
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {partner.relationshipDuration && (
                          <Badge variant="outline" className="text-xs">
                            {partner.relationshipDuration}개월
                          </Badge>
                        )}
                        {Object.keys(partner.styleAnswers ?? {}).length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            스타일분석 {Object.keys(partner.styleAnswers).length}/10
                          </Badge>
                        )}
                        {(partner.conflictTypes ?? []).map((ct) => (
                          <Badge key={ct} variant="outline" className="text-xs text-primary border-primary/30">
                            {ct}
                          </Badge>
                        ))}
                      </div>
                      {partner.breakupReason && (
                        <p className="mt-1.5 text-xs text-muted-foreground line-clamp-1">
                          {partner.breakupReason}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground"
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
        <DialogContent className="max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="sticky top-0 z-10 bg-card border-b border-border px-5 py-4">
            <DialogTitle>지난 연애 회고</DialogTitle>
            {/* Step indicator */}
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
              {step === 0 && '기본 정보'}
              {step === 1 && `소통 스타일 분석 (${answeredCount}/10)`}
              {step === 2 && '좋았던 점과 갈등'}
              {step === 3 && '이별과 마무리'}
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="px-5 pb-5">
            {/* Step 0: 기본 정보 */}
            {step === 0 && (
              <div className="space-y-5 pt-4">
                <div className="space-y-2">
                  <Label>별명 *</Label>
                  <Input {...register('nickname')} placeholder="예: 첫사랑, 대학때 그 사람" />
                  {errors.nickname && <p className="text-xs text-destructive">{errors.nickname.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>교제 기간 (개월)</Label>
                  <Input type="number" min={0} {...register('relationshipDuration', { valueAsNumber: true })} placeholder="예: 12" />
                </div>

                <div className="space-y-2">
                  <Label>성격 특성</Label>
                  <Input {...register('personality')} placeholder="예: 외향적이고 활발한 성격" />
                </div>

                <MbtiSlider value={mbti} onChange={setMbti} />

                <Button type="button" onClick={() => setStep(1)} className="w-full shadow-neo hover-neo">
                  다음 <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Step 1: 10가지 소통 스타일 질문 */}
            {step === 1 && (
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
                        const isSelected = styleAnswers[q.id] === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setStyleAnswers((prev) => ({ ...prev, [q.id]: opt.value }));
                              setValue('styleAnswers', { ...styleAnswers, [q.id]: opt.value });
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
                  <Button type="button" variant="outline" onClick={() => setStep(0)} className="flex-1">
                    <ChevronLeft className="mr-1 h-4 w-4" /> 이전
                  </Button>
                  <Button type="button" onClick={() => setStep(2)} className="flex-1 shadow-neo hover-neo">
                    다음 <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: 좋았던 점 + 갈등 */}
            {step === 2 && (
              <div className="space-y-5 pt-4">
                <div className="space-y-2">
                  <Label>좋았던 점</Label>
                  <p className="text-xs text-muted-foreground">이 관계에서 행복했던 순간이나 상대의 장점을 적어주세요</p>
                  <Textarea
                    {...register('goodPoints')}
                    placeholder="예: 항상 내 이야기를 잘 들어줬고, 힘들 때 든든한 존재였어요. 취미를 함께 즐기는 게 좋았고..."
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
                      const isSelected = selectedConflicts.includes(t);
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            const next = isSelected
                              ? selectedConflicts.filter((c) => c !== t)
                              : [...selectedConflicts, t];
                            setSelectedConflicts(next);
                            setValue('conflictTypes', next);
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
                  {selectedConflicts.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <Label>갈등 상황 상세 설명</Label>
                      <p className="text-xs text-muted-foreground">
                        선택한 갈등이 구체적으로 어떤 상황에서 발생했는지 적어주세요
                      </p>
                      <Textarea
                        {...register('conflictDetail')}
                        placeholder={`예: ${selectedConflicts[0]}에서 자주 다퉜는데, 주로 상대가 먼저 연락을 끊고 며칠간 무시하는 패턴이 반복됐어요...`}
                        rows={4}
                        maxLength={1000}
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                    <ChevronLeft className="mr-1 h-4 w-4" /> 이전
                  </Button>
                  <Button type="button" onClick={() => setStep(3)} className="flex-1 shadow-neo hover-neo">
                    다음 <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: 이별 + 최종 저장 */}
            {step === 3 && (
              <div className="space-y-5 pt-4">
                <div className="space-y-2">
                  <Label>이별 사유</Label>
                  <p className="text-xs text-muted-foreground">어떤 이유로 관계가 끝나게 되었나요?</p>
                  <Textarea
                    {...register('breakupReason')}
                    placeholder="솔직하게 적을수록 AI 분석이 정확해져요"
                    rows={4}
                    maxLength={500}
                  />
                </div>

                {/* Summary */}
                <div className="rounded-xl border border-border bg-card/50 p-4 space-y-2">
                  <p className="text-sm font-bold text-foreground">작성 요약</p>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline">소통 스타일 {answeredCount}/10</Badge>
                    {selectedConflicts.length > 0 && (
                      <Badge variant="outline">갈등 유형 {selectedConflicts.length}개</Badge>
                    )}
                    {mbti && <Badge variant="secondary">{mbti}</Badge>}
                  </div>
                  {answeredCount < 5 && (
                    <p className="text-xs text-primary">
                      소통 스타일을 더 많이 입력하면 분석 정확도가 높아져요
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">
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
