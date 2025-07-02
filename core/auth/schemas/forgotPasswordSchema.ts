import { z } from 'zod';
import { ForgotPasswordRequest } from '../interfaces';

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
}) satisfies z.ZodType<ForgotPasswordRequest>;

export type ForgotPasswordInputs = z.infer<typeof forgotPasswordSchema>;
