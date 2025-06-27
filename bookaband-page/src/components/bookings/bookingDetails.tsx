'use client';
import { useTranslation } from '@/app/i18n/client';
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  Euro,
  FileText,
  Home,
  MessageSquare,
  Receipt,
  Star,
  Tag,
  Type,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  cancelBooking,
  getBookingById,
  getBookingContract,
  getBookingInvoice,
} from '@/service/backend/booking/service/booking.service';
import React, { useEffect, useState } from 'react';
import { getAvatar } from '@/components/shared/avatar';
import { BookingSummary } from '@/service/backend/booking/domain/bookingSummary';
import { Button } from '@/components/shared/button';
import { EventType } from '@/service/backend/filters/domain/eventType';
import { cn, getStatusColor } from '@/lib/utils';
import { format } from 'date-fns';
import { ca, es } from 'date-fns/locale';
import { BookingContract } from '@/service/backend/booking/domain/bookingContract';
import { BookingInvoice } from '@/service/backend/booking/domain/bookingInvoice';
import { getArtistReviewByBookingId } from '@/service/backend/artistReview/service/artistReview.service';
import { ArtistReview } from '@/service/backend/artistReview/domain/artistReview';
import { ReviewModal } from './reviewModal';
import { BookingStatus } from '@/service/backend/booking/domain/booking';

const getContractStatusConfig = (userSigned: boolean, bandSigned: boolean) => {
  if (userSigned && bandSigned) {
    return {
      status: 'signed',
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
    };
  }
  if (userSigned || bandSigned) {
    return {
      status: 'partially-signed',
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
    };
  }
  return {
    status: 'pending',
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
  };
};

