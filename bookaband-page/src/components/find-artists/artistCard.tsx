import React from 'react';
import { MapPin, Music, Star } from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';
import { OfferDetails } from '@/service/backend/artist/domain/offerDetails';

interface ArtistCardProps {
  artist: OfferDetails;
  language: string;
}

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const ArtistCard: React.FC<ArtistCardProps> = ({ artist, language }) => {
  const { t } = useTranslation(language, 'find-artists');

  return (
    <div className="group overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={artist.imageUrl}
          alt={artist.bandName}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {artist.featured && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-[#15b7b9] px-3 py-1 text-xs font-semibold text-white shadow">
            {t('featured-artist')}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="mb-1 text-lg font-semibold text-[#565d6d] group-hover:text-[#15b7b9]">
          {artist.bandName}
        </h3>
        <div className="mb-3 flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-gray-600">
            <Music className="h-3 w-3" />
            {capitalizeFirstLetter(artist.genre)}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-600">
            <MapPin className="h-3 w-3" />
            {artist.location}
          </span>
        </div>
        <div className="mb-3 flex items-center gap-1 text-sm">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium text-gray-800">{artist.rating}</span>
          <span className="text-xs text-gray-500">
            ({artist.reviewCount} {t('reviews')})
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span
            className={`text-lg font-semibold text-[#15b7b9] ${
              !artist.price ? 'invisible' : ''
            }`}
          >
            <span className="mr-2 text-xs font-normal text-gray-500">
              {t('from')}
            </span>
            {artist.price} €
          </span>

          <button className="rounded-full bg-[#15b7b9]/10 px-4 py-1.5 text-sm font-medium text-[#15b7b9] transition-colors hover:bg-[#15b7b9]/20">
            {t('view-profile')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;
