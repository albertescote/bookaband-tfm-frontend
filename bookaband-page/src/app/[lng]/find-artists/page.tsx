import { fetchFilteredArtists } from '@/service/backend/artist/service/artist.service';
import FindArtistsContent from '@/components/find-artists/find-artists-content';
import Error from '@/components/shared/error';
import { getTranslation } from '@/app/i18n';
import { fetchMusicalStyles } from '@/service/backend/musicalStyle/service/musicalStyle.service';
import { fetchEventTypes } from '@/service/backend/filters/service/eventType.service';

interface PageParams {
  params: Promise<{
    lng: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | undefined }>;
}

export default async function Page({ params, searchParams }: PageParams) {
  const { lng } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const { t } = await getTranslation(lng, 'profile');

  const location = resolvedSearchParams?.location
    ? decodeURIComponent(resolvedSearchParams.location)
    : '';
  const date = resolvedSearchParams?.date
    ? decodeURIComponent(resolvedSearchParams.date)
    : '';
  const timezone = resolvedSearchParams?.timezone
    ? decodeURIComponent(resolvedSearchParams.timezone)
    : '';
  const artistName = resolvedSearchParams?.artistName
    ? decodeURIComponent(resolvedSearchParams.artistName)
    : '';

  const hasSearched = !!(
    resolvedSearchParams?.location ||
    resolvedSearchParams?.date ||
    resolvedSearchParams?.artistName
  );
  const [data, musicalStyles, eventTypes] = await Promise.all([
    fetchFilteredArtists(
      1,
      8,
      hasSearched ? { location, date, timezone, artistName } : {},
    ),
    fetchMusicalStyles(),
    fetchEventTypes(),
  ]);

  if (
    !musicalStyles ||
    !eventTypes ||
    !data ||
    'error' in data ||
    'error' in musicalStyles ||
    'error' in eventTypes
  ) {
    return (
      <Error
        title={t('errorScreen.title')}
        description={t('errorScreen.description')}
        buttonText={t('errorScreen.retry')}
      ></Error>
    );
  }

  return (
    <div className="min-h-screen">
      <FindArtistsContent
        language={lng}
        initialData={data}
        musicalStyles={musicalStyles}
        eventTypes={eventTypes}
        hasSearchedInitial={hasSearched}
        initialFilters={{ location, date, timezone, artistName }}
      />
    </div>
  );
}
