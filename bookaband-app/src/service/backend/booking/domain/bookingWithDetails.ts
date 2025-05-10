import { BookingStatus } from '@/service/backend/booking/domain/booking';

export interface BookingWithDetails {
  id: string;
  offerId: string;
  userId: string;
  status: BookingStatus;
  date: Date;
  userName: string;
  bandName: string;
  userImageUrl?: string;
  bandImageUrl?: string;
}
