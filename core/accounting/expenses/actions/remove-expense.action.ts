import { handleApiErrors } from '@/core/auth/utils/handleApiErrors';
import { DeleteExpenseRequest, DeleteExpenseResponse } from '../interfaces';
import { httpClient } from '@/core/adapters/http/httpClient.adapter';

export const removeExpense = async ({
  id,
}: DeleteExpenseRequest): Promise<DeleteExpenseResponse> => {
  try {
    const res = await httpClient.delete<DeleteExpenseResponse>(
      `expense/${id}`,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return res;
  } catch (error) {
    console.error('Error deleting expense:', error);
    return handleApiErrors(error, 'removeExpense');
  }
};
