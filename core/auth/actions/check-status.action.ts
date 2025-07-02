import { httpClient } from '@/core/adapters/http/httpClient.adapter';
import { CheckStatusResponse } from '../interfaces';
import { handleApiErrors } from '../utils';

export const checkStatus = async (): Promise<CheckStatusResponse> => {
  try {
    const response = await httpClient.get<CheckStatusResponse>(
      'auth/check-status',
      {}
    );
    return response;
  } catch (error) {
    console.error('Error caught in checkStatus:', error);
    return handleApiErrors(error, 'checkStatus');
  }
};
