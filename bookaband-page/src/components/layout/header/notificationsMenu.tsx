'use client';

import { Bell, BellOff } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/providers/authProvider';
import { getClientNotifications } from '@/service/backend/notifications/service/notifications.service';
import { Notification } from '@/service/backend/notifications/domain/notification';

export default function NotificationsMenu({ language }: { language: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation(language, 'notifications');
  const { user } = useAuth();

  const getNotificationsAndUpdateUnread = (userId: string) => {
    getClientNotifications(userId).then((receivedNotifications) => {
      if (receivedNotifications) {
        setNotifications(receivedNotifications);
        const totalUnread = receivedNotifications.filter(
          (notification) => notification.unread,
        ).length;
        setUnreadNotifications(totalUnread);
      }
    });
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (user?.id) {
      getNotificationsAndUpdateUnread(user.id);

      interval = setInterval(() => {
        getNotificationsAndUpdateUnread(user.id);
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

  const handleNavigateToNotification = (isUnread: boolean) => {
    if (isUnread) {
      setUnreadNotifications(unreadNotifications - 1);
    }
    setMenuOpen(false);
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="relative flex items-center justify-center rounded-full text-[#565d6d] transition-colors duration-300 hover:text-[#15b7b9]"
      >
        <Bell size={24} />
        {unreadNotifications > 0 && (
          <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-[#15b7b9] ring-2 ring-white"></span>
        )}
      </button>

      {menuOpen && (
        <div
          className="absolute right-0 z-50 mt-6 w-80 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg ring-1 ring-black ring-opacity-5"
          style={{ maxHeight: '500px' }}
        >
          <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-[#15b7b9]/10 to-white px-4 py-3">
            <h3 className="text-sm font-semibold text-gray-900">
              {t('recent-notifications')}
            </h3>
            {unreadNotifications > 0 && (
              <span className="rounded-full bg-[#15b7b9] px-2 py-1 text-xs font-medium text-white">
                {unreadNotifications} {t('new')}
              </span>
            )}
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: '320px' }}>
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <Link
                    key={notification.id}
                    href={`/${language}${notification.link}`}
                    onClick={() =>
                      handleNavigateToNotification(notification.unread)
                    }
                    className="flex items-center gap-3 px-4 py-3 transition-colors duration-200 hover:bg-[#15b7b9]/5"
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#15b7b9]/20 text-[#15b7b9]">
                      <Bell size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="truncate text-sm font-medium text-gray-900">
                          {notification.title}
                        </span>
                        {notification.unread && (
                          <span className="flex-shrink-0 rounded-full bg-[#15b7b9] px-2 py-0.5 text-xs text-white">
                            !
                          </span>
                        )}
                      </div>
                      <p className="truncate text-xs text-gray-500">
                        {notification.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-4 py-6 text-center">
                <BellOff size={36} className="mb-2 text-gray-300" />
                <p className="text-sm text-gray-500">{t('no-notifications')}</p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-100">
            <Link
              href={`/${language}/notifications`}
              onClick={() => setMenuOpen(false)}
              className="block w-full px-4 py-3 text-center text-sm font-semibold text-[#15b7b9] transition-colors duration-200 hover:bg-[#15b7b9]/10"
            >
              {t('view-all-notifications')}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
