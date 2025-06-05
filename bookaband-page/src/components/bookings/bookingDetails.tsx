'use client';
import { useTranslation } from '@/app/i18n/client';
import { getStatusColor } from '@/lib/utils';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  MessageSquare,
  Music,
  AlertTriangle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  cancelBooking,
  getBookingById,
} from '@/service/backend/booking/service/booking.service';
import React, { useState } from 'react';
import { getAvatar } from '@/components/shared/avatar';
import { BookingSummary } from '@/service/backend/booking/domain/bookingSummary';
import { Button } from '@/components/shared/button';
import { EventType } from '@/service/backend/filters/domain/eventType';

export default function BookingDetails({
  language,
  eventTypes,
  initialBooking,
}: {
  language: string;
  eventTypes: EventType[];
  initialBooking: BookingSummary;
}) {
  const { t } = useTranslation(language, 'bookings');
  const router = useRouter();
  const [booking, setBooking] = useState<BookingSummary>(initialBooking);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleCancel = async () => {
    try {
      setCancelling(true);
      await cancelBooking(initialBooking.id);
      const updatedBooking = await getBookingById(initialBooking.id);
      if (updatedBooking) {
        setBooking(updatedBooking);
      }
      setShowCancelModal(false);
    } catch (error) {
      console.error('Error cancelling booking:', error);
    } finally {
      setCancelling(false);
    }
  };

  const handleMessage = () => {
    router.push(`/${language}/chats?band_id=${booking.bandId}`);
  };

  const eventType = booking.eventTypeId
    ? eventTypes.find((type) => type.id === booking.eventTypeId)
    : undefined;

  const canCancel =
    booking.status === 'PENDING' || booking.status === 'ACCEPTED';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push(`/${language}/bookings`)}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('bookingDetails')}
          </h1>
        </div>
        <div
          className="rounded-full px-4 py-2 text-sm font-semibold text-white"
          style={{ backgroundColor: getStatusColor(booking.status) }}
        >
          {t(`status.${booking.status.toLowerCase()}`)}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Band Information */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {t('bandInfo')}
          </h2>
          <div className="flex items-center gap-4">
            <div className="overflow-hidden rounded-full border border-gray-200 shadow-sm">
              {getAvatar(20, booking.bandImageUrl, booking.bandName)}
            </div>
            <div className="flex flex-col gap-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {booking.bandName}
                </h3>
              </div>
              <Button
                variant="outline"
                onClick={handleMessage}
                className="flex items-center gap-2 text-[#15b7b9] hover:bg-[#15b7b9] hover:text-white"
              >
                <MessageSquare className="h-4 w-4" />
                {t('messageBand')}
              </Button>
            </div>
          </div>
        </div>

        {/* Place Information */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {t('placeInfo')}
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-[#15b7b9]" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {t('venue')}
                </p>
                <p className="text-gray-900">{booking.venue}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-[#15b7b9]" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {t('address')}
                </p>
                <p className="text-gray-900">
                  {booking.addressLine1}
                  {booking.addressLine2 && `, ${booking.addressLine2}`}
                </p>
                <p className="text-gray-900">
                  {booking.postalCode} {booking.city}, {booking.country}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 md:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {t('eventDetails')}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <Music className="h-5 w-5 text-[#15b7b9]" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {t('eventName')}
                </p>
                <p className="text-gray-900">{booking.name}</p>
              </div>
            </div>
            {eventType && (
              <div className="flex items-center gap-3">
                <Music className="h-5 w-5 text-[#15b7b9]" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {t('eventType')}
                  </p>
                  <p className="text-gray-900">
                    {eventType.icon} {eventType.label[language]}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-[#15b7b9]" />
              <div>
                <p className="text-sm font-medium text-gray-500">{t('date')}</p>
                <p className="text-gray-900">
                  {new Date(booking.initDate).toLocaleDateString(language, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-[#15b7b9]" />
              <div>
                <p className="text-sm font-medium text-gray-500">{t('time')}</p>
                <p className="text-gray-900">
                  {new Date(booking.initDate).toLocaleTimeString(language, {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  -{' '}
                  {new Date(booking.endDate).toLocaleTimeString(language, {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        {canCancel && (
          <div className="flex justify-end gap-4 md:col-span-2">
            <Button
              variant="outline"
              onClick={() => setShowCancelModal(true)}
              disabled={cancelling}
              className="px-6 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              {cancelling ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                  {t('cancelling')}
                </div>
              ) : (
                t('cancel')
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-center">
              <div className="rounded-full bg-red-100 p-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <h3 className="mb-2 text-center text-lg font-semibold text-gray-900">
              {t('confirmCancel')}
            </h3>
            <p className="mb-6 text-center text-gray-600">
              {t('cancelConfirmationMessage')}
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowCancelModal(false)}
                className="px-4"
              >
                {t('no')}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={cancelling}
                className="px-4 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                {cancelling ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                    {t('cancelling')}
                  </div>
                ) : (
                  t('yes')
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
