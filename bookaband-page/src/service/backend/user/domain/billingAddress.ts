export interface BillingAddress {
  id: string;
  country: string;
  city: string;
  postalCode: string;
  addressLine1: string;
  addressLine2?: string;
}
