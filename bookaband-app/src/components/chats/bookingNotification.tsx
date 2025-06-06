import React from 'react';
import { format } from 'date-fns';
import { ca, es } from 'date-fns/locale';
import { useTranslation } from '@/app/i18n/client';
import { BookingStatus } from '@/service/backend/booking/domain/booking';
import { ArrowRight, Calendar, ClipboardList, MapPin } from 'lucide-react';
import Link from 'next/link';

interface BookingNotificationProps {
  metadata: {
    bookingId?: string;
    bookingStatus?: BookingStatus;
    eventName?: string;
    eventDate?: string | Date;
    venue?: string;
    city?: string;
  };
  language: string;
}

const BookingNotification: React.FC<BookingNotificationProps> = ({
  metadata,
  language,
}) => {
  const { t } = useTranslation(language, 'chat');

  const getStatusColor = (status?: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case BookingStatus.ACCEPTED:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case BookingStatus.DECLINED:
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case BookingStatus.CANCELED:
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status?: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING:
        return t('pending');
      case BookingStatus.ACCEPTED:
        return t('accepted');
      case BookingStatus.DECLINED:
        return t('declined');
      case BookingStatus.CANCELED:
        return t('canceled');
      default:
        return status;
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-xl border border-[#15b7b9]/20 bg-gradient-to-br from-[#15b7b9]/5 to-white p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-[#15b7b9]/10 p-1.5">
            <ClipboardList className="h-4 w-4 text-[#15b7b9]" />
          </div>
          <h4 className="text-base font-semibold text-[#15b7b9]">
            {t('new-booking')}
          </h4>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(
            metadata.bookingStatus,
          )}`}
        >
          {getStatusText(metadata.bookingStatus)}
        </span>
      </div>

      <div className="mt-3">
        <div className="rounded-lg bg-white/50 p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-gray-900">
                {metadata.eventName}
              </h3>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-600">
                {metadata.eventDate && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-[#15b7b9]" />
                    <span className="text-xs">
                      {format(
                        metadata.eventDate instanceof Date
                          ? metadata.eventDate
                          : new Date(metadata.eventDate),
                        'PPP',
                        {
                          locale: language === 'es' ? es : ca,
                        },
                      )}
                    </span>
                  </div>
                )}

                {metadata.venue && metadata.city && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-[#15b7b9]" />
                    <span className="text-xs">
                      {metadata.venue}, {metadata.city}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {metadata.bookingId && (
              <Link
                href={`/${language}/bookings/${metadata.bookingId}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#15b7b9] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#0f8a8c]"
              >
                {t('viewDetails')}
                <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingNotification;
