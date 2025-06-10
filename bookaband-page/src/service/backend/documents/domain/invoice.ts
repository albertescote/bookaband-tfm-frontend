export type InvoiceStatus = 'PAID' | 'PENDING' | 'FAILED';

export interface Invoice {
  id: string;
  contractId: string;
  amount: number;
  status: InvoiceStatus;
  fileUrl: string;
  createdAt: Date;
  updatedAt: Date;
}
