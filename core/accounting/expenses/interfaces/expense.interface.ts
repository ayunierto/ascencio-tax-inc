import { User } from '@/core/auth/interfaces/user.interface';
import { Account } from '../../accounts/interfaces';
import { Category } from '../../categories/interfaces';
import { Subcategory } from '../../subcategories/interfaces';

export interface Expense {
  account: Account;
  category: Category;
  createdAt: Date;
  date: string;
  id: string;
  image: null;
  merchant: string;
  notes: string;
  subcategory: Subcategory | null;
  tax: number;
  total: number;
  updateAt: null;
  user: User;
}
