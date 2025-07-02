import { BasicUser } from '@/core/auth/interfaces';
import { Account } from '../../accounts/interfaces';
import { Category } from '../../categories/interfaces';
import { Subcategory } from '../../subcategories/interfaces';

export interface Expense {
  id: string;
  merchant: string;
  date: string;
  total: number;
  tax: number;
  image?: string;
  notes?: string;
  account: Account;
  category: Category;
  subcategory?: Subcategory;
  user: BasicUser;
  updateAt?: string;
  createdAt: string;
}
