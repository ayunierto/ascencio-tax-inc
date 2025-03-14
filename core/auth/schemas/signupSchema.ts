import { z } from 'zod';

export const signupSchema = z
  .object({
    name: z
      .string({ message: 'The name is required' })
      .min(3, 'First name must be at least 3 characters'),
    lastName: z
      .string({ message: 'The last name is required' })
      .min(3, 'First name must be at least 3 characters'),
    email: z
      .string({ message: 'The email is required' })
      .email('Invalid email address'),
    countryCode: z.string().optional(),
    phoneNumber: z.string().optional(),
    password: z
      .string({ message: 'The password is required' })
      .min(6, 'Password must be at least 6 characters'),
    // .regex(
    //   /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    //   'Password must include uppercase, lowercase and numbers'
    // ),
    confirmPassword: z
      .string({ message: 'The confirm password is required' })
      .min(6, 'Confirm Password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });
