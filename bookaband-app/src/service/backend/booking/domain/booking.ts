export enum BookingStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  CANCELED = 'CANCELED',
}

export interface Booking {
  id: string;
  offerId: string;
  userId: string;
  status: BookingStatus;
  date: Date;
}
