import React from 'react';
import { Artist } from '@/service/backend/artist/artist.service';
import ArtistCard from './artistCard';

interface ArtistsGridProps {
  artists: Artist[];
  language: string;
}

const ArtistsGrid: React.FC<ArtistsGridProps> = ({ artists, language }) => (
  <div className="transition-fade grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {artists.map((artist) => (
      <ArtistCard key={artist.id} artist={artist} language={language} />
    ))}
  </div>
);

export default ArtistsGrid;
