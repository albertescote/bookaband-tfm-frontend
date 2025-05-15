export interface PaymentMethod {
  id: string;
  type: string;
  lastFour: string;
  isDefault: boolean;
  createdAt: Date;
  brand?: string;
  alias?: string;
}
