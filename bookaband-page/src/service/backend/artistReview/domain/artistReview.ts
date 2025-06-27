export interface ArtistReview {
  id: string;
  userId: string;
  bandId: string;
  bookingId: string;
  rating: number;
  comment: string;
  date: Date;
}
