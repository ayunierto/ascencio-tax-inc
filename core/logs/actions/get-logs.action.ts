import { api } from "@/core/api/api";
import { Log } from "../interfaces";

export const getLogs = async (limit = 6, offset = 0): Promise<Log[]> => {
  try {
    const { data } = await api.get<Log[]>(
      `logs?limit=${limit}&offset=${offset}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};
