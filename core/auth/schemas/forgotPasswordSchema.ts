import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  username: z.string().nonempty('You must write your email or password.'),
});
