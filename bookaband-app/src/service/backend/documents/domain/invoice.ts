export type InvoiceStatus = 'PAID' | 'PENDING' | 'FAILED';

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: InvoiceStatus;
  contractId: string;
}
