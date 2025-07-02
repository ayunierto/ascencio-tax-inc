import { httpClient } from '@/core/adapters/http/httpClient.adapter';
import { Report } from '../interfaces';
import { ExceptionResponse } from '@/core/interfaces';
import { handleApiErrors } from '@/core/auth/utils';

export const getReports = async (
  limit = 100,
  offset = 0
): Promise<Report[] | ExceptionResponse> => {
  try {
    const res = httpClient.get<Report[] | ExceptionResponse>(
      `reports?limit=${limit}&offset=${offset}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return res;
  } catch (error) {
    console.error(error);
    return handleApiErrors(error, 'getReports');
  }
};
