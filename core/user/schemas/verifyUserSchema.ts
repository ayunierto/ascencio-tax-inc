import { z } from 'zod';

export const verifyUserSchema = z.object({
  verificationCode: z
    .string()
    .regex(/^\d{6}$/, 'It must be a code of 6 numerical digits.'),
});
