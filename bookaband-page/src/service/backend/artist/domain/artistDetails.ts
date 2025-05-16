import { BandSize } from '@/service/backend/artist/domain/bandSize';

export interface ArtistReview {
  id: string;
  rating: number;
  comment: string;
  reviewer: {
    name: string;
    imageUrl?: string;
  };
  date: string; // ISO format
}

interface Event {
  id: string;
  name: string;
  date: string;
  eventTypeId: string;
  city?: string;
  country?: string;
  venue?: string;
  isPublic?: boolean;
}

interface Media {
  id: string;
  url: string;
  type: 'image' | 'video';
}

interface SocialLinks {
  platform: string;
  url: string;
}

export interface ArtistDetails {
  id: string;
  bandId: string;
  bandName: string;
  genre: string;
  bookingDates: string[];
  description: string;
  location: string;
  featured: boolean;
  bandSize: BandSize;
  equipment: string[];
  eventTypeIds: string[];
  reviewCount: number;
  createdDate: string;
  price?: number;
  imageUrl?: string;
  rating?: number;

  bio?: string;
  followers?: number;
  following?: number;

  reviews?: ArtistReview[];

  media?: Media[];

  events?: Event[];

  socialLinks?: SocialLinks[];
}
