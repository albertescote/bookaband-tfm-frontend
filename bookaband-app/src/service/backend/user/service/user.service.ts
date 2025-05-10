'use server';

import { User } from '@/service/backend/user/domain/user';
import authorizedAxiosInstance from '@/service/authorizedAixosInstance';
import { withTokenRefreshRetry } from '@/service/backend/auth/service/auth.service';

export async function getUserInfo(): Promise<User | null> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance.get(`/user`).then((res) => res.data),
  );
}
