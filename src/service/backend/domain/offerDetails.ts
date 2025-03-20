export interface OfferDetails {
  id: string;
  price: number;
  bandId: string;
  bandName: string;
  genre: string;
  bookingDates: string[];
  description?: string;
  imageUrl?: string;
}
