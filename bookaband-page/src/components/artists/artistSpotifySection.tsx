'use client';

import { ArtistDetails } from '@/service/backend/artist/domain/artist';
import { getSpotifyEmbedUrl } from '@/lib/social/getSpotifyEmbedUrl';
import { SpotifyEmbed } from '@/components/artists/spotifyEmbed';

export function ArtistSpotifySection({ artist }: { artist: ArtistDetails }) {
  const spotify = artist.socialLinks?.find(
    (link) => link.platform.toLowerCase() === 'spotify',
  );

  if (!spotify) return null;

  const embedUrl = getSpotifyEmbedUrl(spotify.url);
  if (!embedUrl) return null;

  return (
    <div className="py-2">
      <SpotifyEmbed embedUrl={embedUrl} />
    </div>
  );
}
