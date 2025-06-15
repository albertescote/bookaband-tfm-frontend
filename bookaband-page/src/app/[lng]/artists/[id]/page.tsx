import { fetchArtistDetailsById } from '@/service/backend/artist/service/artist.service';
import { ArtistSidebar } from '@/components/artists/artistSidebar';
import { ArtistBio } from '@/components/artists/artistBio';
import { ArtistSpotifySection } from '@/components/artists/artistSpotifySection';
import { fetchEventTypes } from '@/service/backend/filters/service/eventType.service';
import { fetchMusicalStyles } from '@/service/backend/musicalStyle/service/musicalStyle.service';
import Error from '@/components/shared/error';
import { getTranslation } from '@/app/i18n';
import { SearchSummary } from '@/components/artists/searchSummary';
import { ArtistContentsTab } from '@/components/artists/artistContentTabs';

export default async function ArtistProfilePage({
  params,
  searchParams,
}: {
  params: { lng: string; id: string };
  searchParams?: { location: string; date: string };
}) {
  const { t } = await getTranslation(params.lng, 'artists');

  const [artist, musicalStyles, eventTypes] = await Promise.all([
    fetchArtistDetailsById(params.id),
    fetchMusicalStyles(),
    fetchEventTypes(),
  ]);

  if (
    !musicalStyles ||
    !eventTypes ||
    !artist ||
    'error' in artist ||
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

  const hasSearchParams = searchParams?.location || searchParams?.date;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {hasSearchParams && (
        <SearchSummary
          location={searchParams.location}
          date={searchParams.date}
          language={params.lng}
        />
      )}
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="w-full md:w-1/4">
          <ArtistSidebar
            artist={artist}
            language={params.lng}
            musicalStyles={musicalStyles}
            eventTypes={eventTypes}
            searchParams={hasSearchParams ? searchParams : undefined}
          />
        </div>
        <div className="flex-1">
          <ArtistBio artist={artist} language={params.lng} />
          <ArtistSpotifySection artist={artist} />
          <ArtistContentsTab
            artist={artist}
            language={params.lng}
            eventTypes={eventTypes}
          />
        </div>
      </div>
    </div>
  );
}
