import { api } from "@/core/api/api";
import { AvailabilitySlot } from "../interfaces/availability.response";

export const getAvailabilityAction = async (
  staffId: string,
  date: string
): Promise<AvailabilitySlot[]> => {
  const { data } = await api.post("/appointments/availability", {
    staffId,
    date,
  });
  return data;
};
