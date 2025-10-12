import { api } from "@/core/api/api";
import { BookingDataApiRequest } from "@/core/booking/schemas/booking.schema";
import { Appointment } from "../interfaces";

export const bookAppointment = async (appointments: BookingDataApiRequest) => {
  const { data } = await api.post<Appointment>("/appointments", appointments);
  return data;
};
