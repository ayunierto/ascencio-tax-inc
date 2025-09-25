import { api } from "@/core/api/api";
import { ForgotPasswordResponse } from "../interfaces/forgot-password.response";
import { ForgotPasswordRequest } from "../schemas/forgot-password.schema";

export const forgotPasswordAction = async ({
  email,
}: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
  try {
    const { data } = await api.post<ForgotPasswordResponse>(
      "/auth/forgot-password",
      { email }
    );

    return data;
  } catch (error) {
    throw error;
  }
};
