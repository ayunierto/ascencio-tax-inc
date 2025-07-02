import { ExceptionResponse } from '@/core/interfaces';
import { Log } from './log.interface';

export type CreateLogResponse = Log | ExceptionResponse;
export type GetLogsResponse = Log[] | ExceptionResponse;
