import React from 'react';
import ArtistCard from './artistCard';
import NoResults from './noResults';
import { BandCatalogItem } from '@/service/backend/artist/domain/bandCatalogItem';
import { MusicalStyle } from '@/service/backend/musicalStyle/domain/musicalStyle';
import { EventType } from '@/service/backend/filters/domain/eventType';

interface ArtistsGridProps {
  artists: BandCatalogItem[];
  musicalStyles: MusicalStyle[];
  eventTypes: EventType[];
  language: string;
  hasSearched?: boolean;
  searchParams?: { location?: string; date?: string };
}

const ArtistsGrid: React.FC<ArtistsGridProps> = ({
  artists,
  musicalStyles,
  eventTypes,
  language,
  hasSearched = false,
  searchParams,
}) => {
  if (!artists || artists.length === 0) {
    return (
      <div className="w-full">
        <NoResults
          language={language}
          type={hasSearched ? 'search' : 'filter'}
        />
      </div>
    );
  }

  return (
    <div className="transition-fade grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {artists.map((artist) => (
        <ArtistCard
          key={artist.id}
          artist={artist}
          musicalStyles={musicalStyles}
          eventTypes={eventTypes}
          language={language}
          searchParams={searchParams}
        />
      ))}
    </div>
  );
};

export default ArtistsGrid;
