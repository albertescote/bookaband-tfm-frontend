import { getTranslation } from '@/app/i18n';
import { fetchArtistDetailsById } from '@/service/backend/artist/service/artist.service';
import { BookingForm } from '@/components/bookings/bookingForm';
import Error from '@/components/shared/error';
import { fetchEventTypes } from '@/service/backend/filters/service/eventType.service';

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: { lng: string };
  searchParams: { band_id: string };
}) {
  const { t } = await getTranslation(params.lng, 'bookings');

  if (!searchParams.band_id) {
    return (
      <Error
        title={t('errorScreen.title')}
        description={t('errorScreen.noArtist')}
        buttonText={t('errorScreen.retry')}
      />
    );
  }

  const [artist, eventTypes] = await Promise.all([
    fetchArtistDetailsById(searchParams.band_id),
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
      <BookingForm
        artist={artist}
        language={params.lng}
        eventTypes={eventTypes}
      />
    </div>
  );
}
