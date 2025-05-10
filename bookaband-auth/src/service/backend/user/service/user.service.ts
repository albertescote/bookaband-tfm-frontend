'use server';

import { User } from '@/service/backend/user/domain/user';
import axiosInstance from '@/service/aixosInstance';

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
