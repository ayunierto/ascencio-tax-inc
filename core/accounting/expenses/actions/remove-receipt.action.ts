import { api } from '@/core/api/api';

export const removeReceiptImage = async (imageUrl: string) => {
  const { data } = await api.post('/expenses/delete-receipt', {
    imageUrl,
  });
  return data;
};
