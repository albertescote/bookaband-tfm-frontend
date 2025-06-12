'use server';

import { BackendError } from '@/service/backend/shared/domain/backendError';
import authorizedAxiosInstance from '@/service/authorizedAixosInstance';
import { Notification } from '@/service/backend/notification/domain/notification';

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

export async function markNotificationAsRead(
  notificationId: string,
): Promise<void | BackendError> {
  return authorizedAxiosInstance
    .put(`/notifications/${notificationId}/read`)
    .then((res) => res.data)
    .catch((error) => {
      return error.response.data;
    });
}
