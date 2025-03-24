'use server';
import { User } from '@/service/backend/user/domain/user';
import { getAccessTokenCookie } from '@/service/utils';
import { decodeJwt } from 'jose';
import axiosInstance from '@/service/aixosInstance';
import authorizedAxiosInstance from '@/service/authorizedAixosInstance';
import { withTokenRefreshRetry } from '@/service/backend/auth/service/auth.service';

export async function createUser(request: {
  firstName?: string;
  familyName?: string;
  email?: string;
  password?: string;
  role?: string;
}): Promise<void> {
  try {
    await axiosInstance.post('/user', request);
  } catch (e) {
    return undefined;
  }
}

export async function getUserInfo(): Promise<User | undefined> {
  let accessToken = getAccessTokenCookie();
  if (!accessToken) {
    console.log('Get user info failed: access token cookie not found');
    return undefined;
  }
  const decodedJwt = decodeJwt(accessToken);
  const userId = decodedJwt.sub;
  if (!userId) {
    console.log('Invalid access token: missing sub property');
    return undefined;
  }
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance.get(`/user/${userId}`).then((res) => res.data),
  );
}
