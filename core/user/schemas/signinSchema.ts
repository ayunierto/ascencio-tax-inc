import { z } from 'zod';

export const signinSchema = z.object({
  username: z
    .string()
    .refine(
      (value) =>
        z.string().email().safeParse(value).success ||
        /^\+\d{1,3}\d{10}$/.test(value),
      {
        message: 'Username must be a valid email address or phone number',
      }
    ),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
      'Password must include uppercase, lowercase and numbers'
    ),
});
