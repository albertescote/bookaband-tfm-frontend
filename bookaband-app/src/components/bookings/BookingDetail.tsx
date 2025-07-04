'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/authProvider';
import { useTranslation } from '@/app/i18n/client';
import {
  acceptBooking,
  declineBooking,
  getBookingContract,
  getBookingInvoice,
} from '@/service/backend/booking/service/booking.service';
import { BookingStatus } from '@/service/backend/booking/domain/booking';
import { BookingSummary } from '@/service/backend/booking/domain/bookingSummary';
import { BookingContract } from '@/service/backend/booking/domain/bookingContract';
import { BookingInvoice } from '@/service/backend/booking/domain/bookingInvoice';
import { format } from 'date-fns';
import { ca, es } from 'date-fns/locale';
import {
  ArrowLeft,
  Building2,
  Calendar,
  Check,
  Clock,
  Eye,
  EyeOff,
  FileText,
  MapPin,
  MessageSquare,
  Receipt,
  X,
} from 'lucide-react';
import { getAvatar } from '@/components/shared/avatar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { EventType } from '@/service/backend/eventTypes/domain/eventType';
import { getBandChats } from '@/service/backend/chat/service/chat.service';

interface BookingDetailProps {
  language: string;
  initialBooking: BookingSummary;
  initialEventTypes: EventType[];
}

