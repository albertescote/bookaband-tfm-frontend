'use server';
import { Band } from '@/service/backend/band/domain/band';
import { UserBand } from '@/service/backend/band/domain/userBand';
import {
  HospitalityRider,
  PerformanceArea,
  TechnicalRider,
  WeeklyAvailability,
} from '../domain/bandProfile';
import authorizedAxiosInstance from '@/service/authorizedAixosInstance';
import {
  refreshAccessToken,
  withTokenRefreshRetry,
} from '@/service/backend/auth/service/auth.service';

export interface UpsertBandRequest {
  name: string;
  musicalStyleIds: string[];
  price: number;
  location: string;
  bandSize: string;
  eventTypeIds: string[];
  bio?: string;
  imageUrl?: string;
  visible?: boolean;
  weeklyAvailability?: WeeklyAvailability;
  hospitalityRider?: HospitalityRider;
  technicalRider?: TechnicalRider;
  performanceArea?: PerformanceArea;
  media?: { url: string; type: string }[];
  socialLinks?: { platform: string; url: string }[];
}

export async function getBandById(id: string): Promise<Band | undefined> {
  return withTokenRefreshRetry<Band>(() =>
    authorizedAxiosInstance.get(`/bands/${id}`).then((res) => res.data),
  );
}

export async function createBand(data: UpsertBandRequest): Promise<void> {
  try {
    await authorizedAxiosInstance.post('/bands', data);
  } catch (error: any) {
    if (error.response?.status === 401) {
      const accessToken = await refreshAccessToken();
      if (!accessToken) {
        throw new Error('Authentication failed');
      }
      await authorizedAxiosInstance.post('/bands', data);
    } else {
      throw error;
    }
  }
}

export async function updateBand(
  id: string,
  data: UpsertBandRequest,
): Promise<void> {
  return withTokenRefreshRetry<void>(() =>
    authorizedAxiosInstance.put(`/bands/${id}`, data).then((res) => res.data),
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
    authorizedAxiosInstance.post(`/bands/${id}/leave`),
  );
}
