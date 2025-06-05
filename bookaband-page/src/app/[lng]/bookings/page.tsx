import { getTranslation } from '@/app/i18n';
import { getAllUserBookings } from '@/service/backend/booking/service/booking.service';
import { BookingForm } from '@/components/bookings/bookingForm';
import Error from '@/components/shared/error';
import { fetchArtistDetailsById } from '@/service/backend/artist/service/artist.service';
import { fetchEventTypes } from '@/service/backend/filters/service/eventType.service';
import BookingsList from '@/components/bookings/bookingsList';

interface PageParams {
  params: {
    lng: string;
  };
  searchParams: {
    band_id?: string;
  };
}

export default async function BookingsPage({
  params: { lng },
  searchParams,
}: PageParams) {
  const { t } = await getTranslation(lng, 'bookings');
  const showCreateForm = searchParams.band_id !== undefined;

  if (showCreateForm) {
    const [artist, eventTypes] = await Promise.all([
      fetchArtistDetailsById(searchParams.band_id!),
      fetchEventTypes(),
    ]);

    if (!artist || 'error' in artist || !eventTypes || 'error' in eventTypes) {
      return (
        <Error
          title={t('errorScreen.title')}
          description={t('errorScreen.description')}
          buttonText={t('errorScreen.retry')}
        />
      );
    }

    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          {t('createBooking')}
        </h1>
        <BookingForm artist={artist} language={lng} eventTypes={eventTypes} />
      </div>
    );
  }

  const bookings = await getAllUserBookings();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <BookingsList language={lng} bookings={bookings || []} />
    </div>
  );
}
