import { InvitationStatus } from '@/service/backend/invitation/domain/invitation';

interface InvitationMetadata {
  status: InvitationStatus;
  bandName?: string;
  userName?: string;
  createdAt?: Date;
}

interface BookingMetadata {
  bookingId: string;
  translationKey: string;
}

export interface Notification {
  id: string;
  bandId: string;
  userId: string;
  isRead: boolean;
  invitationMetadata?: InvitationMetadata;
  bookingMetadata?: BookingMetadata;
}