const getInvoiceStatusConfig = (status: string) => {
  switch (status) {
    case 'PAID':
      return {
        status: 'paid',
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200',
      };
    case 'PENDING':
      return {
        status: 'pending',
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        border: 'border-yellow-200',
      };
    default:
      return {
        status: 'unknown',
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        border: 'border-gray-200',
      };
  }
};

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
  const [contract, setContract] = useState<BookingContract | undefined>();
  const [invoice, setInvoice] = useState<BookingInvoice | undefined>();
  const [existingReview, setExistingReview] = useState<ArtistReview | null>(
    null,
  );
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isLoadingReview, setIsLoadingReview] = useState(false);

  useEffect(() => {
    const fetchContractAndInvoice = async () => {
      if (['ACCEPTED', 'SIGNED', 'PAID'].includes(booking.status)) {
        const contractData = await getBookingContract(booking.id);
        setContract(contractData);
      }
      if (['SIGNED', 'PAID'].includes(booking.status)) {
        const invoiceData = await getBookingInvoice(booking.id);
        setInvoice(invoiceData);
      }
    };

    fetchContractAndInvoice();
  }, [booking.id, booking.status]);

  useEffect(() => {
    const checkExistingReview = async () => {
      if (
        booking.status === BookingStatus.PAID &&
        new Date(booking.endDate) < new Date()
      ) {
        setIsLoadingReview(true);
        try {
          const review = await getArtistReviewByBookingId(booking.id);
          setExistingReview(review);
        } catch (error) {
          console.error('Error fetching review:', error);
        } finally {
          setIsLoadingReview(false);
        }
      }
    };

    checkExistingReview();
  }, [booking.id, booking.status, booking.initDate]);

  const handleCancel = async () => {
    try {
      setCancelling(true);
      await cancelBooking(initialBooking.id);
      const updatedBooking = await getBookingById(initialBooking.id);
      if (updatedBooking) {
        setBooking(updatedBooking);
      }
      setShowCancelModal(false);
      window.location.reload();
    } catch (error) {
      console.error('Error cancelling booking:', error);
    } finally {
      setCancelling(false);
    }
  };

  const handleMessage = () => {
    router.push(`/${language}/chats?band_id=${booking.bandId}`);
  };

  const handleReviewSubmitted = () => {
    const checkExistingReview = async () => {
      setIsLoadingReview(true);
      try {
        const review = await getArtistReviewByBookingId(booking.id);
        setExistingReview(review);
      } catch (error) {
        console.error('Error fetching review:', error);
      } finally {
        setIsLoadingReview(false);
      }
    };
    checkExistingReview();
  };

  const eventType = booking.eventTypeId
    ? eventTypes.find((type) => type.id === booking.eventTypeId)
    : undefined;

  const canCancel =
    booking.status === 'PENDING' || booking.status === 'ACCEPTED';

  const shouldShowReviewButton =
    booking.status === BookingStatus.PAID &&
    new Date(booking.endDate) < new Date() &&
    !existingReview &&
    !isLoadingReview;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
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
          className={cn(
            getStatusColor(booking.status),
            'rounded-full px-4 py-2 text-sm font-semibold',
          )}
        >
          {t(`status.${booking.status.toLowerCase()}`)}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {t('bandInfo')}
          </h2>
          <div className="flex items-center gap-4">
            <div
              className="cursor-pointer overflow-hidden rounded-full border border-gray-200 shadow-sm transition-opacity hover:opacity-80"
              onClick={() =>
                router.push(`/${language}/artists/${booking.bandId}`)
              }
            >
              {getAvatar(20, booking.bandImageUrl, booking.bandName)}
            </div>
            <div className="flex flex-col gap-2">
              <div>
                <h3
                  className="cursor-pointer text-lg font-semibold text-gray-900 transition-colors hover:text-[#15b7b9]"
                  onClick={() =>
                    router.push(`/${language}/artists/${booking.bandId}`)
                  }
                >
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

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {t('placeInfo')}
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-[#15b7b9]" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {t('venue')}
                </p>
                <p className="text-gray-900">{booking.venue}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Home className="h-5 w-5 text-[#15b7b9]" />
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

        <div className="rounded-lg border border-gray-200 bg-white p-6 md:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {t('eventDetails')}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <Type className="h-5 w-5 text-[#15b7b9]" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {t('eventName')}
                </p>
                <p className="text-gray-900">{booking.name}</p>
              </div>
            </div>
            {eventType && (
              <div className="flex items-center gap-3">
                <Tag className="h-5 w-5 text-[#15b7b9]" />
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
            <div className="flex items-center gap-3">
              <Euro className="h-5 w-5 text-[#15b7b9]" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {t('totalCost')}
                </p>
                <p className="text-gray-900">
                  {booking.cost.toLocaleString(
                    language === 'es'
                      ? 'es-ES'
                      : language === 'ca'
                        ? 'ca-ES'
                        : 'en-US',
                    { style: 'currency', currency: 'EUR' },
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

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

      {booking.status === BookingStatus.PAID &&
        new Date(booking.endDate) < new Date() && (
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              {t('review')}
            </h2>
            {isLoadingReview ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#15b7b9] border-t-transparent"></div>
              </div>
            ) : existingReview ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {renderStars(existingReview.rating)}
                  <span className="text-sm text-gray-600">
                    {existingReview.rating}/5
                  </span>
                </div>
                <p className="text-gray-700">{existingReview.comment}</p>
                <p className="text-sm text-gray-500">
                  {t('reviewedOn')}:{' '}
                  {new Date(existingReview.date).toLocaleDateString(language)}
                </p>
              </div>
            ) : shouldShowReviewButton ? (
              <div className="py-8 text-center">
                <p className="mb-4 text-gray-600">{t('reviewPrompt')}</p>
                <Button
                  onClick={() => setShowReviewModal(true)}
                  className="px-6"
                >
                  {t('writeReview')}
                </Button>
              </div>
            ) : null}
          </div>
        )}

      {contract && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">
            {t('contract-details')}
          </h2>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-[#15b7b9]/10 p-3">
                <FileText className="h-6 w-6 text-[#15b7b9]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {contract.eventName}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {t('contract-created')}:{' '}
                  {format(new Date(contract.createdAt), 'PPP', {
                    locale: language === 'es' ? es : ca,
                  })}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div
                    className={`rounded-full border px-3 py-1 text-sm font-medium ${
                      getContractStatusConfig(
                        contract.userSigned,
                        contract.bandSigned,
                      ).bg
                    } ${
                      getContractStatusConfig(
                        contract.userSigned,
                        contract.bandSigned,
                      ).text
                    } ${
                      getContractStatusConfig(
                        contract.userSigned,
                        contract.bandSigned,
                      ).border
                    }`}
                  >
                    {t(
                      `contract-status.${
                        getContractStatusConfig(
                          contract.userSigned,
                          contract.bandSigned,
                        ).status
                      }`,
                    )}
                  </div>
                </div>
              </div>
            </div>
            <Button
              onClick={() =>
                router.push(`/${language}/documents/contract/${contract.id}`)
              }
              variant="outline"
              className="border-[#15b7b9]/20 bg-white px-4 py-2 text-[#15b7b9] shadow-sm transition-all duration-300 hover:bg-[#15b7b9]/5 hover:shadow-md"
            >
              {t('view-contract')}
            </Button>
          </div>
        </div>
      )}

      {invoice && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">
            {t('invoice-details')}
          </h2>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-[#15b7b9]/10 p-3">
                <Receipt className="h-6 w-6 text-[#15b7b9]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {invoice.amount.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {t('invoice-created')}:{' '}
                  {format(new Date(invoice.createdAt), 'PPP', {
                    locale: language === 'es' ? es : ca,
                  })}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div
                    className={`rounded-full border px-3 py-1 text-sm font-medium ${
                      getInvoiceStatusConfig(invoice.status).bg
                    } ${getInvoiceStatusConfig(invoice.status).text} ${
                      getInvoiceStatusConfig(invoice.status).border
                    }`}
                  >
                    {t(
                      `invoice-status.${getInvoiceStatusConfig(invoice.status).status}`,
                    )}
                  </div>
                </div>
              </div>
            </div>
            <Button
              onClick={() =>
                router.push(`/${language}/documents/invoice/${invoice.id}`)
              }
              variant="outline"
              className="border-[#15b7b9]/20 bg-white px-4 py-2 text-[#15b7b9] shadow-sm transition-all duration-300 hover:bg-[#15b7b9]/5 hover:shadow-md"
            >
              {t('view-invoice')}
            </Button>
          </div>
        </div>
      )}

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
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowCancelModal(false)}
                className="px-6"
              >
                {t('no')}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={cancelling}
                className="px-6 text-red-600 hover:bg-red-50 hover:text-red-700"
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

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        bookingId={booking.id}
        bandName={booking.bandName}
        language={language}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
}
