import { api } from "@/core/api/api";
import { DeleteExpenseResponse } from "../interfaces";

export const removeExpense = async (
  id: string
): Promise<DeleteExpenseResponse> => {
  const { data } = await api.delete<DeleteExpenseResponse>(`/expenses/${id}`);
  return data;
};
