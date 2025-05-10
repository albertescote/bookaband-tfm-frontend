'use client';

import { useEffect, useState } from 'react';
import { MapPin, Music, X } from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';
import { Artist, fetchArtists } from '@/service/backend/artist/artist.service';
import SearchBar from './searchBar';
import ArtistsGrid from './artistsGrid';
import LoadMoreButton from './loadMoreButton';
import { useAuth } from '@/providers/authProvider';

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
  const [totalArtists, setTotalArtists] = useState<number>(0);
  const [sortOption, setSortOption] = useState<string>('most-popular');
  const [hasSearched, setHasSearched] = useState(false);
  const { user } = useAuth();

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
    fetchArtists(1, pageSize).then(
      ({ artists: newArtists, hasMore, total }) => {
        setArtists(newArtists);
        setFilteredArtists(newArtists);
        setHasMore(hasMore);
        setCurrentPage(1);
        setTotalArtists(total);
      },
    );
  }, []);

  const loadMoreArtists = () => {
    setIsLoadingMore(true);
    const nextPage = currentPage + 1;

    fetchArtists(nextPage, pageSize).then(
      ({ artists: newArtists, hasMore, total }) => {
        setArtists((prev) => [...prev, ...newArtists]);
        setFilteredArtists((prev) => [...prev, ...newArtists]); // smoother appending
        setCurrentPage(nextPage);
        setHasMore(hasMore);
        setIsLoadingMore(false);
        setTotalArtists(total);
      },
    );
  };

  const handleSearch = () => {
    console.log('Search triggered'); // Debug log
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
    setHasSearched(true);
    console.log('hasSearched set to true'); // Debug log
  };

  const handleClearSearch = () => {
    setHasSearched(false);
    setFilteredArtists(artists);
  };

  let allArtists = [...filteredArtists];
  if (sortOption === 'most-popular') {
    allArtists.sort((a, b) => b.rating - a.rating);
  } else if (sortOption === 'price-asc') {
    allArtists.sort((a, b) => {
      if (a.price === undefined && b.price === undefined) return 0;
      if (a.price === undefined) return 1;
      if (b.price === undefined) return -1;
      return a.price - b.price;
    });
  } else if (sortOption === 'price-desc') {
    allArtists.sort((a, b) => {
      if (a.price === undefined && b.price === undefined) return 0;
      if (a.price === undefined) return 1;
      if (b.price === undefined) return -1;
      return b.price - a.price;
    });
  } else if (sortOption === 'name-asc') {
    allArtists.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption === 'name-desc') {
    allArtists.sort((a, b) => b.name.localeCompare(a.name));
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-10 rounded-2xl bg-gradient-to-r from-[#15b7b9] to-[#1e97a8] p-8 text-white shadow-lg">
        <h1 className="mb-3 text-4xl font-bold">{t('find-artists')}</h1>
        <p className="mb-6 text-lg opacity-90">
          Book the perfect music for your next event
        </p>

        {/* Search Bar */}
        <SearchBar
          language={language}
          location={location}
          setLocation={setLocation}
          date={date}
          setDate={setDate}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
          isLoading={false}
          hasSearched={hasSearched}
          onClearSearch={handleClearSearch}
          setHasSearched={setHasSearched}
        />
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
        {hasSearched && (
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
                <Music className="h-4 w-4 text-[#15b7b9]" />
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
            {user && (
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
            )}

            <button className="w-full rounded-lg bg-[#15b7b9] px-4 py-3 font-medium text-white transition-colors hover:bg-[#15b7b9]/90">
              {t('apply-filters')}
            </button>
          </div>
        )}

        {/* Artists Grid */}
        <div className="flex-1">
          {/* Sort Options */}
          <div className="mb-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-800">{totalArtists}</span>{' '}
              {t('artists-found')}
            </div>
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm focus:border-[#15b7b9] focus:outline-none"
              >
                <option value="most-popular">{t('sort-most-popular')}</option>
                {user && (
                  <option value="price-asc">{t('sort-price-asc')}</option>
                )}
                {user && (
                  <option value="price-desc">{t('sort-price-desc')}</option>
                )}
                <option value="name-asc">{t('sort-name-asc')}</option>
                <option value="name-desc">{t('sort-name-desc')}</option>
              </select>
            </div>
          </div>

          {/* Artists Grid */}
          <ArtistsGrid artists={allArtists} language={language} />

          {/* Load More Artists Button */}
          <LoadMoreButton
            onClick={loadMoreArtists}
            isLoading={isLoadingMore}
            hasMore={hasMore}
            language={language}
          />
        </div>
      </div>
    </div>
  );
}
