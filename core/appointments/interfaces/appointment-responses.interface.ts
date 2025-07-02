import { ExceptionResponse } from '@/core/interfaces';
import { Appointment } from './appointmentResponse';

export type GetCurrentUserAppointmentsResponse =
  | Appointment[]
  | ExceptionResponse;
