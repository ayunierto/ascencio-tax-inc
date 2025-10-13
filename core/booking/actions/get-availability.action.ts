import { api } from "@/core/api/api";
import { AvailabilitySlot } from "../interfaces/availability.response";

interface AvailabilityRequest {
  serviceId: string;
  date: string;
  staffId?: string;
  timeZone: string; // IANA, ej. "America/Lima", "America/Toronto", etc.
}

export const getAvailabilityAction = async (
  data: AvailabilityRequest
): Promise<AvailabilitySlot[]> => {
  return (await api.post("/availability", data)).data;
};
