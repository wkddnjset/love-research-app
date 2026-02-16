import { z } from 'zod';

export const compatibilityInputSchema = z.object({
  myMbti: z.string().min(1, 'MBTI를 선택해주세요'),
  partnerMbti: z.string().min(1, '상대 MBTI를 선택해주세요'),
  myPersonality: z.string().max(200).default(''),
  partnerPersonality: z.string().max(200).default(''),
  conflictHistory: z.array(z.string()).default([]),
  relationshipId: z.string().optional(),
});

export type CompatibilityInputFormData = z.input<typeof compatibilityInputSchema>;

export const mediatorInputSchema = z.object({
  situation: z.string().min(1, '현재 상황을 설명해주세요').max(2000),
  partnerMbti: z.string().default(''),
  relationshipStage: z.string().min(1, '관계 단계를 선택해주세요'),
  conflictType: z.string().min(1, '갈등 유형을 선택해주세요'),
});

export type MediatorInputFormData = z.input<typeof mediatorInputSchema>;

export const breakupInputSchema = z.object({
  recentConflicts: z.string().min(1, '최근 갈등 상황을 설명해주세요').max(2000),
  repeatCount: z.number().min(0, '0 이상의 숫자를 입력해주세요'),
  satisfactionScore: z.number().min(1).max(10),
  futureAlignmentScore: z.number().min(1).max(10),
  relationshipDuration: z.number().min(0),
});

export type BreakupInputFormData = z.input<typeof breakupInputSchema>;

export const someInputSchema = z.object({
  meetCount: z.number().min(0),
  contactFrequency: z.string().min(1, '연락 빈도를 입력해주세요'),
  replySpeed: z.string().min(1, '답장 속도를 입력해주세요'),
  partnerBehavior: z.string().min(1, '상대의 행동 패턴을 설명해주세요').max(2000),
});

export type SomeInputFormData = z.input<typeof someInputSchema>;
