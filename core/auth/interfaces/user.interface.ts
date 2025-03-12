export interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  birthdate: string | null;
  isActive: boolean;
  lastLogin: string | null;
  roles: string[];
  createdAt: string;
  updatedAt: string | null;
}
