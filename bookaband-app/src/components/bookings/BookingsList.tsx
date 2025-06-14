'use client';

import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/providers/authProvider';
import { BookingStatus } from '@/service/backend/booking/domain/booking';
import { format } from 'date-fns';
import { ca, es } from 'date-fns/locale';
import { Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';
import { getAvatar } from '@/components/shared/avatar';
import { useEffect, useState } from 'react';
import { getAllBandBookings } from '@/service/backend/booking/service/booking.service';
import { BookingSummary } from '@/service/backend/booking/domain/bookingSummary';

interface BookingsListProps {
  language: string;
}

export default function BookingsList({ language: lng }: BookingsListProps) {
  const { t } = useTranslation(lng, 'booking');
  const { selectedBand } = useAuth();
  const [bookings, setBookings] = useState<BookingSummary[]>([]);

  useEffect(() => {
    getAllBandBookings(selectedBand?.id ?? '').then((bookings) => {
      setBookings(bookings ?? []);
    });
  }, []);

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case BookingStatus.ACCEPTED:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case BookingStatus.SIGNED:
        return 'bg-gradient-to-r from-blue-50 to-indigo-50';
      case BookingStatus.PAID:
        return 'bg-gradient-to-r from-purple-50 to-violet-50';
      case BookingStatus.DECLINED:
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case BookingStatus.CANCELED:
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (!selectedBand) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <h1 className="text-lg text-gray-500">{t('not-in-a-band-yet')}</h1>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-700">
            {t('no-bookings')}
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-semibold text-gray-900">
        {t('your-bookings')}
      </h1>
      <div className="grid gap-6">
        {bookings.map((booking) => (
          <Link
            key={booking.id}
            href={`/${lng}/bookings/${booking.id}`}
            className="block overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  {getAvatar(12, booking.userImageUrl, booking.userName)}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {booking.name}
                    </h2>
                    <p className="text-sm text-gray-600">{booking.userName}</p>
                  </div>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(
                    booking.status,
                  )}`}
                >
                  {t(`status.${booking.status.toLowerCase()}`)}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-[#15b7b9]" />
                  <span>
                    {format(new Date(booking.initDate), 'PPP', {
                      locale: lng === 'es' ? es : ca,
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-[#15b7b9]" />
                  <span>
                    {booking.venue}, {booking.city}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
