import { z } from 'zod';
import { CreateExpenseRequest } from '../interfaces';
import { ImagePickerAsset } from 'expo-image-picker';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB en bytes
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export const imageFileSchema = z
  .custom<ImagePickerAsset | undefined>()
  .refine((file) => file !== undefined, 'Image is required.')
  .refine(
    (file) => file && file.fileSize && file.fileSize <= MAX_IMAGE_SIZE,
    `The maximum file size is ${MAX_IMAGE_SIZE / (1024 * 1024)}MB.`
  )
  .refine(
    (file) => file && file.type && ACCEPTED_IMAGE_TYPES.includes(file.type),
    'Only .jpg, .jpeg, .png, and .webp files are allowed.'
  );

export const createExpenseSchema = z.object({
  accountId: z.string(),
  categoryId: z.string(),
  date: z.string().nonempty('The date is required'),
  image: imageFileSchema.optional(),
  merchant: z.string().min(1, { message: 'The merchant is required' }),
  notes: z.string().optional(),
  subcategoryId: z.string().optional(),
  tax: z.number().min(0.01, { message: 'The tax must be greater than 0' }),
  // .regex(/^\d+(\.\d+)?$/, 'Only numbers with decimals are allowed'),
  total: z.number().min(0.01, { message: 'The total must be greater than 0' }),
  // .regex(/^\d+(\.\d+)?$/, 'Only numbers with decimals are allowed'),
}) satisfies z.ZodType<CreateExpenseRequest>;

export type CreateExpenseFormInputs = z.infer<typeof createExpenseSchema>;
