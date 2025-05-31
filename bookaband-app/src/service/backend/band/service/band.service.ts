'use server';
import { Band } from '@/service/backend/band/domain/band';
import { UserBand } from '@/service/backend/band/domain/userBand';
import { BandWithDetails } from '@/service/backend/band/domain/bandWithDetails';
import { BandProfile } from '../domain/bandProfile';
import authorizedAxiosInstance from '@/service/authorizedAixosInstance';
import { withTokenRefreshRetry } from '@/service/backend/auth/service/auth.service';

export async function getBands(): Promise<Band[] | undefined> {
  return withTokenRefreshRetry<Band[]>(() =>
    authorizedAxiosInstance.get('/bands'),
  );
}

export async function getBandById(id: string): Promise<Band | undefined> {
  return withTokenRefreshRetry<Band>(() =>
    authorizedAxiosInstance.get(`/bands/${id}`),
  );
}

export async function createBand(data: BandProfile): Promise<Band | undefined> {
  return withTokenRefreshRetry<Band>(() =>
    authorizedAxiosInstance.post('/bands', data),
  );
}

export async function updateBand(
  id: string,
  data: Partial<BandProfile>,
): Promise<Band | undefined> {
  return withTokenRefreshRetry<Band>(() =>
    authorizedAxiosInstance.put(`/bands/${id}`, data),
  );
}

export async function deleteBand(id: string): Promise<void> {
  return withTokenRefreshRetry<void>(() =>
    authorizedAxiosInstance.delete(`/bands/${id}`),
  );
}

export async function getBandDetailsById(
  id: string,
): Promise<BandWithDetails | undefined> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance.get(`/bands/${id}/details`).then((res) => res.data),
  );
}

export async function getBandViewById(id: string): Promise<Band | undefined> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance.get(`/bands/${id}/view`).then((res) => res.data),
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

export async function uploadBandImage(
  id: string,
  file: File,
): Promise<string | undefined> {
  const formData = new FormData();
  formData.append('image', file);

  return withTokenRefreshRetry<string>(() =>
    authorizedAxiosInstance.post(`/bands/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  );
}

export async function uploadBandDocument(
  id: string,
  file: File,
  type: string,
): Promise<string | undefined> {
  const formData = new FormData();
  formData.append('document', file);
  formData.append('type', type);

  return withTokenRefreshRetry<string>(() =>
    authorizedAxiosInstance.post(`/bands/${id}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  );
}

export async function uploadBandMultimedia(
  id: string,
  file: File,
  type: 'image' | 'video',
): Promise<string | undefined> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  return withTokenRefreshRetry<string>(() =>
    authorizedAxiosInstance.post(`/bands/${id}/multimedia`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  );
}
