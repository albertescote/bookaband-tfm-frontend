export interface BandMember {
  artisticName: string;
  instrument: string;
  experience: string;
  profileLink?: string;
}

export interface TechnicalRider {
  soundSystem: string[];
  microphones: string[];
  backline: string[];
  lighting: string[];
  otherRequirements: string[];
}

export interface HospitalityRider {
  accommodation: string[];
  catering: string[];
  beverages: string[];
  specialRequirements: string[];
}

export interface PerformanceArea {
  regions: string[];
  travelPreferences: string[];
  restrictions: string[];
}

export interface AvailabilitySlot {
  startDate: Date;
  endDate: Date;
  isBooked: boolean;
}

export interface Rate {
  eventType: string;
  amount: number;
  currency: string;
  conditions: string;
}

export interface MultimediaContent {
  images: string[];
  videos: string[];
  spotifyLink?: string;
  youtubeLink?: string;
}

export interface SocialMedia {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  twitter?: string;
  website?: string;
}

export interface LegalDocument {
  type: 'CONTRACT' | 'INSURANCE' | 'TAX';
  fileUrl: string;
  fileName: string;
  uploadDate: Date;
}

export interface BandProfile {
  id: string;
  name: string;
  location: string;
  description: string;
  musicalStyles: string[];
  members: BandMember[];
  technicalRider: TechnicalRider;
  hospitalityRider: HospitalityRider;
  performanceArea: PerformanceArea;
  availability: AvailabilitySlot[];
  rates: Rate[];
  multimediaContent: MultimediaContent;
  socialMedia: SocialMedia;
  legalDocuments: LegalDocument[];
  createdAt: Date;
  updatedAt: Date;
} 