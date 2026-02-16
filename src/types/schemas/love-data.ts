import { z } from 'zod';

export const exPartnerSchema = z.object({
  nickname: z.string().min(1, '별명을 입력해주세요').max(20),
  mbti: z.string().optional(),
  personality: z.string().max(100).optional(),
  conflictTypes: z.array(z.string()).default([]),
  breakupReason: z.string().max(500).optional(),
  satisfactionScore: z.number().min(1).max(10),
  relationshipDuration: z.number().min(0).optional(),
});

export type ExPartnerFormData = z.input<typeof exPartnerSchema>;

export const currentRelationshipSchema = z.object({
  nickname: z.string().min(1, '별명을 입력해주세요').max(20),
  mbti: z.string().optional(),
  personality: z.string().max(100).optional(),
  stage: z.enum(['some', 'dating', 'serious']),
  startDate: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type CurrentRelationshipFormData = z.input<typeof currentRelationshipSchema>;

export const conflictRecordSchema = z.object({
  relationshipId: z.string().min(1, '관계를 선택해주세요'),
  title: z.string().min(1, '제목을 입력해주세요').max(100),
  description: z.string().min(1, '내용을 입력해주세요').max(2000),
  conflictType: z.string().min(1, '갈등 유형을 선택해주세요'),
  severity: z.number().min(1).max(5),
  isResolved: z.boolean().default(false),
});

export type ConflictRecordFormData = z.input<typeof conflictRecordSchema>;

export const emotionRecordSchema = z.object({
  relationshipId: z.string().optional(),
  mood: z.enum(['happy', 'sad', 'angry', 'anxious', 'confused', 'peaceful']),
  score: z.number().min(1).max(10),
  content: z.string().min(1, '내용을 입력해주세요').max(2000),
  tags: z.array(z.string()).default([]),
});

export type EmotionRecordFormData = z.input<typeof emotionRecordSchema>;
