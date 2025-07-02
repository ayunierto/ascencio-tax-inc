import { UpdateExpenseRequest, UpdateExpenseResponse } from '../interfaces';
import { uploadImage } from '@/core/files/actions/upload-image.action';
import { httpClient } from '@/core/adapters/http/httpClient.adapter';
import { handleApiErrors } from '@/core/auth/utils';

export const updateExpense = async (
  id: string,
  expense: Partial<UpdateExpenseRequest>
): Promise<UpdateExpenseResponse> => {
  try {
    // Try to upload the image if it exists and is not a string
    if (expense.image && typeof expense.image !== 'string') {
      const uploadedImage = await uploadImage(expense.image);
      if ('error' in uploadedImage) {
        console.error(uploadedImage);
        return uploadedImage;
      }
      expense.image = uploadedImage.image;
    }

    const res = await httpClient.patch<UpdateExpenseResponse>(`expense/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expense),
    });

    return res;
  } catch (error) {
    console.error(error);
    return handleApiErrors(error, 'updateExpense');
  }
};
