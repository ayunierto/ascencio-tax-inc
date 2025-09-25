import { User } from "@/core/auth/interfaces";

export interface Post {
  id: number;
  url: string;
  title: string;
  createdAt: string;
  updatedAt?: string;
  user: User;
}
