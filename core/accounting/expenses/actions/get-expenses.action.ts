import { handleApiErrors } from '@/core/auth/utils';
import { GetExpensesResponse } from '../interfaces';
import { httpClient } from '@/core/adapters/http/httpClient.adapter';

export const getExpenses = async (
  limit = 20,
  offset = 0
): Promise<GetExpensesResponse> => {
  try {
    const res = await httpClient.get<GetExpensesResponse>(
      `expense?limit=${limit}&offset=${offset}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return res;
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return handleApiErrors(error, 'getExpenses');
  }
};
