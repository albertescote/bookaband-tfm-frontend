'use client';

import { Fragment, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Bell } from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';
import { useParams, useRouter } from 'next/navigation';
import { getUserNotificationsWithBand } from '@/service/backend/notification/service/notification.service';
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
      if (bandNotifications && !('error' in bandNotifications)) {
        setNotifications(bandNotifications as unknown as Notification[]);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.invitationMetadata) {
      if (notification.invitationMetadata.status === 'ACCEPTED') {
        router.push(`/${language}/bands/${notification.bandId}`);
      } else {
        router.push(`/${language}/bands`);
      }
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
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('notifications')}
            </h3>
            {isLoading ? (
              <div className="py-4 text-center text-sm text-gray-500">
                {t('common:loading')}
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-4 text-center text-sm text-gray-500">
                {t('noNotifications')}
              </div>
            ) : (
              <div className="mt-2 space-y-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`cursor-pointer rounded-lg border border-gray-200 p-3 ${
                      !notification.isRead ? 'bg-gray-50' : ''
                    } hover:bg-gray-50`}
                  >
                    {notification.invitationMetadata && (
                      <div className="flex items-start justify-between">
                        <div>
                          {notification.invitationMetadata.status ===
                          'PENDING' ? (
                            <>
                              <p className="font-medium text-gray-900">
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
                              <p className="mt-1 text-sm text-gray-500">
                                {notification.userId === user?.id
                                  ? format(
                                      new Date(
                                        notification.invitationMetadata.createdAt!,
                                      ),
                                      'PPP',
                                      {
                                        locale: getLocale(),
                                      },
                                    )
                                  : format(
                                      new Date(
                                        notification.invitationMetadata.createdAt!,
                                      ),
                                      'PPP',
                                      {
                                        locale: getLocale(),
                                      },
                                    )}
                              </p>
                            </>
                          ) : (
                            <p className="font-medium text-gray-900">
                              {notification.invitationMetadata.status ===
                              'ACCEPTED'
                                ? notification.userId === user?.id
                                  ? t('youAcceptedInvitation', {
                                      bandName: notification.invitationMetadata.bandName,
                                    })
                                  : t('invitationAcceptedBy', {
                                      user: notification.invitationMetadata
                                        .userName,
                                      bandName: notification.invitationMetadata.bandName,
                                    })
                                : notification.userId === user?.id
                                  ? t('youDeclinedInvitation', {
                                      bandName: notification.invitationMetadata.bandName,
                                    })
                                  : t('invitationDeclinedBy', {
                                      user: notification.invitationMetadata
                                        .userName,
                                      bandName: notification.invitationMetadata.bandName,
                                    })}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    {notification.bookingMetadata && (
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
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
    </Menu>
  );
}
