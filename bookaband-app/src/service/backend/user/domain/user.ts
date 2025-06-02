export interface User {
  id: string;
  firstName: string;
  familyName: string;
  email: string;
  role: string;
  emailVerified: boolean;
  bands?: string[];
  imageUrl?: string;
  bio?: string;
}
