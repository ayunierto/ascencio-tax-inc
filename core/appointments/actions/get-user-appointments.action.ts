import { httpClient } from '@/core/adapters/http/httpClient.adapter';
import * as SecureStore from 'expo-secure-store';
import { GetCurrentUserAppointmentsResponse } from '../interfaces';
import { handleApiErrors } from '@/core/auth/utils';

export const getUserAppointments = async (
  state: 'pending' | 'past' = 'pending'
) => {
  try {
    const res = httpClient.get<GetCurrentUserAppointmentsResponse>(
      `appointment/current-user?state=${state}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return res;
  } catch (error) {
    console.error(error);
    return handleApiErrors(error, 'getUserAppointments');
  }
};
