import { BandSize } from '@/service/backend/artist/domain/bandSize';

export interface WeeklyAvailability {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

export interface HospitalityRider {
  accommodation: string;
  catering: string;
  beverages: string;
  specialRequirements: string;
}

export interface TechnicalRider {
  soundSystem: string;
  microphones: string;
  backline: string;
  lighting: string;
  otherRequirements: string;
}

export interface PerformanceArea {
  regions: string[];
  gasPriceCalculation?: {
    fuelConsumption: number;
    useDynamicPricing: boolean;
    pricePerLiter?: number;
  };
  otherComments?: string;
}

export interface BandCatalogItem {
  id: string;
  name: string;
  musicalStyleIds: string[];
  bookingDates: string[];
  location: string;
  featured: boolean;
  bandSize: BandSize;
  eventTypeIds: string[];
  reviewCount: number;
  weeklyAvailability: WeeklyAvailability;
  hospitalityRider: HospitalityRider;
  technicalRider: TechnicalRider;
  performanceArea: PerformanceArea;
  bio?: string;
  price?: number;
  imageUrl?: string;
  rating?: number;
}
