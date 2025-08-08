import { httpClient } from '@/core/adapters/http/httpClient.adapter';
import { Category } from '../interfaces';
import { ExceptionResponse } from '@/core/interfaces';
import { handleApiErrors } from '@/core/auth/utils/handleApiErrors';

export const getCategories = async (): Promise<
  Category[] | ExceptionResponse
> => {
  try {
    const response = await httpClient.get<Category[]>('categories', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    console.error(error);
    return handleApiErrors(error, 'getCategories');
  }
};
