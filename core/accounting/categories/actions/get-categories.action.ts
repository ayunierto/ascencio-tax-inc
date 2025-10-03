import { api } from "@/core/api/api";
import { Category } from "../interfaces";

export const getCategories = async (): Promise<Category[]> => {
  try {
    const { data } = await api.get<Category[]>("/categories");
    return data;
  } catch (error) {
    throw error;
  }
};
