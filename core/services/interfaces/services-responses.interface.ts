import { HttpError } from '@/core/adapters/http/http-client.interface';
import { Service } from './service.interface';

export type CreateServiceResponse = Service | HttpError;
export type GetServiceResponse = Service | HttpError;
export type GetServicesResponse = Service[] | HttpError;
export type UpdateServiceResponse = Service | HttpError;
export type DeleteServiceResponse = Service | HttpError;
