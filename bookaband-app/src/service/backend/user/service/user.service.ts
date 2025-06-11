'use server';

import { User } from '@/service/backend/user/domain/user';
import authorizedAxiosInstance from '@/service/authorizedAixosInstance';
import { withTokenRefreshRetry } from '@/service/backend/auth/service/auth.service';

interface UpdateUserRequest {
  firstName: string;
  familyName: string;
  bio?: string;
  imageUrl?: string;
  phoneNumber?: string;
  nationalId?: string;
}

export async function getUserInfo(): Promise<User | null> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance.get(`/user`).then((res) => res.data),
  );
}

export const updateProfile = async (
  userData: UpdateUserRequest,
): Promise<User> => {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance.put(`/user`, userData).then((res) => res.data),
  );
};
