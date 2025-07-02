import { z } from 'zod';
import { UpdateProfileRequest } from '../interfaces/update-profile.interface';

export const profileSchema = z
  .object({
    firstName: z.string().min(3, 'First name must be at least 3 characters'),
    lastName: z.string().min(3, 'Last name must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    countryCode: z.string().optional(),
    phoneNumber: z.string().optional(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  }) satisfies z.ZodType<UpdateProfileRequest>;

export type ProfileFormValues = z.infer<typeof profileSchema>;
