import { User } from './user.interface';

export interface UserTokenResponse {
  user: User;
  token: string;
}
