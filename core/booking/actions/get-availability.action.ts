import { api } from "@/core/api/api";

export const getAvailabilityAction = async (
  staffId: string,
  date: string
): Promise<AvailabilityResponse[]> => {
  try {
    const { data } = await api.post("/appointments/availability", {
      staffId,
      date,
    });
    return data;
  } catch (error) {
    throw error;
  }
};
