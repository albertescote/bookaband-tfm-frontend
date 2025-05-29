'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PlusCircle, Bell } from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';
import { getUserInvitations, acceptInvitation, declineInvitation } from '@/service/backend/invitation/service/invitation.service';
import { Invitation } from '@/service/backend/invitation/domain/invitation';
import { getUserBands } from '@/service/backend/band/service/band.service';
import { UserBand } from '@/service/backend/band/domain/userBand';
import { format } from 'date-fns';
import { es, ca } from 'date-fns/locale';

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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <button
          onClick={handleCreateBand}
          className="flex items-center gap-2 bg-[#15b7b9] text-white px-4 py-2 rounded-lg hover:bg-[#15b7b9]/90 transition-colors"
        >
          <PlusCircle size={20} />
          {t('createNew')}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Invitations Section */}
      {!isLoading && invitations.filter(inv => inv.status === 'PENDING').length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="text-[#15b7b9]" size={20} />
            <h2 className="text-xl font-semibold text-gray-800">{t('invitations')}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {invitations
              .filter(inv => inv.status === 'PENDING')
              .map((invitation) => (
              <div
                key={invitation.id}
                className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
              >
                <h3 className="font-medium text-gray-900">{invitation.bandName}</h3>
                <p className="text-sm text-gray-600 mb-3">
                  {t('invitationReceived', { 
                    date: format(new Date(invitation.createdAt), 'PPP', { 
                      locale: language === 'es' ? es : language === 'ca' ? ca : undefined 
                    }) 
                  })}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAcceptInvitation(invitation.id)}
                    className="flex-1 bg-[#15b7b9] text-white px-3 py-1 rounded hover:bg-[#15b7b9]/90 transition-colors"
                  >
                    {t('acceptInvitation')}
                  </button>
                  <button
                    onClick={() => handleDeclineInvitation(invitation.id)}
                    className="flex-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
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
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('yourBands')}</h2>
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">{t('common:loading')}</p>
          </div>
        ) : bands.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 mb-4">{t('noBands')}</p>
            <button
              onClick={handleCreateBand}
              className="inline-flex items-center gap-2 bg-[#15b7b9] text-white px-4 py-2 rounded-lg hover:bg-[#15b7b9]/90 transition-colors"
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
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-gray-200">
                  {band.imageUrl && (
                    <img
                      src={band.imageUrl}
                      alt={band.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{band.name}</h3>
                  <button
                    onClick={() => router.push(`/bands/${band.id}`)}
                    className="mt-4 w-full bg-[#15b7b9] text-white px-4 py-2 rounded hover:bg-[#15b7b9]/90 transition-colors"
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
