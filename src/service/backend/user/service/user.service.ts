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
  lng?: string;
}): Promise<User | undefined> {
  try {
    return await axiosInstance.post('/user', request).then((res) => res.data);
  } catch (e) {
    return undefined;
  }
}

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

export async function sendResetPasswordEmail(request: {
  email: string;
  lng: string;
}): Promise<void> {
  return await axiosInstance
    .post('/user/password/reset', request)
    .then((res) => res.data);
}

export async function resetPassword(
  token: string,
  password: string,
): Promise<void> {
  return await axiosInstance
    .put(
      '/user/password',
      { password: password },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    .then((res) => res.data);
}
