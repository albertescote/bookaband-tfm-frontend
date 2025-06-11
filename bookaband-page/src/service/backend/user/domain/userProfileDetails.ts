import { PaymentMethod } from '@/service/backend/user/domain/paymentMethod';
import { BillingAddress } from '@/service/backend/user/domain/billingAddress';

interface ActivitySummary {
  musiciansContacted: number;
  eventsOrganized: number;
}

export interface UserProfileDetails {
  id: string;
  firstName: string;
  familyName: string;
  role: string;
  email: string;
  joinedDate: Date;
  phoneNumber?: string;
  nationalId?: string;
  imageUrl?: string;
  bio?: string;

  paymentMethods: PaymentMethod[];
  activitySummary: ActivitySummary;
  billingAddress?: BillingAddress;
}
