import { create } from 'zustand';
import { Plan } from '../interfaces/plan.interface';

export interface PlanState {
  selectedPlan?: Plan;
  highestDiscount: number;
  subtotal: number;
  months: number;

  setSelectedPlan: (plan: Plan) => void;
  resetSelectedPlan: () => void;
  getSelectedPlan: () => Plan | undefined;
  isPlanSelected: () => boolean;
  setHighestDiscount: (discount: number) => void;
  setSubtotal: (subtotal: number) => void;
  setMonths: (months: number) => void;
}

export const usePlanStore = create<PlanState>()((set, get) => ({
  selectedPlan: undefined,
  highestDiscount: 0,
  subtotal: 0,
  months: 1,

  setSelectedPlan: (plan: Plan) => set({ selectedPlan: plan }),
  resetSelectedPlan: () => set({ selectedPlan: undefined }),
  getSelectedPlan: () => get().selectedPlan,
  isPlanSelected: () => !!get().selectedPlan,
  setHighestDiscount: (discount: number) => set({ highestDiscount: discount }),
  setSubtotal: (subtotal: number) => set({ subtotal }),
  setMonths: (months: number) => set({ months }),
}));
