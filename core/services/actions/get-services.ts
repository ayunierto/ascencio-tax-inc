import { api } from "@/core/api/api";
import { GetServicesResponse } from "../interfaces";

export const getServices = async (): Promise<GetServicesResponse> => {
  try {
    const { data } = await api.get<GetServicesResponse>("/services");
    return data;
  } catch (error) {
    throw error;
  }
};
