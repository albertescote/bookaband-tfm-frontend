export enum BookingStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}

export interface Booking {
  id: string;
  offerId: string;
  userId: string;
  status: BookingStatus;
  date: Date;
  name: string;
  country: string;
  city: string;
  venue: string;
  postalCode: string;
  addressLine1: string;
  addressLine2?: string;
  eventTypeId?: string;
  isPublic?: boolean;
}
