'use client';
import { useTranslation } from '@/app/i18n/client';
import { Booking, BookingStatus } from '@/service/backend/domain/booking';
import { getStatusColor } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { Role } from '@/service/backend/domain/role';
import { acceptBooking, declineBooking } from '@/service/backend/api';
import { useRouter } from 'next/navigation';

export default function BookingDetails({
  language,
  booking,
}: {
  language: string;
  booking: Booking | undefined;
}) {
  const { t } = useTranslation(language, 'booking');
  const { role, changeMe } = useAuth();
  const router = useRouter();

  const handleAccept = () => {
    acceptBooking(booking?.id).then(() => {
      changeMe.setChangeMe(!changeMe.changeMe);
      router.refresh();
    });
  };

  const handleDecline = () => {
    declineBooking(booking?.id).then(() => {
      changeMe.setChangeMe(!changeMe.changeMe);
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col items-center">
      {booking?.status && (
        <div
          className="mb-4 rounded-full px-4 py-2 text-sm font-bold text-white"
          style={{ backgroundColor: getStatusColor(booking.status) }}
        >
          {t(`status.${booking.status.toLowerCase()}`)}
        </div>
      )}

      {booking?.date && (
        <div className="mb-4 text-lg text-gray-700">
          <span className="font-semibold">{t('date')}:</span>{' '}
          {new Date(booking.date).toLocaleDateString(language, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      )}

      {booking?.createdAt && (
        <div className="mb-4 text-sm text-gray-500">
          <span className="font-semibold">{t('created-at')}:</span>{' '}
          {new Date(booking.createdAt).toLocaleDateString(language, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      )}

      {booking?.status === BookingStatus.PENDING &&
        role.role === Role.Musician && (
          <div className="mt-6 flex w-full justify-center gap-4">
            <button
              onClick={handleAccept}
              className="flex items-center justify-center rounded-lg bg-green-500 px-4 py-2 text-white transition hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <Check className="mr-2 h-5 w-5" />
              {t('accept')}
            </button>
            <button
              onClick={handleDecline}
              className="flex items-center justify-center rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <X className="mr-2 h-5 w-5" />
              {t('decline')}
            </button>
          </div>
        )}
    </div>
  );
}
