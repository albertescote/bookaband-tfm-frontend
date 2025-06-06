export type ContractStatus = 'SIGNED' | 'PENDING' | 'CANCELED';

export interface Contract {
  id: string;
  bandName: string;
  date: string;
  status: ContractStatus;
  bookingId: string;
}
