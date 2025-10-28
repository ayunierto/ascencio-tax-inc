import { api } from '@/core/api/api';
import { ExpenseResponse } from '../interfaces';
import { DateTime } from 'luxon';

export const getExpenseByIdAction = async (
  id: string
): Promise<ExpenseResponse> => {
  if (id === 'new') {
    return {
      id: 'new',
      merchant: '',
      date: DateTime.utc().toISO(),
      total: 0,
      tax: 0,
      imageUrl: undefined,
      notes: undefined,
      category: undefined,
      subcategory: undefined,
    };
  }

  const { data } = await api.get<ExpenseResponse>(`/expenses/${id}`);

  return data;
};
