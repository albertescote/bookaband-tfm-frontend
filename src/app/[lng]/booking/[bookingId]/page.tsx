import { useTranslation } from '@/app/i18n';
import BookingDetails from '@/components/booking/bookingDetails';
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
  const { t } = await useTranslation(lng, 'booking');
  const booking = await getBookingById(bookingId);

  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-gradient-to-r from-[#e6f0ff] to-[#e6f8ff] p-4 py-12">
      <div className="w-full min-w-[90vh] max-w-md transform rounded-2xl bg-white p-8 shadow-lg">
        {booking ? (
          <BookingDetails language={lng} booking={booking}></BookingDetails>
        ) : (
          <h1 className="text-center">{t('booking-not-found')}</h1>
        )}
      </div>
    </div>
  );
}
