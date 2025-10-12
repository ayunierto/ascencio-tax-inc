import { User } from "@/core/auth/interfaces";
import { Service } from "@/core/services/interfaces";
import { Staff } from "@/core/staff/interfaces";

export interface Appointment {
  id: string;
  startDateAndTime: string;
  endDateAndTime: string;
  state: string;
  comments: string;
  calendarEventId: string;
  zoomMeetingId: string;
  zoomMeetingLink?: string;
  source?: string;
  cancellationReason?: string;
  service: Service;
  user: User;
  staff: Staff;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}
