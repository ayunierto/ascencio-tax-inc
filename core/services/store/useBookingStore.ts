import { create } from "zustand";
import { Service } from "../interfaces";
import { Staff } from "@/core/staff/interfaces";

export interface BookingState {
  // Data
  service?: Service;
  staff?: Staff;
  start?: string;
  end?: string;
  timeZone?: string;
  comments?: string;

  // Actions
  updateState: (fields: Partial<BookingState>) => void;
}

export const useBookingStore = create<BookingState>()((set) => ({
  service: undefined,
  staff: undefined,
  start: undefined,
  end: undefined,
  timeZone: undefined,
  comments: undefined,

  updateState: (fields: Partial<BookingState>) => {
    set((state) => ({
      ...state,
      ...fields,
    }));
  },
}));
