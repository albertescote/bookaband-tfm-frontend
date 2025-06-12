'use server';
import { Notification } from '@/service/backend/notifications/domain/notification';
import { BackendError } from '@/service/backend/shared/domain/backendError';
import authorizedAxiosInstance from '@/service/authorizedAixosInstance';

export async function getUserNotifications(): Promise<
  Notification[] | BackendError
> {
  return authorizedAxiosInstance
    .get('/notifications/user')
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
