'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Bell, PlusCircle } from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';
import {
  acceptInvitation,
  declineInvitation,
  getUserInvitations,
} from '@/service/backend/invitation/service/invitation.service';
import { Invitation } from '@/service/backend/invitation/domain/invitation';
import { getUserBands } from '@/service/backend/band/service/band.service';
import { UserBand } from '@/service/backend/band/domain/userBand';
import { format } from 'date-fns';
import { ca, es } from 'date-fns/locale';

export default function BandsPage() {
  const params = useParams();
  const language = params.lng as string;
  const { t } = useTranslation(language, 'bands');
  const router = useRouter();
  const [bands, setBands] = useState<UserBand[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userBands, userInvitations] = await Promise.all([
        getUserBands(),
        getUserInvitations(),
      ]);

      if (userBands) {
        setBands(userBands);
      }
      if (userInvitations) {
        setInvitations(userInvitations);
      }
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptInvitation = async (id: string) => {
    try {
      await acceptInvitation(id);
      // Remove the accepted invitation from the list
      setInvitations((prev) => prev.filter((inv) => inv.id !== id));
      // Refresh bands list after accepting invitation
      const userBands = await getUserBands();
      if (userBands) {
        setBands(userBands);
      }
      // Perform a hard refresh
      window.location.reload();
    } catch (err) {
      setError('Failed to accept invitation');
      console.error('Error accepting invitation:', err);
    }
  };

  const handleDeclineInvitation = async (id: string) => {
    try {
      await declineInvitation(id);
      // Remove the declined invitation from the list
      setInvitations((prev) => prev.filter((inv) => inv.id !== id));
    } catch (err) {
      setError('Failed to decline invitation');
      console.error('Error declining invitation:', err);
    }
  };

  const handleCreateBand = () => {
    router.push('/bands/create');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <button
          onClick={handleCreateBand}
          className="flex items-center gap-2 rounded-lg bg-[#15b7b9] px-4 py-2 text-white transition-colors hover:bg-[#15b7b9]/90"
        >
          <PlusCircle size={20} />
          {t('createNew')}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Invitations Section */}
      {!isLoading &&
        invitations.filter((inv) => inv.status === 'PENDING').length > 0 && (
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-2">
              <Bell className="text-[#15b7b9]" size={20} />
              <h2 className="text-xl font-semibold text-gray-800">
                {t('invitations')}
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {invitations
                .filter((inv) => inv.status === 'PENDING')
                .map((invitation) => (
                  <div
                    key={invitation.id}
                    className="rounded-lg border border-gray-200 bg-white p-4 shadow-md"
                  >
                    <h3 className="font-medium text-gray-900">
                      {invitation.bandName}
                    </h3>
                    <p className="mb-3 text-sm text-gray-600">
                      {t('invitationReceived', {
                        date: format(new Date(invitation.createdAt), 'PPP', {
                          locale:
                            language === 'es'
                              ? es
                              : language === 'ca'
                                ? ca
                                : undefined,
                        }),
                      })}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAcceptInvitation(invitation.id)}
                        className="flex-1 rounded bg-[#15b7b9] px-3 py-1 text-white transition-colors hover:bg-[#15b7b9]/90"
                      >
                        {t('acceptInvitation')}
                      </button>
                      <button
                        onClick={() => handleDeclineInvitation(invitation.id)}
                        className="flex-1 rounded bg-red-600 px-3 py-1 text-white transition-colors hover:bg-red-700"
                      >
                        {t('declineInvitation')}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

      {/* Bands List */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          {t('yourBands')}
        </h2>
        {isLoading ? (
          <div className="py-12 text-center">
            <p className="text-gray-600">{t('common:loading')}</p>
          </div>
        ) : bands.length === 0 ? (
          <div className="rounded-lg bg-gray-50 py-12 text-center">
            <p className="mb-4 text-gray-600">{t('noBands')}</p>
            <button
              onClick={handleCreateBand}
              className="inline-flex items-center gap-2 rounded-lg bg-[#15b7b9] px-4 py-2 text-white transition-colors hover:bg-[#15b7b9]/90"
            >
              <PlusCircle size={20} />
              {t('createFirstBand')}
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bands.map((band) => (
              <div
                key={band.id}
                className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
              >
                <div className="aspect-video bg-gray-200">
                  {band.imageUrl && (
                    <img
                      src={band.imageUrl}
                      alt={band.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    {band.name}
                  </h3>
                  <button
                    onClick={() => router.push(`/bands/${band.id}`)}
                    className="mt-4 w-full rounded bg-[#15b7b9] px-4 py-2 text-white transition-colors hover:bg-[#15b7b9]/90"
                  >
                    {t('manage')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
