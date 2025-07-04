import { BookingStatus } from '@/service/backend/booking/domain/booking';

export interface BookingMetadata {
  bookingId: string;
  bookingStatus?: BookingStatus;
  eventName?: string;
  eventDate?: Date;
  venue?: string;
  city?: string;
}

export interface MessagePrimitives {
  id: string;
  senderId: string;
  recipientId: string;
  message?: string;
  bookingMetadata?: BookingMetadata;
  fileUrl?: string;
  timestamp?: string | Date;
}
