import { ServiceResponse } from '@/core/services/interfaces/services.response';

export interface AppointmentResponse {
  calendarEventId: string;
  comments: string;
  createdAt: Date;
  endDateAndTime: string;
  id: string;
  service: ServiceResponse;
  staff: Staff;
  startDateAndTime: string;
  state: string;
  zoomMeetingId: string;
  zoomMeetingLink: string;
}

export interface Image {
  id: number;
  url: string;
}

export interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  birthdate: Date;
  isActive: boolean;
  registrationDate: Date;
  lastLogin: null;
  roles: string[];
  verificationCode: null;
}

export interface Staff {
  id: string;
  name: string;
  lastName: string;
  isActive: boolean;
}
