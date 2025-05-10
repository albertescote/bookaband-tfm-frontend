'use server';
import { ContactMessage } from '@/service/backend/contact/domain/contactMessage';

export async function sendContactMessage(
  contactMessage: ContactMessage,
): Promise<void> {
  // return withTokenRefreshRetry(() =>
  //   authorizedAxiosInstance
  //     .get(`/notifications/client/${userId}`)
  //     .then((res) => res.data),
  // );
  // TODO: implement me
}
