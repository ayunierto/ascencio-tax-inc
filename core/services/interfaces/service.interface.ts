import { Staff } from "@/core/staff/interfaces";

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description?: string;
  address: string;
  isAvailableOnline: boolean;
  isActive: boolean;
  imageUrl?: string;
  createdAt: Date;
  updatedAt?: Date;
  staff?: Staff[];
}
