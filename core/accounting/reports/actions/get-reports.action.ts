import { api } from "@/core/api/api";
import { Report } from "../interfaces";

export const getReports = async (
  limit = 100,
  offset = 0
): Promise<Report[]> => {
  try {
    const { data } = await api.get<Report[]>(
      `reports?limit=${limit}&offset=${offset}`
    );

    return data;
  } catch (error) {
    throw error;
  }
};
