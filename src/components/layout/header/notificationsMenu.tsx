'use client';
import { Bell } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/app/i18n/client';
import { useWebPageAuth } from '@/providers/webPageAuthProvider';
import { getClientNotifications } from '@/service/backend/notifications/service/chat.service';
import { Notification } from '@/service/backend/notifications/domain/notification';

export default function NotificationsMenu({ language }: { language: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation(language, 'notifications');
  const { user } = useWebPageAuth();

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
          className="animate-fade-in absolute right-0 z-50 mt-2 w-80 transform rounded-xl border border-[#15b7b9] bg-white shadow-2xl transition-all duration-300 ease-out"
          style={{ minWidth: '18rem' }}
        >
          <p className="px-4 py-3 text-sm font-semibold tracking-wide text-[#222]">
            {t('recent-notifications')}
          </p>
          <div className="divide-y divide-gray-200">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={`/${language}${notification.link}`}
                  onClick={() =>
                    handleNavigateToNotification(notification.unread)
                  }
                  className="flex items-center justify-between gap-2 rounded-md px-4 py-3 text-sm text-[#4a4f5a] transition-colors duration-200 hover:bg-[#15b7b9]/10 hover:text-[#15b7b9]"
                >
                  <div className="flex flex-grow flex-col overflow-hidden">
                    <span className="truncate font-semibold">
                      {notification.title}
                    </span>
                    <span className="max-w-[14rem] truncate text-xs text-gray-500">
                      {notification.description}
                    </span>
                  </div>
                  {notification.unread && (
                    <span className="flex-shrink-0 rounded-full bg-[#15b7b9] px-2 py-0.5 text-xs text-white">
                      !
                    </span>
                  )}
                </Link>
              ))
            ) : (
              <p className="px-4 py-3 text-sm text-gray-500">
                {t('no-notifications')}
              </p>
            )}
          </div>
          <div className="border-t border-gray-200">
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
