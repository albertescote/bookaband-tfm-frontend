import { BandSize } from '@/service/backend/artist/domain/bandSize';
import {
  HospitalityRider,
  PerformanceArea,
  TechnicalRider,
  WeeklyAvailability,
} from '@/service/backend/artist/domain/bandCatalogItem';

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
}

interface Media {
  id: string;
  url: string;
  type: MediaType;
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

export interface Event {
  id: string;
  name: string;
  date: string;
  eventTypeId: string;
  city?: string;
  country?: string;
  venue?: string;
  isPublic?: boolean;
}

interface SocialLinks {
  id: string;
  platform: string;
  url: string;
}

export interface ArtistDetails {
  id: string;
  name: string;
  musicalStyleIds: string[];
  bookingDates: string[];
  location: string;
  featured: boolean;
  bandSize: BandSize;
  eventTypeIds: string[];
  reviewCount: number;
  createdDate: Date;
  weeklyAvailability: WeeklyAvailability;
  hospitalityRider: HospitalityRider;
  technicalRider: TechnicalRider;
  performanceArea: PerformanceArea;
  media: Media[];
  socialLinks: SocialLinks[];
  followers: number;
  following: number;
  reviews: ArtistReview[];
  events: Event[];
  price?: number;
  imageUrl?: string;
  rating?: number;
  bio?: string;
}
