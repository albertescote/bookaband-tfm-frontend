import React, { useEffect, useState } from 'react';
import { Globe, MapPin, Music, Star, Users } from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';
import { BandCatalogItem } from '@/service/backend/artist/domain/bandCatalogItem';
import { useRouter } from 'next/navigation';
import { MusicalStyle } from '@/service/backend/musicalStyle/domain/musicalStyle';
import { EventType } from '@/service/backend/filters/domain/eventType';
import { BandSize } from '@/service/backend/artist/domain/bandSize';
import Image from 'next/image';
import { getRandomColor } from '@/lib/utils';

interface ArtistCardProps {
  artist: BandCatalogItem;
  musicalStyles: MusicalStyle[];
  eventTypes: EventType[];
  language: string;
  searchParams?: { location?: string; date?: string };
}

interface GooglePlaceResult {
  name?: string;
  [key: string]: any;
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
  const [performanceAreas, setPerformanceAreas] = useState<string[]>([]);

  useEffect(() => {
    const convertPlaceIdsToNames = async () => {
      if (!artist.performanceArea?.regions?.length) return;

      const placesService = new window.google.maps.places.PlacesService(
        document.createElement('div'),
      );

      const placeNames = await Promise.all(
        artist.performanceArea.regions.map(
          (placeId) =>
            new Promise<string>((resolve) => {
              placesService.getDetails(
                { placeId },
                (place: GooglePlaceResult | null, status: string) => {
                  if (
                    status ===
                      window.google.maps.places.PlacesServiceStatus.OK &&
                    place
                  ) {
                    resolve(place.name || placeId);
                  } else {
                    resolve(placeId);
                  }
                },
              );
            }),
        ),
      );

      setPerformanceAreas(placeNames);
    };

    if (window.google?.maps?.places) {
      convertPlaceIdsToNames();
    }
  }, [artist.performanceArea?.regions]);

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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = Math.max(0, Math.min(5, rating - index));
      const isHalfStar = starValue > 0 && starValue < 1;
      const isFullStar = starValue >= 1;

      return (
        <div key={index} className="relative h-4 w-4">
          <Star className="absolute h-4 w-4 text-gray-300" />
          {isFullStar && (
            <Star className="absolute h-4 w-4 fill-yellow-400 text-yellow-400" />
          )}
          {isHalfStar && (
            <Star
              className="absolute h-4 w-4 fill-yellow-400 text-yellow-400"
              style={{ clipPath: 'inset(0 50% 0 0)' }}
            />
          )}
        </div>
      );
    });
  };

  return (
    <div
      onClick={() => {
        const url = searchParams
          ? `/${language}/artists/${artist.id}?location=${searchParams.location}&date=${searchParams.date}`
          : `/${language}/artists/${artist.id}`;
        router.push(url);
      }}
      className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:scale-[1.02] hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden">
        {artist.imageUrl ? (
          <div className={`relative h-full w-full`}>
            <Image
              src={artist.imageUrl ?? ''}
              alt={artist.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center shadow-sm`}
            style={{
              backgroundColor: getRandomColor(artist.name ?? 'dummy'),
            }}
          >
            <span className={`font-bold text-white`}>
              {artist.name ? artist.name.charAt(0).toUpperCase() : '?'}
            </span>
          </div>
        )}
        {artist.featured && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-[#15b7b9] px-3 py-1 text-xs font-semibold text-white shadow">
            {t('featured-artist')}
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#565d6d] group-hover:text-[#15b7b9]">
            {artist.name}
          </h3>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <MapPin className="h-3 w-3" />
            {artist.location}
          </div>
        </div>

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

        <div className="mb-3 flex items-center gap-1 text-xs text-gray-600">
          <Users className="h-3 w-3" />
          {getBandSizeLabel(artist.bandSize)}
        </div>

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

        {performanceAreas.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Globe className="h-3 w-3" />
              <span>{t('performance-areas')}:</span>
            </div>
            {performanceAreas.map((area, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 rounded-full bg-[#15b7b9]/10 px-3 py-1 text-xs font-medium text-[#15b7b9]"
              >
                {area}
              </span>
            ))}
          </div>
        )}

        <div className="mb-3 flex items-center gap-1 text-sm">
          <div className="flex">{renderStars(artist.rating ?? 0)}</div>
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
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;
