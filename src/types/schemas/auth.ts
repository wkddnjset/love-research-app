import { z } from 'zod';

export const userProfileSchema = z.object({
  mbti: z.string().optional(),
  birthYear: z.number().min(1950).max(2010).optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  loveStyle: z.string().max(200).optional(),
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;
