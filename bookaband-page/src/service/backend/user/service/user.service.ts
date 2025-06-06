'use server';

import { User } from '@/service/backend/user/domain/user';
import authorizedAxiosInstance from '@/service/authorizedAixosInstance';
import { withTokenRefreshRetry } from '@/service/backend/auth/service/auth.service';
import { UserProfileDetails } from '@/service/backend/user/domain/userProfileDetails';
import { BackendError } from '@/service/backend/shared/domain/backendError';

export async function getUserInfo(): Promise<User | null> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance.get(`/user`).then((res) => res.data),
  );
}

export async function getUserProfileDetails(): Promise<
  UserProfileDetails | BackendError
> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance.get(`/user/profile`).then((res) => res.data),
  ).catch((error) => {
    return error.response.data as BackendError;
  });
}

export async function updateContactInfo(
  firstName: string,
  familyName: string,
  bio: string,
  imageUrl?: string,
): Promise<UserProfileDetails | BackendError> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance
      .put(`/user`, { firstName, familyName, bio, imageUrl })
      .then((res) => res.data),
  ).catch((error) => {
    return error.response.data as BackendError;
  });
}
