import { httpClient } from '@/core/adapters/http/httpClient.adapter';
import { GetServicesResponse } from '../interfaces';
import { handleApiErrors } from '@/core/auth/utils/handleApiErrors';

export const getServices = async (): Promise<GetServicesResponse> => {
  try {
    const services = await httpClient.get<GetServicesResponse>('services', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return services;
  } catch (error) {
    return handleApiErrors(error, 'getServices');
  }
};
