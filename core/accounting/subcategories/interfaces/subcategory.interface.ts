import { Category } from '../../categories/interfaces';

export interface Subcategory {
  category: Category;
  createdAt: string;
  description?: string;
  id: string;
  isSystem: boolean;
  name: string;
  updateAt: null | string;
}
