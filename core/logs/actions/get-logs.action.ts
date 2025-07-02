import { httpClient } from '@/core/adapters/http/httpClient.adapter';
import { GetLogsResponse } from '../interfaces';
import { handleApiErrors } from '@/core/auth/utils';

export const getLogs = async (
  limit = 6,
  offset = 0
): Promise<GetLogsResponse> => {
  try {
    const res = await httpClient.get<GetLogsResponse>(
      `logs?limit=${limit}&offset=${offset}`
    );
    return res;
  } catch (error) {
    console.error(error);
    return handleApiErrors(error, 'getLogs');
  }
};
