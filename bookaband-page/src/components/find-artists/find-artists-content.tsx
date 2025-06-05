'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArtistsDetailsFilteredResponse,
  fetchFilteredArtists,
} from '@/service/backend/artist/service/artist.service';
import SearchBar from './searchBar';
import ArtistsGrid from './artistsGrid';
import LoadMoreButton from './loadMoreButton';
import { useAuth } from '@/providers/authProvider';
import AdditionalFilters from '@/components/find-artists/additionalFilters';
import {
  sanitizeText,
  validateSearchParams,
  ValidationErrors,
} from '@/lib/validators/searchValidators';
import { BandCatalogItem } from '@/service/backend/artist/domain/bandCatalogItem';
import { MusicalStyle } from '@/service/backend/musicalStyle/domain/musicalStyle';
import { EventType } from '@/service/backend/filters/domain/eventType';

interface FindArtistsContentProps {
  language: string;
  initialData: ArtistsDetailsFilteredResponse;
  musicalStyles: MusicalStyle[];
  eventTypes: EventType[];
  hasSearchedInitial: boolean;
  initialFilters: {
    location: string;
    date: string;
    query: string;
  };
}

export default function FindArtistsContent({
  language,
  initialData,
  musicalStyles,
  eventTypes,
  hasSearchedInitial,
  initialFilters,
}: FindArtistsContentProps) {
  const { t } = useTranslation(language, 'find-artists');
  const router = useRouter();
  const searchParams = useSearchParams();

  const { user } = useAuth();

  const pageSize = 6;

  const [searchQuery, setSearchQuery] = useState(initialFilters.query);
  const [location, setLocation] = useState(initialFilters.location);
  const [date, setDate] = useState(initialFilters.date);
  const [sortOption, setSortOption] = useState(
    sanitizeText(
      decodeURIComponent(searchParams.get('sort') || 'most-popular'),
    ),
  );
  const [hasSearched, setHasSearched] = useState(hasSearchedInitial);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );

  const [artists, setArtists] = useState<BandCatalogItem[]>(
    initialData.bandCatalogItems,
  );
  const [filteredArtists, setFilteredArtists] = useState<BandCatalogItem[]>(
    initialData.bandCatalogItems,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialData.hasMore);
  const [totalArtists, setTotalArtists] = useState(initialData.total);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({});

  const updateUrlParams = (params: Record<string, string>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    Object.entries(params).forEach(([key, value]) => {
      if (value) current.set(key, encodeURIComponent(sanitizeText(value)));
      else current.delete(key);
    });
    const query = current.toString() ? `?${current.toString()}` : '';
    router.push(`${window.location.pathname}${query}`);
  };

  const handleSearch = () => {
    setValidationErrors({});
    const errors = validateSearchParams({ location, date, searchQuery }, t);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    updateUrlParams({ location, date, q: searchQuery, sort: sortOption });

    fetchFilteredArtists(1, pageSize, { location, date, searchQuery }).then(
      ({ bandCatalogItems: newArtists, hasMore, total }) => {
        setArtists(newArtists);
        setFilteredArtists(newArtists);
        setHasMore(hasMore);
        setCurrentPage(1);
        setTotalArtists(total);
        setHasSearched(true);
      },
    );
  };

  const handleClearSearch = () => {
    setLocation('');
    setDate('');
    setSearchQuery('');
    setSortOption('most-popular');
    setHasSearched(false);
    updateUrlParams({ location: '', date: '', q: '', sort: '' });

    fetchFilteredArtists(1, pageSize).then(
      ({ bandCatalogItems, hasMore, total }) => {
        setArtists(bandCatalogItems);
        setFilteredArtists(bandCatalogItems);
        setHasMore(hasMore);
        setCurrentPage(1);
        setTotalArtists(total);
      },
    );
  };

  useEffect(() => {
    if (hasSearched) {
      updateUrlParams({ sort: sortOption });
    }
  }, [sortOption]);

  const loadMoreArtists = () => {
    setIsLoadingMore(true);
    const nextPage = currentPage + 1;

    const filterOptions = hasSearched
      ? { location, date, searchQuery }
      : undefined;

    fetchFilteredArtists(nextPage, pageSize, filterOptions).then(
      ({ bandCatalogItems: newArtists, hasMore, total }) => {
        setArtists((prev) => [...prev, ...newArtists]);
        setFilteredArtists((prev) => [...prev, ...newArtists]);
        setCurrentPage(nextPage);
        setHasMore(hasMore);
        setIsLoadingMore(false);
        setTotalArtists(total);
      },
    );
  };

  const handleAdditionalFiltersChange = (newFilters: any) => {
    const updatedFilters = { ...activeFilters, ...newFilters };
    setActiveFilters(updatedFilters);

    const filtered = artists.filter((artist) => {
      const musicalStyleSet = new Set(artist.musicalStyleIds);
      const eventTypeSet = new Set(artist.eventTypeIds);

      if (
        updatedFilters.minRating &&
        (artist.rating ?? 0) < updatedFilters.minRating
      )
        return false;

      if (
        updatedFilters.selectedGenres &&
        updatedFilters.selectedGenres.length > 0 &&
        !updatedFilters.selectedGenres.some((genreId: string) =>
          musicalStyleSet.has(genreId),
        )
      )
        return false;

      if (
        updatedFilters.selectedBandSize &&
        artist.bandSize !== updatedFilters.selectedBandSize
      )
        return false;

      if (updatedFilters.eventTypes) {
        const selectedEventTypes = Object.entries(updatedFilters.eventTypes)
          .filter(([_, isSelected]) => isSelected)
          .map(([type]) => type);

        if (selectedEventTypes.length === 0) return true;

        return selectedEventTypes.some((type) => eventTypeSet.has(type));
      }

      if (
        updatedFilters.minPrice &&
        artist.price &&
        artist.price < updatedFilters.minPrice
      )
        return false;

      if (
        updatedFilters.maxPrice &&
        artist.price &&
        artist.price > updatedFilters.maxPrice
      )
        return false;

      return true;
    });

    setFilteredArtists(filtered);
  };

  let allArtists = [...filteredArtists];

  const featuredArtists = allArtists.filter((artist) => artist.featured);
  const nonFeaturedArtists = allArtists.filter((artist) => !artist.featured);

  if (sortOption === 'most-popular') {
    nonFeaturedArtists.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  } else if (sortOption === 'price-asc') {
    nonFeaturedArtists.sort((a, b) => {
      if (a.price === undefined && b.price === undefined) return 0;
      if (a.price === undefined) return 1;
      if (b.price === undefined) return -1;
      return a.price - b.price;
    });
  } else if (sortOption === 'price-desc') {
    nonFeaturedArtists.sort((a, b) => {
      if (a.price === undefined && b.price === undefined) return 0;
      if (a.price === undefined) return 1;
      if (b.price === undefined) return -1;
      return b.price - a.price;
    });
  } else if (sortOption === 'name-asc') {
    nonFeaturedArtists.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption === 'name-desc') {
    nonFeaturedArtists.sort((a, b) => b.name.localeCompare(a.name));
  }

  if (sortOption === 'most-popular') {
    featuredArtists.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  } else if (sortOption === 'price-asc') {
    featuredArtists.sort((a, b) => {
      if (a.price === undefined && b.price === undefined) return 0;
      if (a.price === undefined) return 1;
      if (b.price === undefined) return -1;
      return a.price - b.price;
    });
  } else if (sortOption === 'price-desc') {
    featuredArtists.sort((a, b) => {
      if (a.price === undefined && b.price === undefined) return 0;
      if (a.price === undefined) return 1;
      if (b.price === undefined) return -1;
      return b.price - a.price;
    });
  } else if (sortOption === 'name-asc') {
    featuredArtists.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption === 'name-desc') {
    featuredArtists.sort((a, b) => b.name.localeCompare(a.name));
  }

  allArtists = [...featuredArtists, ...nonFeaturedArtists];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-[#15b7b9] to-[#1e97a8] p-8 text-white shadow-lg">
        <h1 className="mb-3 text-4xl font-bold">{t('find-artists')}</h1>
        <p className="mb-6 text-lg opacity-90">{t('hero-subtitle')}</p>

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

        {/* Validation Errors */}
        {(validationErrors.location ||
          validationErrors.date ||
          validationErrors.searchQuery) && (
          <div className="mt-4 space-y-2">
            {validationErrors.location && (
              <p className="text-sm text-red-200">
                {validationErrors.location}
              </p>
            )}
            {validationErrors.date && (
              <p className="text-sm text-red-200">{validationErrors.date}</p>
            )}
            {validationErrors.searchQuery && (
              <p className="text-sm text-red-200">
                {validationErrors.searchQuery}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
        {/* Mobile Filter Toggle Button */}
        {hasSearched && (
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 lg:hidden"
          >
            <svg
              className="h-5 w-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            {t('filters')}
          </button>
        )}

        {/* Filters Sidebar */}
        {hasSearched && (
          <div
            className={`fixed inset-0 z-50 bg-white lg:static lg:sticky lg:top-4 lg:z-auto lg:w-80 lg:self-start lg:rounded-xl lg:border lg:border-gray-200 lg:bg-white lg:shadow-md lg:transition-all ${
              isFilterOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="flex h-full flex-col lg:h-auto">
              <div className="sticky top-0 z-10 border-b border-gray-200 bg-white p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-[#565d6d] sm:text-xl">
                    {t('filters')}
                  </h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="text-gray-500 hover:text-gray-700 lg:hidden"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {/* Additional Filters */}
                <AdditionalFilters
                  language={language}
                  onFilterChange={handleAdditionalFiltersChange}
                  musicalStyles={musicalStyles}
                  initialEventTypes={eventTypes}
                />
              </div>

              {/* Mobile Apply Button */}
              <div className="sticky bottom-0 border-t border-gray-200 bg-white p-4 lg:hidden">
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full rounded-lg bg-[#15b7b9] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#1e97a8] focus:outline-none focus:ring-2 focus:ring-[#15b7b9]/20"
                >
                  {t('apply-filters') || 'Apply Filters'}
                </button>
              </div>
            </div>
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
          <ArtistsGrid
            artists={allArtists}
            musicalStyles={musicalStyles}
            eventTypes={eventTypes}
            language={language}
            hasSearched={hasSearched}
            searchParams={location || date ? { location, date } : undefined}
          />

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
