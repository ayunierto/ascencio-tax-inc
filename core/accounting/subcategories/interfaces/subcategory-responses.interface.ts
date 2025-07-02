import { ExceptionResponse } from '@/core/interfaces';
import { Subcategory } from './subcategory.interface';

export type GetSubcategoryResponse = Subcategory | ExceptionResponse;
export type GetSubcategoriesResponse = Subcategory[] | ExceptionResponse;
export type CreateSubcategoryResponse = Subcategory | ExceptionResponse;
export type UpdateSubcategoryResponse = Subcategory | ExceptionResponse;
export type DeleteSubcategoryResponse = Subcategory | ExceptionResponse;
