'use server';

import { User } from '@/service/backend/user/domain/user';
import authorizedAxiosInstance from '@/service/authorizedAixosInstance';
import { withTokenRefreshRetry } from '@/service/backend/auth/service/auth.service';

export async function getUserInfo(): Promise<User | null> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance.get(`/user`).then((res) => res.data),
  );
}

export const updateProfile = async (userData: Partial<User>): Promise<User> => {
  const response = await authorizedAxiosInstance.patch('/users/me', userData);
  return response.data;
};

export const uploadProfileImage = async (
  file: File,
): Promise<{ imageUrl: string }> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await authorizedAxiosInstance.post(
    '/users/me/image',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};
