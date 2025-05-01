import { z } from 'zod';

export const signinSchema = z.object({
  email: z.string().email(),
  password: z
    .string({ message: 'The password is required' })
    .min(6, 'Password must be at least 6 characters'),
});
