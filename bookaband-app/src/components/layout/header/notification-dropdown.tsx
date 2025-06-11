'use client';

import { Fragment, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Bell } from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';
import { useParams, useRouter } from 'next/navigation';
import {
  acceptInvitation,
  declineInvitation,
  getUserInvitations,
} from '@/service/backend/invitation/service/invitation.service';
import { Invitation } from '@/service/backend/invitation/domain/invitation';
import { format } from 'date-fns';
import { ca, enUS, es } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/providers/authProvider';

export function NotificationDropdown() {
  const params = useParams();
  const language = params.lng as string;
  const { t } = useTranslation(language, 'bands');
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const userInvitations = await getUserInvitations();
      if (userInvitations) {
        setInvitations(
          userInvitations.filter((inv) => inv.status === 'PENDING'),
        );
      }
    } catch (err) {
      console.error('Error fetching invitations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptInvitation = async (id: string) => {
    try {
      if (!user?.nationalId || !user?.phoneNumber) {
        toast.error(t('validation.completeProfileFirstJoin'));
        router.push(`/${language}/profile`);
        return;
      }
      await acceptInvitation(id);
      setInvitations((prev) => prev.filter((inv) => inv.id !== id));
      toast.success(t('invitationAccepted'));
      // Perform a hard refresh to update the band switcher
      window.location.reload();
    } catch (err) {
      console.error('Error accepting invitation:', err);
      toast.error(t('errorAcceptingInvitation'));
    }
  };

  const handleDeclineInvitation = async (id: string) => {
    try {
      await declineInvitation(id);
      setInvitations((prev) => prev.filter((inv) => inv.id !== id));
      toast.success(t('invitationDeclined'));
    } catch (err) {
      console.error('Error declining invitation:', err);
      toast.error(t('errorDecliningInvitation'));
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

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100">
        <Bell size={20} />
        {invitations.length > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {invitations.length}
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
              {t('invitations')}
            </h3>
            {isLoading ? (
              <div className="py-4 text-center text-sm text-gray-500">
                {t('common:loading')}
              </div>
            ) : invitations.length === 0 ? (
              <div className="py-4 text-center text-sm text-gray-500">
                {t('noInvitations')}
              </div>
            ) : (
              <div className="mt-2 space-y-2">
                {invitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    className="rounded-lg border border-gray-200 p-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {t('invitedBy')}{' '}
                          <span className="font-semibold">
                            {invitation.bandName}
                          </span>
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {t('invitationReceived', {
                            date: format(
                              new Date(invitation.createdAt),
                              'PPP',
                              {
                                locale: getLocale(),
                              },
                            ),
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleAcceptInvitation(invitation.id)}
                        className="flex-1 rounded-lg bg-[#15b7b9] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#15b7b9]/90"
                      >
                        {t('acceptInvitation')}
                      </button>
                      <button
                        onClick={() => handleDeclineInvitation(invitation.id)}
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        {t('declineInvitation')}
                      </button>
                    </div>
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
