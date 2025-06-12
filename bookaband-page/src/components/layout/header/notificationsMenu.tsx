'use client';

import { Bell, BellOff } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/providers/authProvider';
import {
  getUserNotifications,
  markNotificationAsRead,
} from '@/service/backend/notifications/service/notifications.service';
import { Notification } from '@/service/backend/notifications/domain/notification';
import { format } from 'date-fns';
import { ca, enUS, es } from 'date-fns/locale';
import { useRouter } from 'next/navigation';

export default function NotificationsMenu({ language }: { language: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation(language, 'notifications');
  const { user } = useAuth();
  const router = useRouter();

  const getLocale = () => {
    switch (language) {
      case 'es':
        return es;
      case 'ca':
        return ca;
      case 'en':
        return enUS;
      default:
        return undefined;
    }
  };

  const fetchNotifications = async () => {
    try {
      const receivedNotifications = await getUserNotifications();
      if (receivedNotifications && !('error' in receivedNotifications)) {
        setNotifications(receivedNotifications as Notification[]);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (user?.id) {
      fetchNotifications();

      interval = setInterval(() => {
        fetchNotifications();
      }, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [user?.id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markNotificationAsRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, isRead: true } : n,
        ),
      );
    }
    router.push(
      `/${language}/bookings/${notification.bookingMetadata.bookingId}`,
    );
    setMenuOpen(false);
  };

  const unreadNotifications = notifications.filter((notif) => !notif.isRead);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="relative flex items-center justify-center rounded-full text-[#565d6d] transition-colors duration-300 hover:text-[#15b7b9]"
      >
        <Bell size={24} />
        {unreadNotifications.length > 0 && (
          <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-[#15b7b9] ring-2 ring-white"></span>
        )}
      </button>

      {menuOpen && (
        <div
          className="absolute right-0 z-50 mt-6 w-96 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg ring-1 ring-black ring-opacity-5"
          style={{ maxHeight: '600px' }}
        >
          <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-[#15b7b9]/10 to-white px-4 py-3">
            <h3 className="text-sm font-semibold text-gray-900">
              {t('recent-notifications')}
            </h3>
            {unreadNotifications.length > 0 && (
              <span className="rounded-full bg-[#15b7b9] px-2 py-1 text-xs font-medium text-white">
                {unreadNotifications.length} {t('new')}
              </span>
            )}
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: '520px' }}>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center px-4 py-6 text-center">
                <p className="text-sm text-gray-500">{t('loading')}</p>
              </div>
            ) : notifications.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors duration-200 ${
                      !notification.isRead
                        ? 'bg-[#15b7b9]/5'
                        : 'hover:bg-[#15b7b9]/5'
                    }`}
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#15b7b9]/20 text-[#15b7b9]">
                      <Bell size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-gray-900">
                          {t(
                            `bookingNotification.${notification.bookingMetadata.status}`,
                            {
                              eventName: notification.bookingMetadata.eventName,
                              userName: notification.bookingMetadata.userName,
                              bandName: notification.bookingMetadata.bandName,
                            },
                          )}
                        </p>
                        {!notification.isRead && (
                          <span className="flex-shrink-0 rounded-full bg-[#15b7b9] px-2 py-0.5 text-xs text-white">
                            !
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {format(
                          new Date(notification.createdAt),
                          'MMM d, HH:mm',
                          {
                            locale: getLocale(),
                          },
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-4 py-6 text-center">
                <BellOff size={36} className="mb-2 text-gray-300" />
                <p className="text-sm text-gray-500">{t('no-notifications')}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
