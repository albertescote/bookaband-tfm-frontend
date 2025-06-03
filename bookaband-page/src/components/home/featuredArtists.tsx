'use client';

import { useTranslation } from '@/app/i18n/client';
import {
  ArtistsFeaturedResponse,
  fetchFeaturedArtists,
} from '@/service/backend/artist/service/artist.service';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeftCircle, ChevronRightCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { fetchMusicalStyles } from '@/service/backend/musicalStyle/service/musicalStyle.service';
import { MusicalStyle } from '@/service/backend/musicalStyle/domain/musicalStyle';

interface FeaturedArtistsParams {
  lng: string;
}

export default function FeaturedArtists({ lng }: FeaturedArtistsParams) {
  const { t } = useTranslation(lng, 'home');
  const router = useRouter();
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [animationDirection, setAnimationDirection] = useState<
    'left' | 'right' | null
  >(null);
  const [musicalStyles, setMusicalStyles] = useState<MusicalStyle[]>([]);

  const cachedData = useRef<
    Record<string, ArtistsFeaturedResponse['featuredBands']>
  >({});
  const totalCount = useRef<number | undefined>();
  const fetchedBatchApiPages = useRef<Set<number>>(new Set());
  const BATCH_SIZE = 3;
  const [visibleArtists, setVisibleArtists] = useState<
    ArtistsFeaturedResponse['featuredBands']
  >([]);

  useEffect(() => {
    const handleResize = () => {
      let newItemsPerPage;
      if (window.innerWidth < 640) newItemsPerPage = 1;
      else if (window.innerWidth < 1024) newItemsPerPage = 2;
      else newItemsPerPage = 3;
      setItemsPerPage(newItemsPerPage);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadMusicalStyles = async () => {
      const styles = await fetchMusicalStyles();
      if (!('error' in styles)) {
        setMusicalStyles(styles);
      }
    };
    loadMusicalStyles();
  }, []);

  const getBatchMetadataForFrontendPage = useCallback(
    (frontendPage: number) => {
      const batchIndex = Math.floor((frontendPage - 1) / BATCH_SIZE);
      const firstFrontendPageInBatch = batchIndex * BATCH_SIZE + 1;
      const itemsToRequestFromApi = itemsPerPage * BATCH_SIZE;
      const apiPageForBatch =
        Math.floor(
          ((firstFrontendPageInBatch - 1) * itemsPerPage) /
            itemsToRequestFromApi,
        ) + 1;
      return {
        firstFrontendPageInBatch,
        apiPageForBatch,
        itemsToRequestFromApi,
      };
    },
    [itemsPerPage, BATCH_SIZE],
  );

  const fetchArtistBatch = useCallback(
    async (frontendPageToEnsureIsFetched: number): Promise<boolean> => {
      if (!lng) return false;
      const {
        firstFrontendPageInBatch,
        apiPageForBatch,
        itemsToRequestFromApi,
      } = getBatchMetadataForFrontendPage(frontendPageToEnsureIsFetched);
      if (fetchedBatchApiPages.current.has(apiPageForBatch)) return true;
      fetchedBatchApiPages.current.add(apiPageForBatch);

      try {
        const result = await fetchFeaturedArtists(
          apiPageForBatch,
          itemsToRequestFromApi,
        );
        if (!result || !Array.isArray(result.featuredBands)) {
          console.error('Invalid response format');
          fetchedBatchApiPages.current.delete(apiPageForBatch);
          return false;
        }
        if (
          totalCount.current === undefined ||
          result.total !== totalCount.current
        ) {
          totalCount.current = result.total;
        }
        setMaxPage(
          Math.max(1, Math.ceil((totalCount.current || 0) / itemsPerPage)),
        );

        for (let i = 0; i < BATCH_SIZE; i++) {
          const currentFrontendPageInLoop = firstFrontendPageInBatch + i;
          const startIdxInBatchBands = i * itemsPerPage;
          if (startIdxInBatchBands >= result.featuredBands.length) {
            if (
              totalCount.current === undefined ||
              currentFrontendPageInLoop <=
                Math.ceil((totalCount.current || 0) / itemsPerPage)
            ) {
              cachedData.current[`page-${currentFrontendPageInLoop}`] = [];
            }
            break;
          }
          const endIdxInBatchBands = startIdxInBatchBands + itemsPerPage;
          const pageArtists = result.featuredBands.slice(
            startIdxInBatchBands,
            endIdxInBatchBands,
          );
          cachedData.current[`page-${currentFrontendPageInLoop}`] = pageArtists;
          if (pageArtists.length < itemsPerPage) break;
        }
        return true;
      } catch (error) {
        console.error('Error fetching batch:', error);
        fetchedBatchApiPages.current.delete(apiPageForBatch);
        return false;
      }
    },
    [lng, itemsPerPage, getBatchMetadataForFrontendPage, BATCH_SIZE],
  );

  useEffect(() => {
    cachedData.current = {};
    fetchedBatchApiPages.current = new Set();
    if (
      totalCount.current !== undefined &&
      Number.isFinite(totalCount.current)
    ) {
      setMaxPage(Math.max(1, Math.ceil(totalCount.current / itemsPerPage)));
    } else {
      setMaxPage(1);
    }
    setCurrentPage(1);
    setAnimationDirection(null); // Reset animation on itemsPerPage change
  }, [itemsPerPage]);

  useEffect(() => {
    let isMounted = true;
    const loadAndSetVisibleArtists = async () => {
      if (!lng) {
        if (isMounted) {
          setVisibleArtists([]);
          setIsLoading(false);
        }
        return;
      }
      setIsLoading(true);
      const pageKey = `page-${currentPage}`;
      if (cachedData.current[pageKey]) {
        if (isMounted) {
          setVisibleArtists(cachedData.current[pageKey]);
          setIsLoading(false);
        }
      } else {
        const success = await fetchArtistBatch(currentPage);
        if (isMounted) {
          setVisibleArtists(
            success && cachedData.current[pageKey]
              ? cachedData.current[pageKey]
              : [],
          );
          setIsLoading(false);
        }
      }
    };
    loadAndSetVisibleArtists();
    return () => {
      isMounted = false;
    };
  }, [currentPage, lng, fetchArtistBatch]);

  useEffect(() => {
    if (!lng || isLoading || totalCount.current === undefined) return;
    const { firstFrontendPageInBatch } =
      getBatchMetadataForFrontendPage(currentPage);
    const currentBatchEndPage = firstFrontendPageInBatch + BATCH_SIZE - 1;
    if (currentPage === currentBatchEndPage) {
      const nextPageAfterBatch = currentBatchEndPage + 1;
      if (nextPageAfterBatch <= maxPage) {
        const { apiPageForBatch: nextApiPageToFetch } =
          getBatchMetadataForFrontendPage(nextPageAfterBatch);
        if (!fetchedBatchApiPages.current.has(nextApiPageToFetch)) {
          fetchArtistBatch(nextPageAfterBatch);
        }
      }
    }
  }, [
    currentPage,
    maxPage,
    lng,
    isLoading,
    fetchArtistBatch,
    getBatchMetadataForFrontendPage,
    BATCH_SIZE,
  ]);

  // Reset animation direction after animation is likely complete
  // This allows re-triggering if user clicks fast
  useEffect(() => {
    if (animationDirection) {
      const timer = setTimeout(() => {
        setAnimationDirection(null);
      }, 350); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [animationDirection, currentPage]);

  if (!lng) return null;

  const handlePrev = () => {
    if (currentPage > 1) {
      setAnimationDirection('left');
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < maxPage) {
      setAnimationDirection('right');
      setCurrentPage((prev) => prev + 1);
    }
  };

  const showLoadingSkeleton = isLoading && visibleArtists.length === 0;
  const showNoArtistsMessage =
    !isLoading && visibleArtists.length === 0 && currentPage > 0;

  const getGridClasses = () => {
    switch (itemsPerPage) {
      case 1:
        return 'grid-cols-1 place-items-center';
      case 2:
        return 'grid-cols-1 sm:grid-cols-2';
      case 3:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      default:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
  };

  return (
    <section className="py-16">
      <h2
        id="featured-artists-heading"
        className="mb-12 text-center text-3xl font-bold"
      >
        {t('featured-musicians-title')}
      </h2>
      <div className="relative overflow-hidden">
        <div
          className={`transition-transform duration-500 ease-in-out ${
            animationDirection === 'left'
              ? 'animate-slide-in-left'
              : animationDirection === 'right'
                ? 'animate-slide-in-right'
                : ''
          } mx-auto grid max-w-6xl gap-8 ${getGridClasses()}`}
        >
          {showLoadingSkeleton ? (
            Array.from({ length: itemsPerPage }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="h-[520px] w-full animate-pulse rounded-lg bg-gray-200 p-6"
              >
                {' '}
                {/* Adjusted skeleton height */}
                <div className="mb-6 h-80 w-full rounded-lg bg-gray-300"></div>
                <div className="mb-2 h-6 w-3/4 rounded bg-gray-300"></div>
                <div className="mb-4 h-4 w-1/2 rounded bg-gray-300"></div>
                <div className="mb-4 h-[4.5rem] w-full rounded bg-gray-300"></div>{' '}
                {/* Skeleton for description */}
                <div className="h-10 w-full rounded-lg bg-gray-300"></div>
              </div>
            ))
          ) : showNoArtistsMessage ? (
            <div className="col-span-full py-10 text-center text-gray-500">
              {t('no-featured-artists')}
            </div>
          ) : (
            visibleArtists.map((artist, index) => (
              <div
                key={artist.name + '-' + index}
                className={`flex h-full flex-col rounded-lg border bg-white p-6 text-left shadow-md ${
                  itemsPerPage === 1 ? 'w-full max-w-sm sm:max-w-md' : 'w-full'
                }`}
              >
                <img
                  src={artist.imageUrl || '/placeholder-artist.jpg'}
                  alt={artist.name}
                  className="mb-6 h-80 w-full rounded-lg object-cover"
                  loading={index < itemsPerPage ? 'eager' : 'lazy'}
                  onError={(e) =>
                    (e.currentTarget.src = '/placeholder-artist.jpg')
                  }
                />
                <div className="flex flex-1 flex-col">
                  <div className="flex-grow">
                    <h3 className="mb-2 text-xl font-semibold leading-tight">
                      {artist.name}
                    </h3>
                    <div className="mb-4 flex flex-wrap gap-2">
                      {artist.musicalStyleIds.map((styleId) => {
                        const style = musicalStyles.find(
                          (s) => s.id === styleId,
                        );
                        return style ? (
                          <span
                            key={styleId}
                            className="flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-[#15b7b9]"
                          >
                            <span>{style.icon}</span>
                            <span>{style.label[lng] || style.label['en']}</span>
                          </span>
                        ) : null;
                      })}
                    </div>
                    <p className="h-description-3-lines mb-4 line-clamp-3 overflow-hidden text-gray-700">
                      {artist.bio}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      router.push(`/${lng}/artists/${artist.id}`);
                    }}
                    className="mt-auto w-full rounded-lg border border-[#15b7b9] px-4 py-2 font-medium text-[#15b7b9] transition-colors hover:bg-[#15b7b9] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#15b7b9] focus:ring-offset-2"
                  >
                    {t('view-profile')}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {maxPage > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2 md:mt-12 md:gap-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1 || isLoading}
            className="group flex items-center justify-center rounded-full p-1 transition hover:bg-teal-100 disabled:opacity-50 disabled:hover:bg-transparent md:p-2"
            aria-label={t('previous-page') || 'Previous artists'}
          >
            <ChevronLeftCircle
              width={24}
              height={24}
              className={`text-[#15b7b9] transition-colors group-hover:text-[#0d7a7b] ${currentPage === 1 ? 'opacity-50' : ''} group-disabled:group-hover:text-[#15b7b9]`}
            />
          </button>
          <div className="flex items-center gap-1 px-2 md:gap-2">
            {Array.from({ length: maxPage }).map((_, index) => (
              <button
                key={`dot-${index}`}
                onClick={() => {
                  if (index + 1 < currentPage) setAnimationDirection('left');
                  else if (index + 1 > currentPage)
                    setAnimationDirection('right');
                  setCurrentPage(index + 1);
                }}
                disabled={isLoading && !cachedData.current[`page-${index + 1}`]}
                className={`h-2 w-2 rounded-full transition-colors md:h-3 md:w-3 ${currentPage === index + 1 ? 'bg-[#15b7b9]' : 'bg-gray-300 hover:bg-gray-400'} disabled:opacity-50`}
                aria-label={`${t('go-to-page') || 'Go to page'} ${index + 1}`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            disabled={currentPage === maxPage || isLoading}
            className="group flex items-center justify-center rounded-full p-1 transition hover:bg-teal-100 disabled:opacity-50 disabled:hover:bg-transparent md:p-2"
            aria-label={t('next-page') || 'Next artists'}
          >
            <ChevronRightCircle
              width={24}
              height={24}
              className={`text-[#15b7b9] transition-colors group-hover:text-[#0d7a7b] ${currentPage === maxPage ? 'opacity-50' : ''} group-disabled:group-hover:text-[#15b7b9]`}
            />
          </button>
        </div>
      )}
    </section>
  );
}
