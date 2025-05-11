import React from 'react';
import { Artist } from '@/service/backend/artist/artist.service';
import ArtistCard from './artistCard';
import NoResults from './noResults';

interface ArtistsGridProps {
  artists: Artist[];
  language: string;
  hasSearched?: boolean;
}

const ArtistsGrid: React.FC<ArtistsGridProps> = ({ artists, language, hasSearched = false }) => {
  if (!artists || artists.length === 0) {
    return (
      <div className="w-full">
        <NoResults language={language} type={hasSearched ? 'search' : 'filter'} />
      </div>
    );
  }

  return (
    <div className="transition-fade grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {artists.map((artist) => (
        <ArtistCard key={artist.id} artist={artist} language={language} />
      ))}
    </div>
  );
};

export default ArtistsGrid;
