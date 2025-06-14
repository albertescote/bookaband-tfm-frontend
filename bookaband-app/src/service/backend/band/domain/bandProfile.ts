import { BandSize } from './bandSize';
import { BandRole } from '@/service/backend/band/domain/bandRole';
import { BookingStatus } from '@/service/backend/booking/domain/booking';

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
  status?: BookingStatus;
  city?: string;
  country?: string;
  venue?: string;
  isPublic?: boolean;
}

export interface Media {
  id: string;
  url: string;
  type: string;
}

export interface SocialLinks {
  id: string;
  platform: string;
  url: string;
}

export interface HospitalityRider {
  accommodation: string;
  catering: string;
  beverages: string;
  specialRequirements?: string;
}

export interface TechnicalRider {
  soundSystem: string;
  microphones: string;
  backline: string;
  lighting: string;
  otherRequirements?: string;
}

export interface PerformanceArea {
  regions: { id: string; name: string }[] | string[];
  gasPriceCalculation?: {
    fuelConsumption: number;
    useDynamicPricing: boolean;
    pricePerLiter?: number;
  };
  otherComments?: string;
}

export interface WeeklyAvailability {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

export interface BandProfile {
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
  hospitalityRider?: HospitalityRider;
  technicalRider?: TechnicalRider;
  performanceArea: PerformanceArea;
  media: Media[];
  socialLinks: SocialLinks[];
  members?: { id: string; role: BandRole; name: string; imageUrl?: string }[];
  price?: number;
  imageUrl?: string;
  rating?: number;
  bio?: string;
  followers?: number;
  following?: number;
  reviews?: ArtistReview[];
  events?: Event[];
}
