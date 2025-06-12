import { InvitationStatus } from '@/service/backend/invitation/domain/invitation';

interface InvitationMetadata {
  status: InvitationStatus;
  bandName?: string;
  userName?: string;
  createdAt?: Date;
}

interface BookingMetadata {
  bookingId: string;
  status: string;
  eventName: string;
  userName: string;
  bandName: string;
}

export interface Notification {
  id: string;
  bandId: string;
  userId: string;
  isRead: boolean;
  createdAt: Date;
  invitationMetadata?: InvitationMetadata;
  bookingMetadata?: BookingMetadata;
}
