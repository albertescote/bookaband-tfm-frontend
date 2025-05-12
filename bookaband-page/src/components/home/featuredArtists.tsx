'use client';

import { useTranslation } from '@/app/i18n/client';
import { fetchFeaturedArtists } from '@/service/backend/artist/service/artist.service';
import { useEffect, useState } from 'react';
import { OfferOverview } from '@/service/backend/artist/domain/offerOverview';

interface FeaturedArtistsParams {
  lng: string;
}

export default function FeaturedArtists({ lng }: FeaturedArtistsParams) {
  const { t } = useTranslation(lng, 'home');
  const [artists, setArtists] = useState<OfferOverview[]>([]);

  useEffect(() => {
    fetchFeaturedArtists(1, 3).then((result) => {
      setArtists(result.offers);
    });
  }, []);

  return (
    <section className="py-16">
      <h2 className="mb-12 text-center text-3xl font-bold">
        {t('featured-musicians-title')}
      </h2>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
        {artists.map((artist, index) => (
          <div
            key={index}
            className="flex h-full flex-col rounded-lg border p-6 text-left"
          >
            <img
              src={artist.imageUrl}
              alt={artist.bandName}
              className="mb-6 h-80 w-full rounded-lg object-cover"
            />
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <h3 className="mb-2 text-xl font-semibold">
                  {artist.bandName}
                </h3>
                <p className="mb-1 text-gray-500">{`${t('genre')}: ${artist.genre}`}</p>
                <p className="mb-4">{artist.description}</p>
              </div>
              <button className="w-full rounded-lg border border-[#15b7b9] px-4 py-2 text-[#15b7b9] hover:bg-[#15b7b9] hover:text-white">
                {t('view-profile')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
