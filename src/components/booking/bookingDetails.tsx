'use client';
import { useTranslation } from '@/app/i18n/client';
import { BookingStatus } from '@/service/backend/booking/domain/booking';
import { getStatusColor } from '@/lib/utils';
import { ArrowLeft, Check, X } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { Role } from '@/service/backend/user/domain/role';
import { useRouter } from 'next/navigation';
import {
  acceptBooking,
  declineBooking,
} from '@/service/backend/booking/service/booking.service';
import { BookingWithDetails } from '@/service/backend/booking/domain/bookingWithDetails';
import React from 'react';
import { getAvatar } from '@/components/shared/avatar';

export default function BookingDetails({
  language,
  booking,
}: {
  language: string;
  booking: BookingWithDetails;
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

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center">
        <ArrowLeft className="mr-4 cursor-pointer" onClick={handleGoBack} />
        {role.role === Role.Musician && booking?.userName && (
          <div className="flex items-center gap-4">
            {getAvatar(96, 96, booking.userImageUrl, booking.userName)}
            <p className="text-lg font-semibold">{booking.userName}</p>
          </div>
        )}

        {role.role === Role.Client && booking?.bandName && (
          <div className="flex items-center gap-4">
            {getAvatar(96, 96, booking.bandImageUrl, booking.bandName)}
            <p className="text-lg font-semibold">{booking.bandName}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center">
        {booking?.status && (
          <div
            className="mb-2 rounded-full px-4 py-2 text-sm font-bold text-white"
            style={{ backgroundColor: getStatusColor(booking.status) }}
          >
            {t(`status.${booking.status.toLowerCase()}`)}
          </div>
        )}

        {booking?.date && (
          <div className="mt-2 text-lg text-gray-700">
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

        <span className="mt-2 text-sm text-gray-500">{booking.id}</span>

        {booking?.status === BookingStatus.PENDING &&
          role.role === Role.Musician && (
            <div className="mt-4 flex w-full justify-center gap-4">
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
    </div>
  );
}
