export type ContractStatus = 'SIGNED' | 'PENDING' | 'CANCELED';

export interface Contract {
  id: string;
  bookingId: string;
  status: ContractStatus;
  fileUrl: string;
  userSigned: boolean;
  bandSigned: boolean;
  createdAt: Date;
  updatedAt: Date;
  eventName: string;
  bandName: string;
  userName: string;
  eventDate: Date;
}
