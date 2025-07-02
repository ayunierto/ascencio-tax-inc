import { z } from 'zod';
import { DeleteAccountRequest } from '../interfaces';

export const deleteAccountSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  password: z.string({ required_error: 'Password is required' }).min(6),
}) satisfies z.ZodType<DeleteAccountRequest>;

export type DeleteAccountInputs = z.infer<typeof deleteAccountSchema>;
