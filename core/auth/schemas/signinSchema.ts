import { z } from 'zod';
import { SignInRequest } from '../interfaces';

export const signInSchema = z.object({
  email: z.string().email(),
  password: z
    .string({ message: 'The password is required' })
    .min(6, 'Password must be at least 6 characters'),
}) satisfies z.ZodType<SignInRequest>;

export type SignInFormInputs = z.infer<typeof signInSchema>;
