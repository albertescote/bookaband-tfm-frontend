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
  multimediaFiles?: File[];
}

export interface SocialMedia {
  instagram?: string;
  facebook?: string;
  website?: string;
  twitter?: string;
  tiktok?: string;
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
  weeklyAvailability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  rates: Rate[];
  multimediaContent: MultimediaContent;
  socialMedia: SocialMedia;
  legalDocuments: LegalDocument[];
  createdAt: Date;
  updatedAt: Date;
}
