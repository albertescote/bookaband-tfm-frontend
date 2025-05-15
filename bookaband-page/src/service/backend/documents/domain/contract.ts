export type ContractStatus = 'SIGNED' | 'PENDING' | 'CANCELLED';

export interface Contract {
  id: string;
  bandName: string;
  date: string;
  status: ContractStatus;
  bookingId: string;
}
