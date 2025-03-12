import { z } from 'zod';

export const signupSchema = z
  .object({
    name: z.string().min(3, 'First name must be at least 3 characters'),
    lastName: z.string().min(3, 'First name must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    countryCode: z.string().nonempty('The country code is required'),
    phoneNumber: z.string().nonempty('The phone number is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    // .regex(
    //   /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    //   'Password must include uppercase, lowercase and numbers'
    // ),
    confirmPassword: z
      .string()
      .min(6, 'Confirm Password must be at least 6 characters')
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });
