import { create } from 'zustand';
import { ServiceResponse as Service } from '@/core/services/interfaces/services.response';
import * as SecureStore from 'expo-secure-store';
import { saveAppointment } from '@/core/appointments/actions/saveAppointment';

export interface BookingState {
  selectedService: Service | undefined;
  startDateAndTime: string | undefined;
  endDateAndTime: string | undefined;
  staffId: string | undefined;
  staffName: string | undefined;

  selectService: (service: Service) => void;
  saveDetails: (
    staffId: string,
    staffName: string,
    startDateAndTime: string,
    endDateAndTime: string
  ) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bookNow: () => Promise<any>;
}

export const useBookingStore = create<BookingState>()((set, get) => ({
  selectedService: undefined,
  startDateAndTime: undefined,
  endDateAndTime: undefined,
  staffId: undefined,
  staffName: undefined,

  selectService: async (selectedService: Service) => {
    set({ selectedService });
    await SecureStore.setItemAsync(
      'selectedService',
      JSON.stringify(selectedService)
    );
  },

  saveDetails: (
    staffId: string,
    staffName: string,
    startDateAndTime: string,
    endDateAndTime: string
  ) => {
    set({ staffId, staffName, startDateAndTime, endDateAndTime });
  },

  bookNow: async () => {
    const { endDateAndTime, selectedService, staffId, startDateAndTime } =
      get();
    if (endDateAndTime && selectedService && staffId && startDateAndTime) {
      const response = saveAppointment({
        startDateAndTime,
        endDateAndTime,
        service: selectedService.id,
        staff: staffId,
      });
      return response;
    }
    return null;
  },
}));
