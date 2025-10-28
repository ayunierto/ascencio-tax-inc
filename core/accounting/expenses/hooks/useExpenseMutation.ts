import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ExpenseResponse } from '../interfaces/expense.interface';
import { AxiosError } from 'axios';
import { ServerException } from '@/core/interfaces/server-exception.response';
import { ExpenseFormFields } from '../schemas/expenseSchema';
import { createUpdateExpense } from '../actions';

export const useExpenseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ExpenseResponse,
    AxiosError<ServerException>,
    ExpenseFormFields
  >({
    mutationFn: createUpdateExpense,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['expenses', 'infinite'] });
      queryClient.invalidateQueries({ queryKey: ['expense', data.id] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
