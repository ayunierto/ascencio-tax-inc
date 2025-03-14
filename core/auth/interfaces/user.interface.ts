export interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  birthdate?: string;
  isActive: boolean;
  lastLogin?: string;
  roles: string[];
  createdAt: string;
  updatedAt?: string;
}
