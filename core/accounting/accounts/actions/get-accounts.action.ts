import { api } from "@/core/api/api";
import { GetAccountsResponse } from "../interfaces";

export const getAccounts = async (
  limit = 10,
  offset = 0
): Promise<GetAccountsResponse> => {
  try {
    const accounts = await api.get<GetAccountsResponse>(
      `account?limit=${limit}&offset=${offset}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return accounts;
  } catch (error) {
    throw error;
  }
};
