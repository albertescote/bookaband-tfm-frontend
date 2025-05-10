'use server';

import { User } from '@/service/backend/user/domain/user';
import { getAccessTokenCookie } from '@/service/utils';
import { decodeJwt } from 'jose';
import authorizedAxiosInstance from '@/service/authorizedAixosInstance';
import { withTokenRefreshRetry } from '@/service/backend/auth/service/auth.service';

export async function getUserInfo(): Promise<User | null> {
  let accessToken = getAccessTokenCookie();
  if (!accessToken) {
    console.log('Get user info failed: access token cookie not found');
    return null;
  }
  const decodedJwt = decodeJwt(accessToken);
  const userId = decodedJwt.sub;
  if (!userId) {
    console.log('Invalid access token: missing sub property');
    return null;
  }
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance.get(`/user/${userId}`).then((res) => res.data),
  );
}
