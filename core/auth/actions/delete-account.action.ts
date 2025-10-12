import { api } from "@/core/api/api";
import { DeleteAccountResponse } from "../interfaces/delete-account.response";
import { DeleteAccountRequest } from "../schemas/delete-account.schema";

export const deleteAccountAction = async ({
  password,
}: DeleteAccountRequest): Promise<DeleteAccountResponse> => {
  const { data } = await api.post<DeleteAccountResponse>(
    "/auth/delete-account",
    { password }
  );

  return data;
};
