'use client';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Booking } from '@/service/backend/booking/domain/booking';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/app/i18n/client';
import { getStatusColor } from '@/lib/utils';
import {
  getAllBandBookings,
  getAllUserBookings,
} from '@/service/backend/booking/service/booking.service';

export function BookingsList({
  language,
  bandOptions,
  userId,
}: {
  language: string;
  userId?: string;
  bandOptions?: {
    id: string;
    setBandId: Dispatch<SetStateAction<string | undefined>>;
  };
}) {
  const { t } = useTranslation(language, 'booking');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true);
        let bookings: Booking[] | undefined = [];
        if (bandOptions?.id) {
          bookings = await getAllBandBookings(bandOptions.id);
        } else if (userId) {
          bookings = await getAllUserBookings();
        }
        setBookings(bookings || []);
      } catch (err) {
        setError('Failed to load bookings.');
      } finally {
        setLoading(false);
      }
    }
    fetchBookings().then();
  }, [bandOptions?.id, userId]);

  if (loading)
    return (
      <div className="flex h-20 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    );

  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div>
      <div className="mb-4 flex">
        {!!bandOptions?.id && (
          <ArrowLeft
            className="cursor-pointer"
            onClick={() => {
              bandOptions.setBandId(undefined);
            }}
          />
        )}
        <h2 className="ml-4 text-lg font-semibold">{t('your-bookings')}</h2>
      </div>
      {bookings.length === 0 ? (
        <p className="text-center text-gray-500">{t('no-bookings')}</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {bookings.map((booking, index) => (
            <li
              key={index}
              className="relative flex items-center justify-between rounded-md p-4 transition hover:cursor-pointer hover:bg-gray-100"
              onClick={() => router.push(`/booking/${booking.id}`)}
            >
              <span className="text-lg font-medium text-gray-900">
                #{booking.id}
              </span>
              <div className="flex flex-col items-end">
                <div className="flex items-center">
                  <span
                    className="mr-2 h-2 w-2 rounded-full"
                    style={{ backgroundColor: getStatusColor(booking.status) }}
                  />
                  <span className="text-sm font-semibold capitalize text-gray-700">
                    {t(`status.${booking.status.toLowerCase()}`)}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(booking.date).toLocaleDateString(language, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
