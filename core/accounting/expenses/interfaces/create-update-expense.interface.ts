export interface CreateUpdateExpense {
  accountId: string;
  categoryId: string;
  date: string;
  image?: string;
  merchant: string;
  notes?: string;
  subcategoryId?: string;
  tax: number;
  total: number;
  id?: string;
}
