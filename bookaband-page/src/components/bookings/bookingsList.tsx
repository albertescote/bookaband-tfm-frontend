'use client';
import { useTranslation } from '@/app/i18n/client';
import { BookingSummary } from '@/service/backend/booking/domain/bookingSummary';
import Link from 'next/link';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { getStatusColor } from '@/lib/utils';
import { getAvatar } from '@/components/shared/avatar';

interface BookingsListProps {
  language: string;
  bookings: BookingSummary[];
}

export default function BookingsList({
  language,
  bookings,
}: BookingsListProps) {
  const { t } = useTranslation(language, 'bookings');

  if (!bookings || bookings.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          {t('your-bookings')}
        </h1>
        <p className="text-center text-gray-500">{t('no-bookings')}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        {t('your-bookings')}
      </h1>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <Link
            key={booking.id}
            href={`/${language}/bookings/${booking.id}`}
            className="block rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
          >
            <div className="flex items-center gap-4">
              <div className="overflow-hidden rounded-full border border-gray-200 shadow-sm">
                {getAvatar(12, booking.bandImageUrl, booking.bandName)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {booking.name}
                    </h2>
                    <p className="text-sm text-gray-600">{booking.bandName}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span>{booking.venue}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(booking.initDate).toLocaleDateString(language, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          {new Date(booking.initDate).toLocaleTimeString(language, {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}{' '}
                          -{' '}
                          {new Date(booking.endDate).toLocaleTimeString(language, {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="rounded-full px-3 py-1 text-sm font-semibold text-white"
                    style={{ backgroundColor: getStatusColor(booking.status) }}
                  >
                    {t(`status.${booking.status.toLowerCase()}`)}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
