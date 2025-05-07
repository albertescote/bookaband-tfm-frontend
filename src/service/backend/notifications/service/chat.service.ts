'use server';
import { Notification } from '@/service/backend/notifications/domain/notification';

export async function getClientNotifications(
  userId: string,
): Promise<Notification[] | undefined> {
  // return withTokenRefreshRetry(() =>
  //   authorizedAxiosInstance
  //     .get(`/notifications/client/${userId}`)
  //     .then((res) => res.data),
  // );
  // TODO: implement me
  return [
    {
      id: '1',
      title: 'Nova reserva confirmada',
      description: 'La reserva per al 15 de juny ha estat confirmada.',
      link: '/bookings',
      unread: true,
    },
    {
      id: '2',
      title: 'Missatge rebut',
      description: 'Tens un nou missatge de Marta G.',
      link: '/chat',
      unread: false,
    },
    {
      id: '3',
      title: 'Contracte aprovat',
      description: 'El contracte per al 20 de juliol ha estat aprovat.',
      link: '/bookings',
      unread: true,
    },
  ];
}
