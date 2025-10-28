import { AxiosError } from 'axios';
import { ReceiptImage } from '../interfaces/upload-receipt-image.response';
import { ServerException } from '@/core/interfaces/server-exception.response';
import { useMutation } from '@tanstack/react-query';
import { uploadReceiptImage } from '../actions/upload-receipt-image';
import { AnalyzedExpense } from '../interfaces/analyze-expense.interface';
import { getReceiptValues } from '../../receipts/actions/get-receipt-values.action';

export const useReceiptImageMutation = () => {
  const uploadImageMutation = useMutation<
    ReceiptImage,
    AxiosError<ServerException>,
    string
  >({
    mutationFn: uploadReceiptImage,
    onError(error) {
      console.error(error.response?.data.message || error.message);
    },
  });

  const getReceiptValuesMutation = useMutation<
    AnalyzedExpense,
    AxiosError<ServerException>,
    string
  >({
    mutationFn: getReceiptValues,
    onError(error) {
      console.error(error);
    },
  });

  return {
    uploadImageMutation,
    getReceiptValuesMutation,
  };
};
