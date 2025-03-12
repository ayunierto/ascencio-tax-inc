export interface ServiceResponse {
  id: string;
  name: string;
  duration: number;
  price: string;
  description: null;
  isAvailableOnline: boolean;
  isActive: boolean;
  images: Image[];
  staff: Staff[];
  user: User;
  address: string;
}

export interface Image {
  id: number;
  url: string;
}

export interface Staff {
  id: string;
  name: string;
  lastName: string;
  isActive: boolean;
}

export interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  birthdate: Date;
  isActive: boolean;
  registrationDate: Date;
  lastLogin: null;
  roles: string[];
  verificationCode: string | null;
}
