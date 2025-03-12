import { User } from '@/core/auth/interfaces/user.interface';
import { Plan } from '../../plans/interfaces/plan.interface';

export interface Subscription {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  user: User;
  plan: Plan;
}
