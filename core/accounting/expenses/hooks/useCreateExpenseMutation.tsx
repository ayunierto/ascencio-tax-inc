import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateExpenseRequest, CreateExpenseResponse } from '../interfaces';
import { createExpense } from '../actions';
import Toast from 'react-native-toast-message';
import { useCameraStore } from '@/core/camera/store';
import { router } from 'expo-router';

export const useCreateExpenseMutation = () => {
  const queryClient = useQueryClient();
  const { clearImages } = useCameraStore();

  return useMutation<CreateExpenseResponse, Error, CreateExpenseRequest>({
    mutationFn: async (data: CreateExpenseRequest) => {
      const response = await createExpense(data);
      return response;
    },
    onSuccess: async (data) => {
      if ('error' in data) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: data.message,
        });
        return;
      }
      await queryClient.invalidateQueries({
        queryKey: ['expenses', 'infinite'],
      });

      // To update dashboard
      await queryClient.invalidateQueries({
        queryKey: ['totalExpenses'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['logs'],
      });

      Toast.show({
        type: 'success',
        text1: `Receipt ${data.merchant} saved.`,
        text2: 'Receipt was saved correctly',
      });
      clearImages();
      router.replace('/accounting/receipts/expense');
    },
    onError() {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error saving receipt',
      });
    },
  });
};
