import { Bell } from 'lucide-react';
import { useTranslation } from '@/app/i18n';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface PageParams {
  params: {
    lng: string;
  };
  searchParams?: { [key: string]: string | undefined };
}

export default async function NotificationsPage({
  params: { lng },
  searchParams,
}: PageParams) {
  const { t } = await useTranslation(lng, 'notifications');

  const notifications: Notification[] = [
    {
      id: '1',
      title: 'New Album Release',
      message: 'Your favorite artist has released a new album!',
      timestamp: '2 hours ago',
      read: false,
    },
    {
      id: '2',
      title: 'Playlist Update',
      message: 'Your collaborative playlist has been updated',
      timestamp: '1 day ago',
      read: true,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <Bell className="h-8 w-8" />
          {t('title')}
        </h1>
        <p className="mt-2 text-gray-600">{t('description')}</p>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            {t('no-otifications')}
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-lg border p-4 ${
                notification.read ? 'bg-white' : 'border-blue-200 bg-blue-50'
              } transition-shadow hover:shadow-md`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    {notification.title}
                  </h3>
                  <p className="mt-1 text-gray-600">{notification.message}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {notification.timestamp}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
