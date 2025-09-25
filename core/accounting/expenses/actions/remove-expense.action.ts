import { api } from "@/core/api/api";
import { DeleteExpenseRequest, DeleteExpenseResponse } from "../interfaces";

export const removeExpense = async ({
  id,
}: DeleteExpenseRequest): Promise<DeleteExpenseResponse> => {
  try {
    const { data } = await api.delete<DeleteExpenseResponse>(`expense/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};
