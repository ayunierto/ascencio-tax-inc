import { ExceptionResponse } from '@/core/interfaces';
import { Expense } from './expense.interface';

export type CreateExpenseResponse = Expense | ExceptionResponse;
export type UpdateExpenseResponse = Expense | ExceptionResponse;
export type DeleteExpenseResponse = Expense | ExceptionResponse;
export type GetExpenseResponse = Expense | ExceptionResponse;
export type GetExpensesResponse = Expense[] | ExceptionResponse;
