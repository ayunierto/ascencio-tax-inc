import { Staff } from "@/core/staff/interfaces";

export interface AvailabilitySlot {
  start: string;
  end: string;
  staff: Staff[];
}
