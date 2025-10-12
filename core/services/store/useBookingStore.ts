import { create } from "zustand";
import { bookAppointment } from "@/core/appointments/actions/book-appointment.action";
import { Service } from "../interfaces";
import { Staff } from "@/core/staff/interfaces";
import { Appointment } from "@/core/appointments/interfaces";

export interface BookingState {
  service: Service | undefined;
  staff: Staff | undefined;
  utcDateTime: string | undefined;
  timeZone: string | undefined;
  comments: string | undefined;

  setService: (service: Service) => void;
  setBookingDetails: (
    service: Service,
    staff: Staff,
    utcDateTime: string,
    timeZone: string,
    comments?: string
  ) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bookNow: () => Promise<Appointment>;
}

export const useBookingStore = create<BookingState>()((set, get) => ({
  service: undefined,
  staff: undefined,
  utcDateTime: undefined,
  timeZone: undefined,
  comments: undefined,

  setService: async (service: Service) => {
    set({ service });
  },

  setBookingDetails: (
    service: Service,
    staff: Staff,
    utcDateTime: string,
    timeZone: string,
    comments?: string
  ) => {
    set({ service, staff, utcDateTime, timeZone, comments });
  },

  bookNow: async () => {
    const { service, staff, utcDateTime, timeZone, comments } = get();
    if (!service || !staff || !utcDateTime || !timeZone || !comments)
      throw new Error("Missing required fields");

    return await bookAppointment({
      serviceId: service.id,
      staffId: staff.id,
      utcDateTime,
      timeZone,
      comments,
    });
  },
}));
