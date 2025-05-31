'use server';
import { Band } from '@/service/backend/band/domain/band';
import { UserBand } from '@/service/backend/band/domain/userBand';
import authorizedAxiosInstance from '@/service/authorizedAixosInstance';
import { withTokenRefreshRetry } from '@/service/backend/auth/service/auth.service';

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
