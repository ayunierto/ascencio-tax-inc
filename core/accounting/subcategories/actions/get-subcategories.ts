import { httpClient } from '@/core/adapters/http/httpClient.adapter';
import { GetSubcategoriesResponse } from '../interfaces';
import { handleApiErrors } from '@/core/auth/utils';

export const getSubcategories = async (): Promise<GetSubcategoriesResponse> => {
  try {
    const res = await httpClient.get<GetSubcategoriesResponse>('subcategory');
    return res;
  } catch (error) {
    console.error(error);
    return handleApiErrors(error, 'getSubcategories');
  }
};
