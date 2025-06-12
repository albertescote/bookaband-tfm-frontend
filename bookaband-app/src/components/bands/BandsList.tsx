'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/app/i18n/client';
import { Plus } from 'lucide-react';
import { UserBand } from '@/service/backend/band/domain/userBand';
import { Invitation } from '@/service/backend/invitation/domain/invitation';
import {
  acceptInvitation,
  declineInvitation,
} from '@/service/backend/invitation/service/invitation.service';
import { toast } from 'sonner';
import Image from 'next/image';
import { useAuth } from '@/providers/authProvider';
import { format } from 'date-fns';
import { ca, enUS, es } from 'date-fns/locale';

interface BandsListProps {
  language: string;
  initialBands: UserBand[];
  initialInvitations: Invitation[];
}

export default function BandsList({
  language,
  initialBands,
  initialInvitations,
}: BandsListProps) {
  const { t } = useTranslation(language, 'bands');
  const router = useRouter();
  const { user } = useAuth();

  const [invitations, setInvitations] =
    useState<Invitation[]>(initialInvitations);
  const [isAccepting, setIsAccepting] = useState<string | null>(null);
  const [isDeclining, setIsDeclining] = useState<string | null>(null);

  const handleCreateBand = () => {
    if (!user?.nationalId || !user?.phoneNumber) {
      toast.error(t('validation.completeProfileFirst'));
      router.push(`/${language}/profile`);
      return;
    }
    router.push(`/${language}/bands/create`);
  };

  const handleAcceptInvitation = async (invitationId: string) => {
    if (!user?.nationalId || !user?.phoneNumber) {
      toast.error(t('validation.completeProfileFirstJoin'));
      router.push(`/${language}/profile`);
      return;
    }

    setIsAccepting(invitationId);
    try {
      await acceptInvitation(invitationId);
      setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
      toast.success(t('invitationAccepted'));
      router.refresh();
    } catch (error) {
      console.error('Error accepting invitation:', error);
      toast.error(t('errorAcceptingInvitation'));
    } finally {
      setIsAccepting(null);
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

  const handleDeclineInvitation = async (invitationId: string) => {
    setIsDeclining(invitationId);
    try {
      await declineInvitation(invitationId);
      setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
      toast.success(t('invitationDeclined'));
    } catch (error) {
      console.error('Error declining invitation:', error);
      toast.error(t('errorDecliningInvitation'));
    } finally {
      setIsDeclining(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <button
          onClick={handleCreateBand}
          className="flex items-center gap-2 rounded-lg bg-[#15b7b9] px-4 py-2 text-white transition-colors hover:bg-[#15b7b9]/90"
        >
          <Plus size={20} />
          {t('createNew')}
        </button>
      </div>

      {invitations.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            {t('invitations')}
          </h2>
          <div className="space-y-4">
            {invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="rounded-lg bg-white p-4 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {t('invitationReceived', {
                        date: format(new Date(invitation.createdAt), 'PPP', {
                          locale: getLocale(),
                        }),
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t('invitedBy')}: {invitation.bandName}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptInvitation(invitation.id)}
                      disabled={isAccepting === invitation.id}
                      className="rounded-lg bg-[#15b7b9] px-4 py-2 text-white hover:bg-[#15b7b9]/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {t('acceptInvitation')}
                    </button>
                    <button
                      onClick={() => handleDeclineInvitation(invitation.id)}
                      disabled={isDeclining === invitation.id}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {t('declineInvitation')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          {t('yourBands')}
        </h2>
        {initialBands.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center shadow-md">
            <p className="mb-4 text-gray-600">{t('noBands')}</p>
            <button
              onClick={handleCreateBand}
              className="inline-flex items-center gap-2 rounded-lg bg-[#15b7b9] px-4 py-2 text-white transition-colors hover:bg-[#15b7b9]/90"
            >
              <Plus size={20} />
              {t('createFirstBand')}
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {initialBands.map((band) => (
              <div
                key={band.id}
                onClick={() => router.push(`/${language}/bands/${band.id}`)}
                className="cursor-pointer rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
              >
                <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg bg-gray-100">
                  {band.imageUrl ? (
                    <Image
                      src={band.imageUrl}
                      alt={band.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <p className="text-lg text-gray-500">
                        {t('form.noImageAvailable')}
                      </p>
                    </div>
                  )}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  {band.name}
                </h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
