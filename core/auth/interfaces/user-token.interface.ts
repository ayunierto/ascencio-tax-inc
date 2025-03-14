import { User } from './user.interface';

export interface UserToken {
  user: User;
  token: string;
}
