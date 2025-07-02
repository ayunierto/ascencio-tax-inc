import { z } from 'zod';
import { VerifyEmailCodeRequest } from '../interfaces';

export const verifyEmailSchema = z.object({
  email: z
    .string({ message: 'Invalid email address.' })
    .email('Invalid email address.'),
  code: z.string().regex(/^\d{6}$/, 'It must be a code of 6 numerical digits.'),
}) satisfies z.ZodType<VerifyEmailCodeRequest>;

export type VerifyEmailFormInputs = z.infer<typeof verifyEmailSchema>;
