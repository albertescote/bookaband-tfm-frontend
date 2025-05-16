import { BandSize } from '@/service/backend/artist/domain/bandSize';

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

export interface ArtistReview {
  id: string;
  rating: number;
  comment: string;
  reviewer: {
    name: string;
    imageUrl?: string;
  };
  date: string;
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
  type: MediaType;
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
  membersId: string[];
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
