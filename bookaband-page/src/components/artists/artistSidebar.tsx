'use client';

import {
  Ban,
  Calendar,
  Facebook,
  Flag,
  Instagram,
  Mail,
  MapPin,
  Music,
  Star,
  Twitter,
  Youtube,
} from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';
import { Button } from '@/components/shared/button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/authProvider';
import { useState } from 'react';
import { formatNumberShort } from '@/lib/format';
import { ArtistDetails } from '@/service/backend/artist/domain/artistDetails';

export function ArtistSidebar({
  artist,
  language,
}: {
  artist: ArtistDetails;
  language: string;
}) {
  const { t } = useTranslation(language, 'artists');
  const { user } = useAuth();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const followers = artist.followers || Math.floor(Math.random() * 2000 + 100);
  const following = artist.following || Math.floor(Math.random() * 100 + 10);

  const handle = artist.bandName.toLowerCase().replace(/\s/g, '');

  const genres = artist.genre
    .split(',')
    .slice(0, 4)
    .map((g) => g.trim());

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
      {/* Artist Header */}
      <div className="flex flex-col items-center">
        {/* Avatar with hover effect */}
        <div
          className="relative mb-4 h-28 w-28 overflow-hidden rounded-full shadow-md ring-4 ring-white transition-transform duration-300 hover:scale-105"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {artist.imageUrl ? (
            <img
              src={artist.imageUrl}
              alt={artist.bandName}
              className={`h-full w-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : ''}`}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-400 to-blue-500">
              <Music className="h-12 w-12 text-white" />
            </div>
          )}
        </div>

        {/* Name & Handle with improved typography */}
        <h2 className="text-2xl font-bold text-gray-800">{artist.bandName}</h2>
        <p className="mb-3 flex items-center text-sm text-gray-500">
          @{handle}
        </p>

        {/* Location - Added for more context */}
        <div className="mb-4 flex items-center justify-center text-sm text-gray-600">
          <MapPin className="mr-1 h-3 w-3" />
          <span>{artist.location || 'Worldwide'}</span>
          <span className="mx-2">•</span>
          <Calendar className="mr-1 h-3 w-3" />
          <span>
            {t('since')} {new Date(artist.createdDate).getFullYear()}
          </span>
        </div>

        {/* CTA Buttons with improved styling */}
        <div className="w-full space-y-2">
          <Button
            className="w-full bg-[#15b7b9] py-2 font-medium text-white hover:bg-[#15b7b9]/90"
            onClick={() => {
              router.push(
                `/${language}/bookings?band_id=${encodeURIComponent(artist.bandId)}`,
              );
            }}
          >
            {t('hire')}
          </Button>
          <Button
            variant="outline"
            className="w-full border-gray-300 py-2 font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => {
              router.push(
                `/${language}/chats?band_id=${encodeURIComponent(artist.bandId)}`,
              );
            }}
          >
            <Mail className="mr-2 h-4 w-4 text-teal-500" /> {t('sendMessage')}
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-6 rounded-lg bg-gray-50 p-3">
        <div className="grid grid-cols-3 divide-x divide-gray-200 text-center">
          {/* Followers */}
          <div className="px-2">
            <span className="block text-lg font-bold text-gray-800">
              {formatNumberShort(followers)}
            </span>
            <span className="block break-words text-xs leading-snug text-gray-500">
              {t('followers')}
            </span>
          </div>

          {/* Following */}
          <div className="px-2">
            <span className="block text-lg font-bold text-gray-800">
              {formatNumberShort(following)}
            </span>
            <span className="block break-words text-xs leading-snug text-gray-500">
              {t('following')}
            </span>
          </div>

          {/* Rating */}
          <div className="px-2">
            <div className="flex items-center justify-center">
              <span className="text-lg font-bold text-gray-800">4.8</span>
              <Star className="ml-1 h-3 w-3 text-yellow-500" fill="#f59e0b" />
            </div>
            <span className="block break-words text-xs leading-snug text-gray-500">
              {t('rating') || 'Rating'}
            </span>
          </div>
        </div>
      </div>

      {/* Musical Style Tags */}
      <div className="mt-5">
        <p className="mb-2 text-sm font-medium text-gray-700">{t('style')}</p>
        <div className="flex flex-wrap gap-2">
          {genres.map((style) => (
            <span
              key={style}
              className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-[#15b7b9] transition-colors hover:bg-teal-100"
            >
              {style}
            </span>
          ))}
        </div>
      </div>

      {/* Price Card */}
      {user && (
        <div className="mt-5 rounded-lg bg-gray-50 p-4">
          <p className="mb-1 text-sm font-medium text-gray-700">{t('price')}</p>
          <div className="flex items-baseline justify-between">
            <span className="ml-1 text-xs text-gray-500">
              {t('startingFrom')}
            </span>
            <p className="text-2xl font-bold text-[#15b7b9]">
              {artist.price} €
            </p>
          </div>
        </div>
      )}

      {artist.socialLinks?.some((link) =>
        ['instagram', 'twitter', 'facebook', 'youtube'].includes(
          link.platform.toLowerCase(),
        ),
      ) && (
        <div className="mt-4">
          <p className="mb-4 text-sm font-medium text-gray-700">
            {t('followMe')}
          </p>
          <div className="flex gap-3">
            {artist.socialLinks.map((link) => {
              const platform = link.platform.toLowerCase();
              const iconSize = 18;

              const iconMap: Record<string, JSX.Element> = {
                instagram: <Instagram size={iconSize} />,
                twitter: <Twitter size={iconSize} />,
                facebook: <Facebook size={iconSize} />,
                youtube: <Youtube size={iconSize} />,
              };

              if (!iconMap[platform]) return null;

              return (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-gray-100 p-2 transition hover:bg-[#15b7b9] hover:text-white"
                  aria-label={link.platform}
                >
                  {iconMap[platform]}
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="mt-6 flex justify-between border-t border-gray-100 pt-4 text-xs text-gray-500">
        <button className="flex items-center text-gray-500 transition-colors hover:text-red-500">
          <Flag className="mr-1 h-3 w-3" />
          {t('report')}
        </button>
        <button className="flex items-center text-gray-500 transition-colors hover:text-red-500">
          <Ban className="mr-1 h-3 w-3" />
          {t('block')}
        </button>
      </div>
    </div>
  );
}
