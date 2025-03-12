import { z } from 'zod';

export const expenseSchema = z.object({
  accountId: z.string(),
  categoryId: z.string(),
  date: z.string().nonempty('The date is required'),
  image: z.string().optional(),
  merchant: z.string().min(1, { message: 'The merchant is required' }),
  notes: z.string().optional(),
  subcategoryId: z.string().optional(),
  tax: z
    .string()
    .regex(/^\d+(\.\d+)?$/, 'Only numbers with decimals are allowed'),
  total: z
    .string()
    .regex(/^\d+(\.\d+)?$/, 'Only numbers with decimals are allowed'),
});
