'use client';

import { MapPin } from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';
import { ArtistDetails } from '@/service/backend/artist/domain/artistDetails';

export function ArtistBio({
  artist,
  language,
}: {
  artist: ArtistDetails;
  language: string;
}) {
  const { t } = useTranslation(language, 'artists');

  const hasBio = artist.bio && artist.bio.trim().length > 0;

  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <div className="relative mb-6">
        <div className="absolute left-0 top-0 h-8 w-1 rounded-full bg-gradient-to-b from-[#15b7b9] to-teal-200"></div>
        <h3 className="ml-4 text-xl font-bold text-gray-800">
          {t('biography')}
        </h3>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-gray-700">
        {hasBio ? (
          artist.bio
        ) : (
          <span className="italic text-gray-400">{t('noBio')}</span>
        )}
      </p>

      <div className="flex items-center text-xs text-gray-500">
        <MapPin className="mr-1.5 h-4 w-4" />
        <span>
          {t('basedIn')} {artist.location}
        </span>
      </div>
    </div>
  );
}
