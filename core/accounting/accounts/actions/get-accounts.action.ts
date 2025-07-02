import { httpClient } from '@/core/adapters/http/httpClient.adapter';
import { handleApiErrors } from '@/core/auth/utils';
import { GetAccountsResponse } from '../interfaces';

export const getAccounts = async (
  limit = 10,
  offset = 0
): Promise<GetAccountsResponse> => {
  try {
    const accounts = await httpClient.get<GetAccountsResponse>(
      `account?limit=${limit}&offset=${offset}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return accounts;
  } catch (error) {
    console.error(error);
    return handleApiErrors(error, 'getAccounts');
  }
};
