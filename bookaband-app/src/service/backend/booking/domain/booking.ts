export enum BookingStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  SIGNED = 'SIGNED',
  PAID = 'PAID',
  DECLINED = 'DECLINED',
  CANCELED = 'CANCELED',
}

export interface Booking {
  id: string;
  bandId: string;
  userId: string;
  status: BookingStatus;
  initDate: Date;
  endDate: Date;
  cost: number;
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
