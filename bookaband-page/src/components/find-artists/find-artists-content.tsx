'use client';

import { useEffect, useState } from 'react';
import {
  ChevronDown,
  MapPin,
  Music,
  Search,
  SlidersHorizontal,
  Star,
  Users,
  X,
} from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';
import { Artist, fetchArtists } from '@/service/backend/artist/artist.service';

interface FindArtistsContentProps {
  language: string;
}

export default function FindArtistsContent({
  language,
}: FindArtistsContentProps) {
  const { t } = useTranslation(language, 'find-artists');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedBandSize, setSelectedBandSize] = useState('');
  const [artists, setArtists] = useState<Artist[]>([]);

  const genres = [
    { value: 'rock', label: 'Rock', emoji: '🎸' },
    { value: 'pop', label: 'Pop', emoji: '🎤' },
    { value: 'jazz', label: 'Jazz', emoji: '🎷' },
    { value: 'classical', label: 'Classical', emoji: '🎻' },
    { value: 'electronic', label: 'Electronic', emoji: '🎧' },
  ];

  const bandSizes = [
    { value: 'solo', label: 'Solo', count: 1 },
    { value: 'duo', label: 'Duo', count: 2 },
    { value: 'trio', label: 'Trio', count: 3 },
    { value: 'band', label: 'Band (4+)', count: 4 },
  ];

  useEffect(() => {
    fetchArtists().then((fetchedArtists) => {
      setArtists(fetchedArtists);
    });
  }, []);

  return (
    <div className="container mx-auto bg-gray-50 px-4 py-8">
      {/* Hero Section */}
      <div className="mb-10 rounded-2xl bg-gradient-to-r from-[#15b7b9] to-[#1e97a8] p-8 text-white shadow-lg">
        <h1 className="mb-3 text-4xl font-bold">{t('find-artists')}</h1>
        <p className="mb-6 text-lg opacity-90">
          Book the perfect music for your next event
        </p>

        {/* Search Bar */}
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder={t('search-placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border-none bg-white/90 py-4 pl-12 pr-4 text-gray-800 shadow-md backdrop-blur-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-white/20"
              />
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            </div>
          </div>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center justify-center gap-2 rounded-full border-2 border-white/30 bg-white/20 px-6 py-3.5 font-medium text-white backdrop-blur-sm transition-all hover:bg-white/30"
          >
            <SlidersHorizontal className="h-5 w-5" />
            <span>{t('filters')}</span>
          </button>
        </div>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {activeFilters.map((filter, index) => (
            <div
              key={index}
              className="flex items-center rounded-full bg-[#15b7b9]/10 px-3 py-1.5 text-sm font-medium text-[#15b7b9]"
            >
              <span>{filter}</span>
              <button className="ml-2">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button className="rounded-full px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-[#15b7b9]">
            Clear all
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Filters Sidebar */}
        <div
          className={`w-full rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all lg:sticky lg:top-4 lg:w-80 lg:self-start ${
            isFilterOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#565d6d]">
              {t('filters')}
            </h2>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="text-gray-500 hover:text-gray-700 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Location Filter */}
          <div className="mb-6">
            <label className="mb-2 flex items-center gap-2 font-medium text-gray-700">
              <MapPin className="h-4 w-4 text-[#15b7b9]" />
              {t('location')}
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={t('enter-location')}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 focus:border-[#15b7b9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
              />
            </div>
          </div>

          {/* Genre Filter */}
          <div className="mb-6">
            <label className="mb-2 flex items-center gap-2 font-medium text-gray-700">
              <Music className="h-4 w-4 text-[#15b7b9]" />
              {t('genre')}
            </label>
            <div className="space-y-2">
              {genres.map((genre) => (
                <label
                  key={genre.value}
                  className="flex items-center gap-2 rounded-lg border border-transparent px-3 py-2 hover:border-gray-200 hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    value={genre.value}
                    checked={selectedGenre === genre.value}
                    onChange={() => setSelectedGenre(genre.value)}
                    className="h-4 w-4 rounded border-gray-300 text-[#15b7b9] focus:ring-[#15b7b9]"
                  />
                  <span className="text-gray-700">
                    {genre.emoji} {genre.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Band Size Filter */}
          <div className="mb-6">
            <label className="mb-2 flex items-center gap-2 font-medium text-gray-700">
              <Users className="h-4 w-4 text-[#15b7b9]" />
              {t('band-size')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {bandSizes.map((size) => (
                <label
                  key={size.value}
                  className={`flex cursor-pointer items-center justify-center rounded-lg border border-gray-200 px-2 py-3 text-sm transition-all hover:border-[#15b7b9]/30 hover:bg-[#15b7b9]/5 ${
                    selectedBandSize === size.value
                      ? 'border-[#15b7b9] bg-[#15b7b9]/10 font-medium text-[#15b7b9]'
                      : 'text-gray-600'
                  }`}
                >
                  <input
                    type="radio"
                    value={size.value}
                    checked={selectedBandSize === size.value}
                    onChange={() => setSelectedBandSize(size.value)}
                    className="sr-only"
                  />
                  <span>{size.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <label className="mb-2 flex items-center gap-2 font-medium text-gray-700">
              <span className="text-[#15b7b9]">$</span>
              {t('price-range')}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#15b7b9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
              />
              <span className="text-gray-500">—</span>
              <input
                type="number"
                placeholder="Max"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#15b7b9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
              />
            </div>
          </div>

          <button className="w-full rounded-lg bg-[#15b7b9] px-4 py-3 font-medium text-white transition-colors hover:bg-[#15b7b9]/90">
            {t('apply-filters')}
          </button>
        </div>

        {/* Artists Grid */}
        <div className="flex-1">
          {/* Sort Options */}
          <div className="mb-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-800">32</span> artists
              found
            </div>
            <div className="relative">
              <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                <span>Most Popular</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Featured Artist */}
          {artists
            .filter((a) => a.featured)
            .slice(0, 1)
            .map((artist) => (
              <div
                key={artist.id}
                className="mb-8 overflow-hidden rounded-xl bg-white shadow-md"
              >
                <div className="relative h-64 w-full overflow-hidden md:h-80">
                  <div className="absolute left-6 top-6 rounded-full bg-[#15b7b9] px-4 py-1.5 font-medium text-white">
                    Featured Artist
                  </div>
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col p-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="mb-1 text-xl font-bold text-[#565d6d]">
                      {artist.name}
                    </h3>
                    <div className="mb-2 flex items-center gap-4">
                      <span className="flex items-center gap-1 text-sm text-gray-600">
                        <Music className="h-3.5 w-3.5" />
                        {artist.genre}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-3.5 w-3.5" />
                        {artist.location}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-gray-600">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-gray-800">
                          {artist.rating}
                        </span>
                        <span>({artist.reviewCount})</span>
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-4 md:mt-0">
                    <span className="text-lg font-semibold text-[#15b7b9]">
                      ${artist.price}
                      <span className="text-sm font-normal text-gray-500">
                        /hour
                      </span>
                    </span>
                    <button className="rounded-full bg-[#15b7b9] px-6 py-2.5 font-medium text-white shadow-sm transition-all hover:bg-[#15b7b9]/90 hover:shadow">
                      {t('view-profile')}
                    </button>
                  </div>
                </div>
              </div>
            ))}

          {/* Artists Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {artists
              .filter((a) => !a.featured || artists.indexOf(a) > 0)
              .map((artist) => (
                <div
                  key={artist.id}
                  className="group overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="mb-1 text-lg font-semibold text-[#565d6d] group-hover:text-[#15b7b9]">
                      {artist.name}
                    </h3>
                    <div className="mb-3 flex items-center gap-3">
                      <span className="flex items-center gap-1 text-xs text-gray-600">
                        <Music className="h-3 w-3" />
                        {artist.genre}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-600">
                        <MapPin className="h-3 w-3" />
                        {artist.location}
                      </span>
                    </div>
                    <div className="mb-3 flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-gray-800">
                        {artist.rating}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({artist.reviewCount} reviews)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-[#15b7b9]">
                        ${artist.price}
                        <span className="text-xs font-normal text-gray-500">
                          /hour
                        </span>
                      </span>
                      <button className="rounded-full bg-[#15b7b9]/10 px-4 py-1.5 text-sm font-medium text-[#15b7b9] transition-colors hover:bg-[#15b7b9]/20">
                        {t('view-profile')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Pagination */}
          <div className="mt-10 flex justify-center">
            <div className="inline-flex items-center gap-1">
              <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50">
                &laquo;
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#15b7b9] bg-[#15b7b9]/10 font-medium text-[#15b7b9]">
                1
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50">
                2
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50">
                3
              </button>
              <span className="flex h-10 items-center justify-center px-2 text-gray-500">
                ...
              </span>
              <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50">
                12
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50">
                &raquo;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
