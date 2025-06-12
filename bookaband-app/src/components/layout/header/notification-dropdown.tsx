'use client';

import { Fragment, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Bell } from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';
import { useParams, useRouter } from 'next/navigation';
import {
  getUserNotificationsWithBand,
  markNotificationAsRead,
} from '@/service/backend/notification/service/notification.service';
import { Notification } from '@/service/backend/notification/domain/notification';
import { format } from 'date-fns';
import { ca, enUS, es } from 'date-fns/locale';
import { useAuth } from '@/providers/authProvider';

export function NotificationDropdown() {
  const params = useParams();
  const language = params.lng as string;
  const { t } = useTranslation(language, 'bands');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user, selectedBand } = useAuth();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const bandNotifications = await getUserNotificationsWithBand(
        selectedBand?.id,
      );
      console.log(bandNotifications);
      if (bandNotifications && !('error' in bandNotifications)) {
        setNotifications(bandNotifications as unknown as Notification[]);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationClick = async (
    notification: Notification,
    close: () => void,
  ) => {
    if (notification.invitationMetadata) {
      if (!notification.isRead) {
        await markNotificationAsRead(notification.id);
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, isRead: true } : n,
          ),
        );
      }

      if (notification.invitationMetadata.status === 'ACCEPTED') {
        router.push(`/${language}/bands/${notification.bandId}`);
      } else {
        router.push(`/${language}/bands`);
      }
      close();
    }
  };

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

  const unreadNotifications = notifications.filter((notif) => !notif.isRead);

  return (
    <Menu as="div" className="relative">
      {({ close }) => (
        <>
          <Menu.Button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100">
            <Bell size={20} />
            {unreadNotifications.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {unreadNotifications.length}
              </span>
            )}
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="p-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h3 className="text-base font-semibold text-gray-900">
                    {t('notifications')}
                  </h3>
                  {unreadNotifications.length > 0 && (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                      {unreadNotifications.length} {t('new')}
                    </span>
                  )}
                </div>
                {isLoading ? (
                  <div className="py-4 text-center text-sm text-gray-500">
                    {t('common:loading')}
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="py-4 text-center text-sm text-gray-500">
                    {t('noNotifications')}
                  </div>
                ) : (
                  <div className="mt-2 max-h-[400px] space-y-1 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() =>
                          handleNotificationClick(notification, close)
                        }
                        className={`cursor-pointer rounded-lg p-2.5 transition-colors ${
                          !notification.isRead
                            ? 'bg-blue-50 hover:bg-blue-100'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        {notification.invitationMetadata && (
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                {notification.invitationMetadata.status ===
                                'PENDING' ? (
                                  <>
                                    <p className="text-sm font-medium text-gray-900">
                                      {notification.userId === user?.id
                                        ? t('invitationReceivedFrom', {
                                            bandName:
                                              notification.invitationMetadata
                                                .bandName,
                                          })
                                        : t('invitationSentTo', {
                                            userName:
                                              notification.invitationMetadata
                                                .userName,
                                          })}
                                    </p>
                                  </>
                                ) : (
                                  <p className="text-sm font-medium text-gray-900">
                                    {notification.invitationMetadata.status ===
                                    'ACCEPTED'
                                      ? notification.userId === user?.id
                                        ? t('youAcceptedInvitation', {
                                            bandName:
                                              notification.invitationMetadata
                                                .bandName,
                                          })
                                        : t('invitationAcceptedBy', {
                                            user: notification
                                              .invitationMetadata.userName,
                                            bandName:
                                              notification.invitationMetadata
                                                .bandName,
                                          })
                                      : notification.userId === user?.id
                                        ? t('youDeclinedInvitation', {
                                            bandName:
                                              notification.invitationMetadata
                                                .bandName,
                                          })
                                        : t('invitationDeclinedBy', {
                                            user: notification
                                              .invitationMetadata.userName,
                                            bandName:
                                              notification.invitationMetadata
                                                .bandName,
                                          })}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <p className="pt-2 text-xs text-gray-500">
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
                        )}
                        {notification.bookingMetadata && (
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {t(notification.bookingMetadata.translationKey)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}