export default function BookingDetail({
  language: lng,
  initialBooking,
  initialEventTypes,
}: BookingDetailProps) {
  const { t } = useTranslation(lng, 'booking');
  const router = useRouter();
  const { selectedBand } = useAuth();
  const [booking, setBooking] = useState<BookingSummary>(initialBooking);
  const [eventTypes] = useState<EventType[]>(initialEventTypes);
  const [processing, setProcessing] = useState(false);
  const [contract, setContract] = useState<BookingContract | undefined>();
  const [invoice, setInvoice] = useState<BookingInvoice | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (booking.status === BookingStatus.ACCEPTED) {
          const contractData = await getBookingContract(booking.id);
          setContract(contractData);
        } else if (
          booking.status === BookingStatus.SIGNED ||
          booking.status === BookingStatus.PAID
        ) {
          const [contractData, invoiceData] = await Promise.all([
            getBookingContract(booking.id),
            getBookingInvoice(booking.id),
          ]);
          setContract(contractData);
          setInvoice(invoiceData);
        }
      } catch (error) {
        console.error('Error fetching booking data:', error);
        toast.error(t('error-fetching-data'));
      }
    };

    fetchData();
  }, [booking.id, booking.status, t]);

  const handleSendMessage = async () => {
    const bandChats = await getBandChats(selectedBand?.id ?? '');
    if (bandChats) {
      const userChat = bandChats.find(
        (bandChat) => bandChat.user.id === booking?.userId,
      );
      if (userChat) {
        router.push(`/${lng}/chats?chat_id=${userChat.id}`);
      } else {
        toast.error(t('user-chat-not-found'));
      }
    } else {
      toast.error(t('user-chat-not-found'));
    }
  };

  const handleAccept = async () => {
    if (!booking || !selectedBand) return;

    setProcessing(true);
    try {
      await acceptBooking(booking.id);
      setBooking({ ...booking, status: BookingStatus.ACCEPTED });
      toast.success(t('booking-accepted'));
      router.refresh();
    } catch (error) {
      console.error('Error accepting booking:', error);
      toast.error(t('error-accepting-booking'));
    } finally {
      setProcessing(false);
    }
  };

  const handleDecline = async () => {
    if (!booking || !selectedBand) return;

    setProcessing(true);
    try {
      await declineBooking(booking.id);
      setBooking({ ...booking, status: BookingStatus.DECLINED });
      toast.success(t('booking-declined'));
      router.refresh();
    } catch (error) {
      console.error('Error declining booking:', error);
      toast.error(t('error-declining-booking'));
    } finally {
      setProcessing(false);
    }
  };

  const getStatusConfig = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING:
        return {
          bg: 'bg-gradient-to-r from-amber-50 to-orange-50',
          text: 'text-amber-700',
          border: 'border-amber-200',
          icon: Clock,
          pulse: true,
        };
      case BookingStatus.ACCEPTED:
        return {
          bg: 'bg-gradient-to-r from-emerald-50 to-green-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          icon: Check,
          pulse: false,
        };
      case BookingStatus.SIGNED:
        return {
          bg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
          text: 'text-blue-700',
          border: 'border-blue-200',
          icon: FileText,
          pulse: false,
        };
      case BookingStatus.PAID:
        return {
          bg: 'bg-gradient-to-r from-purple-50 to-violet-50',
          text: 'text-purple-700',
          border: 'border-purple-200',
          icon: Receipt,
          pulse: false,
        };
      case BookingStatus.DECLINED:
        return {
          bg: 'bg-gradient-to-r from-rose-50 to-red-50',
          text: 'text-rose-700',
          border: 'border-rose-200',
          icon: X,
          pulse: false,
        };
      case BookingStatus.CANCELED:
        return {
          bg: 'bg-gradient-to-r from-gray-50 to-slate-50',
          text: 'text-gray-700',
          border: 'border-gray-200',
          icon: X,
          pulse: false,
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-50 to-slate-50',
          text: 'text-gray-700',
          border: 'border-gray-200',
          icon: Clock,
          pulse: false,
        };
    }
  };

  const getEventType = (eventTypeId?: string) => {
    if (!eventTypeId) return null;
    return eventTypes.find((type) => type.id === eventTypeId);
  };

  const eventType = getEventType(booking.eventTypeId);
  const statusConfig = getStatusConfig(booking.status);
  const StatusIcon = statusConfig.icon;

  const getContractStatusConfig = (
    userSigned: boolean,
    bandSigned: boolean,
  ) => {
    if (userSigned && bandSigned) {
      return {
        bg: 'bg-gradient-to-r from-emerald-50 to-green-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        status: t('contract-status.signed'),
      };
    } else if (userSigned) {
      return {
        bg: 'bg-gradient-to-r from-amber-50 to-orange-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        status: t('contract-status.pending-band-signature'),
      };
    } else if (bandSigned) {
      return {
        bg: 'bg-gradient-to-r from-amber-50 to-orange-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        status: t('contract-status.pending-user-signature'),
      };
    } else {
      return {
        bg: 'bg-gradient-to-r from-gray-50 to-slate-50',
        text: 'text-gray-700',
        border: 'border-gray-200',
        status: t('contract-status.pending-signatures'),
      };
    }
  };

  const getInvoiceStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return {
          bg: 'bg-gradient-to-r from-emerald-50 to-green-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          status: t('invoice-status.paid'),
        };
      case 'pending':
        return {
          bg: 'bg-gradient-to-r from-amber-50 to-orange-50',
          text: 'text-amber-700',
          border: 'border-amber-200',
          status: t('invoice-status.pending'),
        };
      case 'failed':
        return {
          bg: 'bg-gradient-to-r from-rose-50 to-red-50',
          text: 'text-rose-700',
          border: 'border-rose-200',
          status: t('invoice-status.failed'),
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-50 to-slate-50',
          text: 'text-gray-700',
          border: 'border-gray-200',
          status: t('invoice-status.unknown'),
        };
    }
  };

  const InfoCard = ({
    icon: Icon,
    title,
    value,
    gradient = false,
  }: {
    icon: any;
    title: string;
    value: string;
    gradient?: boolean;
  }) => (
    <div
      className={`relative overflow-hidden rounded-xl border p-4 transition-all duration-300 hover:shadow-md ${
        gradient
          ? 'border-[#15b7b9]/20 bg-gradient-to-br from-[#15b7b9]/5 to-white'
          : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`rounded-lg p-2 ${gradient ? 'bg-[#15b7b9]/10' : 'bg-gray-100'}`}
        >
          <Icon
            className={`h-5 w-5 ${gradient ? 'text-[#15b7b9]' : 'text-gray-600'}`}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 break-words font-medium text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push(`/${lng}/bookings`)}
            className="group flex items-center gap-2 rounded-lg px-3 py-2 text-gray-600 transition-all duration-300 hover:bg-[#15b7b9]/5 hover:text-[#15b7b9]"
          >
            <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
            {t('back-to-bookings')}
          </Button>

          <div
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} ${
              statusConfig.pulse ? 'animate-pulse' : ''
            }`}
          >
            <StatusIcon className="h-4 w-4" />
            {t(`status.${booking.status.toLowerCase()}`)}
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
          <div className="relative bg-gray-100 p-8">
            <div className="absolute inset-0 opacity-5">
              <div className="h-full w-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1)_2px,transparent_2px)] bg-[length:30px_30px]"></div>
            </div>
            <div className="relative z-10">
              <div className="flex items-start justify-between gap-6">
                <div className="flex items-start gap-6">
                  <div className="relative">
                    {getAvatar(24, booking.userImageUrl, booking.userName)}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold leading-tight text-gray-900">
                      {booking.name}
                    </h1>
                    <p className="mt-2 text-xl text-gray-600">
                      {t('client-label')}: {booking.userName}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {eventType && (
                        <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm shadow-sm">
                          {eventType.icon + ' '}
                          {eventType.label[lng] ||
                            eventType.label.en ||
                            t('eventType')}
                        </div>
                      )}
                      <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm shadow-sm">
                        {booking.isPublic ? (
                          <Eye className="h-4 w-4 text-gray-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-600" />
                        )}
                        {booking.isPublic
                          ? t('public-event')
                          : t('private-event')}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-4">
                  <Button
                    onClick={handleSendMessage}
                    variant="outline"
                    className="transform border-gray-200 bg-white px-4 py-2 text-gray-700 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:bg-gray-50 hover:shadow-md"
                  >
                    <MessageSquare className="mr-2 h-5 w-5" />
                    {t('sendMessage')}
                  </Button>
                  <div className="mt-8 text-2xl font-semibold text-[#15b7b9]">
                    {booking.cost.toLocaleString(lng, {
                      style: 'currency',
                      currency: 'EUR',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                {t('event-details')}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <InfoCard
                  icon={Calendar}
                  title={t('date')}
                  value={format(new Date(booking.initDate), 'PPP', {
                    locale: lng === 'es' ? es : ca,
                  })}
                  gradient
                />
                <InfoCard
                  icon={Clock}
                  title={t('time')}
                  value={`${format(new Date(booking.initDate), 'p')} - ${format(new Date(booking.endDate), 'p')}`}
                  gradient
                />
                <InfoCard
                  icon={Building2}
                  title={t('venue')}
                  value={booking.venue}
                  gradient
                />
                <div className="col-span-full">
                  <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-md">
                    <div className="flex items-start gap-6">
                      <div className="rounded-lg bg-gray-50 p-4">
                        <MapPin className="h-7 w-7 text-[#15b7b9]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {t('location')}
                        </h3>
                        <div className="mt-4 space-y-3">
                          <div className="rounded-lg bg-gray-50 p-4">
                            <p className="text-sm font-medium text-gray-500">
                              {t('address')}
                            </p>
                            <p className="mt-1 text-base text-gray-900">
                              {booking.addressLine1}
                              {booking.addressLine2 &&
                                `, ${booking.addressLine2}`}
                            </p>
                          </div>
                          <div className="flex gap-4">
                            <div className="flex-1 rounded-lg bg-gray-50 p-4">
                              <p className="text-sm font-medium text-gray-500">
                                {t('postal-code')}
                              </p>
                              <p className="mt-1 text-base text-gray-900">
                                {booking.postalCode}
                              </p>
                            </div>
                            <div className="flex-1 rounded-lg bg-gray-50 p-4">
                              <p className="text-sm font-medium text-gray-500">
                                {t('city')}
                              </p>
                              <p className="mt-1 text-base text-gray-900">
                                {booking.city}
                              </p>
                            </div>
                          </div>
                          <div className="rounded-lg bg-gray-50 p-4">
                            <p className="text-sm font-medium text-gray-500">
                              {t('country')}
                            </p>
                            <p className="mt-1 text-base text-gray-900">
                              {booking.country}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {contract && (
              <div className="mb-8">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">
                  {t('contract-details')}
                </h2>
                <div className="rounded-xl border border-gray-200 bg-white p-6">
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
                            locale: lng === 'es' ? es : ca,
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
                            {
                              getContractStatusConfig(
                                contract.userSigned,
                                contract.bandSigned,
                              ).status
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() =>
                        router.push(`/${lng}/documents/contract/${contract.id}`)
                      }
                      variant="outline"
                      className="border-[#15b7b9]/20 bg-white px-4 py-2 text-[#15b7b9] shadow-sm transition-all duration-300 hover:bg-[#15b7b9]/5 hover:shadow-md"
                    >
                      {t('view-contract')}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {invoice && (
              <div className="mb-8">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">
                  {t('invoice-details')}
                </h2>
                <div className="rounded-xl border border-gray-200 bg-white p-6">
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
                            locale: lng === 'es' ? es : ca,
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
                            {getInvoiceStatusConfig(invoice.status).status}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() =>
                        router.push(`/${lng}/documents/invoice/${invoice.id}`)
                      }
                      variant="outline"
                      className="border-[#15b7b9]/20 bg-white px-4 py-2 text-[#15b7b9] shadow-sm transition-all duration-300 hover:bg-[#15b7b9]/5 hover:shadow-md"
                    >
                      {t('view-invoice')}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {booking.status === BookingStatus.PENDING && (
                <div className="flex gap-4">
                  <Button
                    onClick={handleAccept}
                    disabled={processing}
                    variant="outline"
                    className="flex-1 transform border-emerald-200 bg-white px-4 py-2 text-emerald-600 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-md"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    {processing ? t('processing') : t('accept')}
                  </Button>
                  <Button
                    onClick={handleDecline}
                    disabled={processing}
                    variant="outline"
                    className="flex-1 transform border-rose-200 bg-white px-4 py-2 text-rose-600 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-rose-300 hover:bg-rose-50 hover:shadow-md"
                  >
                    <X className="mr-2 h-4 w-4" />
                    {processing ? t('processing') : t('decline')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
