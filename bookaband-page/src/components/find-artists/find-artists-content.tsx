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
import { OfferDetails } from '@/service/backend/artist/domain/offerDetails';

interface FindArtistsContentProps {
  language: string;
  initialData: ArtistsDetailsFilteredResponse;
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

  const [artists, setArtists] = useState<OfferDetails[]>(initialData.offers);
  const [filteredArtists, setFilteredArtists] = useState<OfferDetails[]>(
    initialData.offers,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialData.hasMore);
  const [totalArtists, setTotalArtists] = useState(initialData.total);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
      ({ offers: newArtists, hasMore, total }) => {
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

    fetchFilteredArtists(1, pageSize).then(({ offers, hasMore, total }) => {
      setArtists(offers);
      setFilteredArtists(offers);
      setHasMore(hasMore);
      setCurrentPage(1);
      setTotalArtists(total);
    });
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
      ({ offers: newArtists, hasMore, total }) => {
        setArtists((prev) => [...prev, ...newArtists]);
        setFilteredArtists((prev) => [...prev, ...newArtists]);
        setCurrentPage(nextPage);
        setHasMore(hasMore);
        setIsLoadingMore(false);
        setTotalArtists(total);
      },
    );
  };

  const handleAdditionalFiltersChange = (filters: any) => {
    const filtered = artists.filter((artist) => {
      const equipmentSet = new Set(artist.equipment);
      const eventTypeSet = new Set(artist.eventTypeIds);

      if (filters.minRating && (artist.rating ?? 0) < filters.minRating)
        return false;
      if (filters.hasSoundEquipment && !equipmentSet.has('sound')) return false;
      if (filters.hasLighting && !equipmentSet.has('lighting')) return false;
      if (filters.hasMicrophone && !equipmentSet.has('microphone'))
        return false;
      if (filters.selectedGenre && artist.genre !== filters.selectedGenre)
        return false;
      if (
        filters.selectedBandSize &&
        artist.bandSize !== filters.selectedBandSize
      )
        return false;

      if (filters.eventTypes) {
        const matches = Object.entries(filters.eventTypes).some(
          ([type, isSelected]) => isSelected && eventTypeSet.has(type),
        );
        if (!matches) return false;
      }

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
    nonFeaturedArtists.sort((a, b) => a.bandName.localeCompare(b.bandName));
  } else if (sortOption === 'name-desc') {
    nonFeaturedArtists.sort((a, b) => b.bandName.localeCompare(a.bandName));
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
    featuredArtists.sort((a, b) => a.bandName.localeCompare(b.bandName));
  } else if (sortOption === 'name-desc') {
    featuredArtists.sort((a, b) => b.bandName.localeCompare(a.bandName));
  }

  allArtists = [...featuredArtists, ...nonFeaturedArtists];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-10 rounded-2xl bg-gradient-to-r from-[#15b7b9] to-[#1e97a8] p-8 text-white shadow-lg">
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

            {/* Additional Filters */}
            <AdditionalFilters
              language={language}
              onFilterChange={handleAdditionalFiltersChange}
            />

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
            language={language}
            hasSearched={hasSearched}
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
