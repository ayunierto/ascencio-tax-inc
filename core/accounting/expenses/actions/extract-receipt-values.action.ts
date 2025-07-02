import { httpClient } from '@/core/adapters/http/httpClient.adapter';
import { AnalyzeExpenseRequest, AnalyzeExpenseResponse } from '../interfaces';
import { handleApiErrors } from '@/core/auth/utils';

export const extractReceiptValues = async (
  base64Image: AnalyzeExpenseRequest
): Promise<AnalyzeExpenseResponse> => {
  try {
    const res = await httpClient.post<AnalyzeExpenseResponse>(
      'expense/analyze-expense',
      {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ base64Image }),
      }
    );

    return res;
  } catch (error) {
    console.error(error);
    return handleApiErrors(error, 'extractReceiptValues');
  }
};
