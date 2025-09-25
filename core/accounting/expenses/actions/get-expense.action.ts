import { api } from "@/core/api/api";
import { GetExpenseRequest, GetExpenseResponse } from "../interfaces";

export const getExpense = async ({
  id,
}: GetExpenseRequest): Promise<GetExpenseResponse> => {
  try {
    const { data } = await api.get<GetExpenseResponse>(`/expense/${id}`);

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
