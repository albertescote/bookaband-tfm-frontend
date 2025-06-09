export interface BookingInvoice {
  id: string;
  contractId: string;
  amount: number;
  status: string;
  fileUrl: string;
  createdAt: Date;
  updatedAt: Date;
}
