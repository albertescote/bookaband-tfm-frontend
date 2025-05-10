'use server';
import { Band } from '@/service/backend/band/domain/band';
import { UserBand } from '@/service/backend/band/domain/userBand';
import { BandWithDetails } from '@/service/backend/band/domain/bandWithDetails';
import authorizedAxiosInstance from '@/service/authorizedAixosInstance';
import { withTokenRefreshRetry } from '@/service/backend/auth/service/auth.service';

export async function createBand(request: {
  name?: string;
  genre?: string;
}): Promise<Band | undefined> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance.post('/bands', request).then((res) => res.data),
  );
}

export async function joinBand(
  bandId: string,
  userEmail: string,
): Promise<void> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance
      .post('/invitations/send', {
        bandId,
        userEmail,
      })
      .then((res) => res.data),
  );
}

export async function deleteBand(id: string): Promise<void> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance.delete(`/bands/${id}`).then((res) => res.data),
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
