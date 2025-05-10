'use client';
import { useTranslation } from '@/app/i18n/client';
import { getStatusColor } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getBookingById } from '@/service/backend/booking/service/booking.service';
import React, { useEffect, useState } from 'react';
import { getAvatar } from '@/components/shared/avatar';
import { BookingWithDetails } from '@/service/backend/booking/domain/bookingWithDetails';

export default function BookingDetails({
  language,
  bookingId,
}: {
  language: string;
  bookingId: string;
}) {
  const { t } = useTranslation(language, 'booking');
  const router = useRouter();
  const [booking, setBooking] = useState<BookingWithDetails | undefined>();

  useEffect(() => {
    getBookingById(bookingId).then((booking) => {
      setBooking(booking);
    });
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center">
        <ArrowLeft className="mr-4 cursor-pointer" onClick={handleGoBack} />
        {booking?.bandName && (
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

        <span className="mt-2 text-sm text-gray-500">{booking?.id}</span>
      </div>
    </div>
  );
}
