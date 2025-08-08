import { httpClient } from '@/core/adapters/http/httpClient.adapter';
import { GetExpenseRequest, GetExpenseResponse } from '../interfaces';
import { handleApiErrors } from '@/core/auth/utils/handleApiErrors';

export const getExpense = async ({
  id,
}: GetExpenseRequest): Promise<GetExpenseResponse> => {
  try {
    const res = await httpClient.get<GetExpenseResponse>('expense/' + id, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return res;
  } catch (error) {
    console.error(error);
    return handleApiErrors(error, 'getExpense');
  }
};
