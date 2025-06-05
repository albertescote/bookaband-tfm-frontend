import { BookingStatus } from '@/service/backend/booking/domain/booking';

export interface BookingSummary {
  id: string;
  bandId: string;
  userId: string;
  status: BookingStatus;
  initDate: Date;
  endDate: Date;
  name: string;
  userName: string;
  bandName: string;
  userImageUrl?: string;
  bandImageUrl?: string;
  country: string;
  city: string;
  venue: string;
  postalCode: string;
  addressLine1: string;
  addressLine2?: string;
  eventTypeId?: string;
  isPublic?: boolean;
}
