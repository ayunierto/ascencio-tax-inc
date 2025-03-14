export interface UpdateProfile {
  name: string;
  lastName: string;
  phoneNumber?: string;
  password: string | undefined;
}
