import { api } from "@/core/api/api";
import { GetExpensesResponse } from "../interfaces";

export const getExpenses = async (
  limit = 20,
  offset = 0
): Promise<GetExpensesResponse> => {
  try {
    const res = await api.get<GetExpensesResponse>(
      `expense?limit=${limit}&offset=${offset}`
    );
    return res;
  } catch (error) {
    throw error;
  }
};
