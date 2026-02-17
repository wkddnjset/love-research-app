import { z } from 'zod';

export const compatibilityInputSchema = z.object({
  targetCode: z.string().min(1, '상대방 코드를 입력해주세요').regex(/^LR-[A-Z0-9]{6}$/, '올바른 코드 형식이 아닙니다 (예: LR-A3X9K2)'),
});

export type CompatibilityInputFormData = z.input<typeof compatibilityInputSchema>;
