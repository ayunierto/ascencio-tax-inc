import { ServiceResponse } from '../interfaces/services.response';

export const getServices = async (): Promise<ServiceResponse[] | null> => {
  try {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    const response = await fetch(`${API_URL}/services`);

    const services = await response.json();

    return services;
  } catch (error) {
    console.error(error);
    return null;
  }
};
