import { BookingStatus } from '@/service/backend/booking/domain/booking';

export interface MessageMetadata {
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
  metadata?: MessageMetadata;
  timestamp?: string | Date;
}
