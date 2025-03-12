import { User } from '@/core/auth/interfaces/user.interface';
import { DiscountOnPlan } from '../../discounts-on-plans/interfaces/discount-on-plan.interface';

export interface Plan {
  id: string;
  planIdStore: null;
  name: string;
  description: string;
  price: string;
  features: string[];
  createdAt: string;
  updatedAt: string | null;
  discounts: DiscountOnPlan[];
  user: User;
}
