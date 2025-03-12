export interface RegisterData {
  name: string;
  lastName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  password: string;
  verificationPlatform: 'email' | 'whatsapp' | 'sms';
}
