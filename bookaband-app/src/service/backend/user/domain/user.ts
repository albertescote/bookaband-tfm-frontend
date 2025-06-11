export interface User {
  id: string;
  firstName: string;
  familyName: string;
  email: string;
  role: string;
  emailVerified: boolean;
  phoneNumber?: string;
  nationalId?: string;
  imageUrl?: string;
  bio?: string;
}
