import { z } from 'zod';
import { ResetPasswordRequest } from '../interfaces';

export const resetPasswordSchema = z.object({
  email: z
    .string({ message: 'Invalid email address.' })
    .email('Invalid email address.'),
  code: z
    .string({ required_error: 'Code is required.' })
    .regex(/^\d{6}$/, 'It must be a code of 6 numerical digits.'),
  newPassword: z
    .string({ required_error: 'New password is required.' })
    .min(6, 'Password must be at least 6 characters long.')
    .max(100, 'Password must be at most 100 characters long.'),
}) satisfies z.ZodType<ResetPasswordRequest>;

export type ResetPasswordFormInputs = z.infer<typeof resetPasswordSchema>;
