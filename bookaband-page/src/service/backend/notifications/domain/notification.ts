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
  bookingMetadata: BookingMetadata;
}
