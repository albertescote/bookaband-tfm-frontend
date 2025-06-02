'use server';
import { Band } from '@/service/backend/band/domain/band';
import { UserBand } from '@/service/backend/band/domain/userBand';
import {
  BandProfile,
  HospitalityRider,
  PerformanceArea,
  TechnicalRider,
  WeeklyAvailability,
} from '../domain/bandProfile';
import authorizedAxiosInstance from '@/service/authorizedAixosInstance';
import { withTokenRefreshRetry } from '@/service/backend/auth/service/auth.service';

export interface UpsertBandRequest {
  name: string;
  musicalStyleIds: string[];
  price: number;
  location: string;
  bandSize: string;
  eventTypeIds: string[];
  weeklyAvailability: WeeklyAvailability;
  hospitalityRider: HospitalityRider;
  technicalRider: TechnicalRider;
  performanceArea: PerformanceArea;
  media: { url: string; type: string }[];
  socialLinks: { platform: string; url: string }[];
  bio?: string;
  imageUrl?: string;
  visible?: boolean;
}

export async function getBandById(id: string): Promise<Band | undefined> {
  return withTokenRefreshRetry<Band>(() =>
    authorizedAxiosInstance.get(`/bands/${id}`).then((res) => res.data),
  );
}

export async function getBandProfileById(
  id: string,
): Promise<BandProfile | undefined> {
  return withTokenRefreshRetry<BandProfile>(() =>
    authorizedAxiosInstance.get(`/bands/${id}/profile`).then((res) => res.data),
  );
}

export async function createBand(data: UpsertBandRequest): Promise<void> {
  return withTokenRefreshRetry<void>(() =>
    authorizedAxiosInstance.post('/bands', data).then((res) => res.data),
  );
}

export async function updateBand(
  id: string,
  data: UpsertBandRequest,
): Promise<void> {
  console.log(data);
  return withTokenRefreshRetry<void>(() =>
    authorizedAxiosInstance
      .put(`/bands/${id}`, data)
      .then((res) => res.data)
      .catch((error) => {
        console.log(error.response.data);
        throw error;
      }),
  );
}

export async function deleteBand(id: string): Promise<void> {
  return withTokenRefreshRetry<void>(() =>
    authorizedAxiosInstance.delete(`/bands/${id}`).then((res) => res.data),
  );
}

export async function getUserBands(): Promise<UserBand[] | undefined> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance.get('/bands').then((res) => res.data),
  );
}

export async function removeMember(
  bandId: string,
  memberId: string,
): Promise<void> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance
      .delete(`/bands/${bandId}/members/${memberId}`)
      .then((res) => res.data),
  );
}

export async function leaveBand(id: string): Promise<void> {
  return withTokenRefreshRetry<void>(() =>
    authorizedAxiosInstance.post(`/bands/${id}/leave`).then((res) => res.data),
  );
}
