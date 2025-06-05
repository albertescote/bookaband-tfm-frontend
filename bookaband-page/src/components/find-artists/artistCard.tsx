import React from 'react';
import { MapPin, Music, Star, Users } from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';
import { BandCatalogItem } from '@/service/backend/artist/domain/bandCatalogItem';
import { useRouter } from 'next/navigation';
import { MusicalStyle } from '@/service/backend/musicalStyle/domain/musicalStyle';
import { EventType } from '@/service/backend/filters/domain/eventType';
import { BandSize } from '@/service/backend/artist/domain/bandSize';

interface ArtistCardProps {
  artist: BandCatalogItem;
  musicalStyles: MusicalStyle[];
  eventTypes: EventType[];
  language: string;
  searchParams?: { location?: string; date?: string };
}

const ArtistCard: React.FC<ArtistCardProps> = ({
  artist,
  musicalStyles,
  eventTypes,
  language,
  searchParams,
}) => {
  const { t } = useTranslation(language, 'find-artists');
  const router = useRouter();

  const getMusicalStyleLabel = (styleId: string) => {
    const style = musicalStyles.find((s) => s.id === styleId);
    return style ? style.label[language] || style.label['en'] : styleId;
  };

  const getMusicalStyleIcon = (styleId: string) => {
    const style = musicalStyles.find((s) => s.id === styleId);
    return style ? style.icon : '🎵';
  };

  const getEventTypeIcon = (eventTypeId: string) => {
    const eventType = eventTypes.find((s) => s.id === eventTypeId);
    return eventType ? eventType.icon : '📍';
  };

  const getEventTypeLabel = (typeId: string) => {
    const type = eventTypes.find((t) => t.id === typeId);
    return type ? type.label[language] || type.label['en'] : typeId;
  };

  const getBandSizeLabel = (size: BandSize) => {
    switch (size) {
      case BandSize.SOLO:
        return 'Solo';
      case BandSize.DUO:
        return 'Duo';
      case BandSize.TRIO:
        return 'Trio';
      case BandSize.BAND:
        return 'Band (4+)';
      default:
        return size;
    }
  };

  return (
    <div className="group overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={artist.imageUrl}
          alt={artist.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {artist.featured && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-[#15b7b9] px-3 py-1 text-xs font-semibold text-white shadow">
            {t('featured-artist')}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="mb-2 text-lg font-semibold text-[#565d6d] group-hover:text-[#15b7b9]">
          {artist.name}
        </h3>

        {/* Musical Styles Tags */}
        <div className="mb-3 flex flex-wrap gap-2">
          {artist.musicalStyleIds.length > 0 ? (
            artist.musicalStyleIds.map((styleId) => (
              <span
                key={styleId}
                className="inline-flex items-center gap-1 rounded-full bg-[#15b7b9]/10 px-3 py-1 text-xs font-medium text-[#15b7b9]"
              >
                <span>{getMusicalStyleIcon(styleId)}</span>
                <span>{getMusicalStyleLabel(styleId)}</span>
              </span>
            ))
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              <Music className="h-3 w-3" />
              {t('no-genre')}
            </span>
          )}
        </div>

        {/* Band Size */}
        <div className="mb-3 flex items-center gap-1 text-xs text-gray-600">
          <Users className="h-3 w-3" />
          {getBandSizeLabel(artist.bandSize)}
        </div>

        {/* Event Types */}
        <div className="mb-3 flex flex-wrap gap-2">
          {artist.eventTypeIds.length > 0 ? (
            artist.eventTypeIds.map((typeId) => (
              <span
                key={typeId}
                className="inline-flex items-center gap-1 rounded-full bg-[#15b7b9]/10 px-3 py-1 text-xs font-medium text-[#15b7b9]"
              >
                <span>{getEventTypeIcon(typeId)}</span>
                <span>{getEventTypeLabel(typeId)}</span>
              </span>
            ))
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              {t('no-event-types')}
            </span>
          )}
        </div>

        {/* Location */}
        <div className="mb-3 flex items-center gap-1 text-xs text-gray-600">
          <MapPin className="h-3 w-3" />
          {artist.location}
        </div>

        {/* Rating */}
        <div className="mb-3 flex items-center gap-1 text-sm">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium text-gray-800">{artist.rating}</span>
          <span className="text-xs text-gray-500">
            ({artist.reviewCount} {t('reviews')})
          </span>
        </div>

        {/* Price and View Profile */}
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

          <button
            onClick={() => {
              const url = searchParams
                ? `/${language}/artists/${artist.id}?location=${searchParams.location}&date=${searchParams.date}`
                : `/${language}/artists/${artist.id}`;
              router.push(url);
            }}
            className="rounded-full bg-[#15b7b9]/10 px-4 py-1.5 text-sm font-medium text-[#15b7b9] transition-colors hover:bg-[#15b7b9]/20"
          >
            {t('view-profile')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;
