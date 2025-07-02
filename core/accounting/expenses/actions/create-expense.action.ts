import { CreateExpenseRequest, CreateExpenseResponse } from '../interfaces';
import { uploadImage } from '@/core/files/actions/upload-image.action';
import { httpClient } from '@/core/adapters/http/httpClient.adapter';
import { handleApiErrors } from '@/core/auth/utils';

export const createExpense = async (
  expense: CreateExpenseRequest
): Promise<CreateExpenseResponse> => {
  try {
    if (expense.image && !(typeof expense.image === 'string')) {
      const uploadedImage = await uploadImage(expense.image);
      if (uploadedImage && 'image' in uploadedImage) {
        expense.image = uploadedImage.image;
      }
    }

    const response = await httpClient.post<CreateExpenseResponse>('expense', {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expense),
    });

    return response;
  } catch (error) {
    console.error(error);
    return handleApiErrors(error, 'createExpense');
  }
};
