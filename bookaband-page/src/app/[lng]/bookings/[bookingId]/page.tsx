import { getTranslation } from '@/app/i18n';
import BookingDetails from '@/components/booking/bookingDetails';
import { fetchEventTypes } from '@/service/backend/filters/service/eventType.service';
import { getBookingById } from '@/service/backend/booking/service/booking.service';

interface PageParams {
  params: {
    lng: string;
    bookingId: string;
  };
}

export default async function BookingPage({
  params: { lng, bookingId },
}: PageParams) {
  const { t } = await getTranslation(lng, 'booking');
  const [eventTypes, booking] = await Promise.all([
    fetchEventTypes(),
    getBookingById(bookingId),
  ]);

  if (!eventTypes || 'error' in eventTypes) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-center text-xl font-semibold text-gray-900">
            {t('error-loading')}
          </h1>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-center text-xl font-semibold text-gray-900">
            {t('booking-not-found')}
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <BookingDetails
          language={lng}
          eventTypes={eventTypes}
          initialBooking={booking}
        />
      </div>
    </div>
  );
}
