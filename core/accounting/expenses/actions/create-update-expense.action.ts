import { api } from '@/core/api/api';
import { ExpenseFormFields } from '../schemas';
import { ExpenseResponse } from '../interfaces';

export const createUpdateExpense = async (expense: ExpenseFormFields) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...rest } = expense;
  const { data } = await api<ExpenseResponse>({
    method: id === 'new' ? 'POST' : 'PATCH',
    url: id === 'new' ? '/expenses' : `/expenses/${id}`,
    data: rest,
  });
  return data;
};
