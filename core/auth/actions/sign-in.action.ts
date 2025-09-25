import { api } from "@/core/api/api";
import { AuthResponse } from "../interfaces/auth.response";
import { SignInRequest } from "../schemas/sign-in.schema";

export const signInAction = async (
  credentials: SignInRequest
): Promise<AuthResponse> => {
  try {
    const { data } = await api.post<AuthResponse>("/auth/signin", credentials);
    return data;
  } catch (error) {
    throw error;
  }
};
