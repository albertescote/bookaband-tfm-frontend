'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/authProvider';
import { useTranslation } from '@/app/i18n/client';
import {
  acceptBooking,
  declineBooking,
} from '@/service/backend/booking/service/booking.service';
import { BookingStatus } from '@/service/backend/booking/domain/booking';
import { BookingSummary } from '@/service/backend/booking/domain/bookingSummary';
import { format } from 'date-fns';
import { ca, es } from 'date-fns/locale';
import {
  Building2,
  Calendar,
  Clock,
  MapPin,
  MessageSquare,
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
    } catch (error) {
      console.error('Error declining booking:', error);
      toast.error(t('error-declining-booking'));
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case BookingStatus.ACCEPTED:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case BookingStatus.DECLINED:
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case BookingStatus.CANCELED:
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getEventType = (eventTypeId?: string) => {
    if (!eventTypeId) return null;
    return eventTypes.find((type) => type.id === eventTypeId);
  };

  const eventType = getEventType(booking.eventTypeId);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push(`/${lng}/bookings`)}
          className="group flex items-center gap-2 text-gray-600 transition-colors hover:text-[#15b7b9]"
        >
          <svg
            className="h-5 w-5 transition-transform group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          {t('back-to-bookings')}
        </Button>
        <span
          className={`rounded-full border px-4 py-1.5 text-sm font-medium ${getStatusColor(
            booking.status,
          )}`}
        >
          {t(`status.${booking.status.toLowerCase()}`)}
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
        <div className="border-b border-gray-100 bg-gradient-to-r from-[#15b7b9]/5 to-white p-8">
          <div className="flex items-start gap-6">
            {getAvatar(20, booking.userImageUrl, booking.userName)}
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">
                {booking.name}
              </h1>
              <p className="mt-1 text-lg text-gray-600">{booking.userName}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Event Details Section */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-[#15b7b9]">
              {t('event-details')}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="rounded-full bg-[#15b7b9]/10 p-2">
                  <Calendar className="h-5 w-5 text-[#15b7b9]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">
                    {t('date')}
                  </span>
                  <span>
                    {format(new Date(booking.initDate), 'PPP', {
                      locale: lng === 'es' ? es : ca,
                    })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <div className="rounded-full bg-[#15b7b9]/10 p-2">
                  <Clock className="h-5 w-5 text-[#15b7b9]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">
                    {t('time')}
                  </span>
                  <span>
                    {format(new Date(booking.initDate), 'p')} -{' '}
                    {format(new Date(booking.endDate), 'p')}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <div className="rounded-full bg-[#15b7b9]/10 p-2">
                  <Building2 className="h-5 w-5 text-[#15b7b9]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">
                    {t('venue')}
                  </span>
                  <span>{booking.venue}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <div className="rounded-full bg-[#15b7b9]/10 p-2">
                  <MapPin className="h-5 w-5 text-[#15b7b9]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">
                    {t('location')}
                  </span>
                  <span>{booking.city}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Section */}
          {booking.status === BookingStatus.PENDING && (
            <div className="flex gap-4">
              <Button
                onClick={handleAccept}
                disabled={processing}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                {t('accept')}
              </Button>
              <Button
                onClick={handleDecline}
                disabled={processing}
                variant="destructive"
                className="flex-1"
              >
                {t('decline')}
              </Button>
            </div>
          )}

          {/* Message Button */}
          <Button
            onClick={handleSendMessage}
            variant="outline"
            className="flex items-center justify-center gap-2"
          >
            <MessageSquare className="h-5 w-5" />
            {t('send-message')}
          </Button>
        </div>
      </div>
    </div>
  );
}
