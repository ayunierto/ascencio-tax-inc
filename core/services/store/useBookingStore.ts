import { create } from "zustand";
import { bookAppointment } from "@/core/appointments/actions/book-appointment.action";
import { Service } from "../interfaces";
import { Staff } from "@/core/staff/interfaces";
import { Appointment } from "@/core/appointments/interfaces";

export interface BookingState {
  service: Service | undefined;
  staff: Staff | undefined;
  start: string | undefined;
  end: string | undefined;
  timeZone: string | undefined;
  comments: string | undefined;

  setService: (service: Service) => void;
  setBookingDetails: (
    service: Service,
    staff: Staff,
    start: string,
    end: string,
    timeZone: string,
    comments?: string
  ) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bookNow: () => Promise<Appointment>;
}

export const useBookingStore = create<BookingState>()((set, get) => ({
  service: undefined,
  staff: undefined,
  start: undefined,
  end: undefined,
  timeZone: undefined,
  comments: undefined,

  setService: async (service: Service) => {
    set({ service });
  },

  setBookingDetails: (
    service: Service,
    staff: Staff,
    start: string,
    end: string,
    timeZone: string,
    comments?: string
  ) => {
    set({ service, staff, start, end, timeZone, comments });
  },

  bookNow: async () => {
    const { service, staff, start, end, timeZone, comments } = get();
    if (!service || !staff || !start || !end || !timeZone || !comments)
      throw new Error("Missing required fields");

    return await bookAppointment({
      serviceId: service.id,
      staffId: staff.id,
      start,
      end,
      timeZone,
      comments,
    });
  },
}));
