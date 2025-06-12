'use server';

import { BackendError } from '@/service/backend/shared/domain/backendError';
import authorizedAxiosInstance from '@/service/authorizedAixosInstance';

export async function getUserNotificationsWithBand(
  bandId?: string,
): Promise<Notification[] | BackendError> {
  return authorizedAxiosInstance
    .get(
      bandId ? `/notifications/user?bandId=${bandId}` : '/notifications/user',
    )
    .then((res) => res.data)
    .catch((error) => {
      return error.response.data;
    });
}
