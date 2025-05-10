'use client';

import { useEffect, useState } from 'react';
import {
  ChevronDown,
  MapPin,
  Music,
  Search,
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
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedBandSize, setSelectedBandSize] = useState('');
  const [artists, setArtists] = useState<Artist[]>([]);
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

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
    // Initial load
    fetchArtists(1, pageSize).then(({ artists: newArtists, hasMore }) => {
      setArtists(newArtists);
      setFilteredArtists(newArtists);
      setHasMore(hasMore);
      setCurrentPage(1);
    });
  }, []);

  const loadMoreArtists = () => {
    setIsLoadingMore(true);
    const nextPage = currentPage + 1;

    fetchArtists(nextPage, pageSize).then(
      ({ artists: newArtists, hasMore }) => {
        setArtists((prev) => [...prev, ...newArtists]);
        setFilteredArtists((prev) => [...prev, ...newArtists]); // smoother appending
        setCurrentPage(nextPage);
        setHasMore(hasMore);
        setIsLoadingMore(false);
      },
    );
  };

  const handleSearch = () => {
    let filtered = artists;
    if (location.trim()) {
      filtered = filtered.filter((artist) =>
        artist.location?.toLowerCase().includes(location.trim().toLowerCase()),
      );
    }
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (artist) =>
          artist.name
            ?.toLowerCase()
            .includes(searchQuery.trim().toLowerCase()) ||
          artist.genre
            ?.toLowerCase()
            .includes(searchQuery.trim().toLowerCase()),
      );
    }
    setFilteredArtists(filtered);
  };

  // All artists (including featured) are shown in the grid, in backend order
  const allArtists = filteredArtists;

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
          <div className="w-full">
            <div className="flex items-center rounded-full border border-gray-100 bg-white px-2 py-2 shadow-lg md:px-4 md:py-0">
              {/* Where? */}
              <div className="flex min-w-0 flex-1 flex-col px-4 py-2 md:py-4">
                <span className="text-xs font-bold text-gray-800">{t('where')}</span>
                <input
                  type="text"
                  placeholder={t('enter-location')}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border-none bg-transparent p-0 text-sm text-gray-600 placeholder-gray-500 focus:outline-none focus:ring-0"
                />
              </div>
              {/* Divider */}
              <div className="mx-2 hidden h-8 w-px bg-gray-200 md:block" />
              {/* When? */}
              <div className="flex min-w-0 flex-1 flex-col px-4 py-2 md:py-4">
                <span className="text-xs font-bold text-gray-800">{t('when')}</span>
                <input
                  type="text"
                  placeholder={t('add-dates')}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border-none bg-transparent p-0 text-sm text-gray-600 placeholder-gray-500 focus:outline-none focus:ring-0"
                />
              </div>
              {/* Divider */}
              <div className="mx-2 hidden h-8 w-px bg-gray-200 md:block" />
              {/* What style or artist? */}
              <div className="flex min-w-0 flex-1 flex-col px-4 py-2 md:py-4">
                <span className="text-xs font-bold text-gray-800">
                  {t('search-style-or-artist')}
                </span>
                <input
                  type="text"
                  placeholder={t('type-style-or-artist')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border-none bg-transparent p-0 text-sm text-gray-600 placeholder-gray-500 focus:outline-none focus:ring-0"
                />
              </div>
              {/* Search Button */}
              <button
                className="ml-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#15b7b9] shadow-md transition-colors hover:bg-[#109a9c]"
                onClick={handleSearch}
                type="button"
              >
                <Search className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>
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

          {/* Artists Grid */}
          <div className="transition-fade grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allArtists.map((artist) => (
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
                  {artist.featured && (
                    <span className="absolute left-3 top-3 z-10 rounded-full bg-[#15b7b9] px-3 py-1 text-xs font-semibold text-white shadow">
                      {t('featured-artist')}
                    </span>
                  )}
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

          {/* Load More Artists Button */}
          {hasMore && (
            <div className="mt-10 flex justify-center">
              <button
                className="flex items-center gap-2 rounded-full bg-[#15b7b9] px-6 py-2.5 font-medium text-white shadow-sm transition-all hover:bg-[#109a9c] disabled:opacity-50"
                onClick={loadMoreArtists}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? (
                  <>
                    <svg
                      className="h-5 w-5 animate-spin text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    {t('loading')}
                  </>
                ) : (
                  t('load-more-artists')
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
