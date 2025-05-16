import { notFound } from 'next/navigation';
import { fetchArtistDetailsById } from '@/service/backend/artist/service/artist.service';
import { ArtistSidebar } from '@/components/artists/artistSidebar';
import { ArtistBio } from '@/components/artists/artistBio';
import { ArtistMediaTabs } from '@/components/artists/artistMediaTab';
import { ArtistSpotifySection } from '@/components/artists/artistSpotifySection';
import { fetchEventTypes } from '@/service/backend/filters/service/eventType.service';

export default async function ArtistProfilePage({
  params,
}: {
  params: { lng: string; id: string };
}) {
  const artist = await fetchArtistDetailsById(params.id);
  if (!artist || 'error' in artist) return notFound();

  const eventTypes = await fetchEventTypes();
  if (!eventTypes || 'error' in eventTypes) {
    return notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="w-full md:w-1/4">
          <ArtistSidebar artist={artist} language={params.lng} />
        </div>
        <div className="flex-1">
          <ArtistBio artist={artist} language={params.lng} />
          <ArtistSpotifySection artist={artist} />
          <ArtistMediaTabs
            artist={artist}
            language={params.lng}
            eventTypes={eventTypes}
          />
        </div>
      </div>
    </div>
  );
}
