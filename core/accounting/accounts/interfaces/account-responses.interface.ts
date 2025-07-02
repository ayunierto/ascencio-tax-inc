import { ExceptionResponse } from '@/core/interfaces';
import { Account } from './account.interface';

export type CreateAccountResponse = Account | ExceptionResponse;
export type UpdateAccountResponse = Account | ExceptionResponse;
export type DeleteAccountResponse = Account | ExceptionResponse;
export type GetAccountResponse = Account | ExceptionResponse;
export type GetAccountsResponse = Account[] | ExceptionResponse;
