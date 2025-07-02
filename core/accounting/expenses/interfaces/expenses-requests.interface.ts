import { ImagePickerAsset } from 'expo-image-picker';

export interface CreateExpenseRequest {
  merchant: string;
  date: string;
  total: number;
  tax: number;
  image?: ImagePickerAsset | string; // Can be an ImagePickerAsset or a string URL
  accountId: string;
  categoryId: string;
  subcategoryId?: string;
  notes?: string;
}

export interface GetExpensesRequest {
  limit?: number;
  offset?: number;
}

export interface GetExpenseRequest {
  id: string;
}

export interface UpdateExpenseRequest extends Partial<CreateExpenseRequest> {
  id: string;
}
export interface DeleteExpenseRequest {
  id: string;
}

export interface AnalyzeExpenseRequest {
  base64Image: string;
}
