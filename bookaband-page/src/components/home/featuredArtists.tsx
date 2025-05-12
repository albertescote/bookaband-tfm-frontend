'use client';

import { useTranslation } from '@/app/i18n/client';
import {
  ArtistsFeaturedResponse,
  fetchFeaturedArtists,
} from '@/service/backend/artist/service/artist.service';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeftCircle, ChevronRightCircle } from 'lucide-react';

interface FeaturedArtistsParams {
  lng: string;
}

export default function FeaturedArtists({ lng }: FeaturedArtistsParams) {
  const { t } = useTranslation(lng, 'home');
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Store all fetched artists and pagination info in cache
  const cachedData = useRef<Record<string, ArtistsFeaturedResponse>>({});
  const totalCount = useRef<number | undefined>();

  // Track which page ranges have been fetched
  const fetchedRanges = useRef<Set<string>>(new Set());

  // Number of pages to fetch in each batch
  const BATCH_SIZE = 3;

  // Current visible artists
  const [visibleArtists, setVisibleArtists] = useState<
    ArtistsFeaturedResponse['offers']
  >([]);

  // Set itemsPerPage based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
      setCurrentPage(1);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine which batch contains the requested page
  const getBatchForPage = useCallback(
    (page: number) => {
      const batchNumber = Math.floor((page - 1) / BATCH_SIZE);
      const startPage = batchNumber * BATCH_SIZE + 1;
      const endPage = startPage + BATCH_SIZE - 1;
      return { startPage, endPage, batchKey: `${startPage}-${endPage}` };
    },
    [BATCH_SIZE],
  );

  // Fetch a batch of pages if not already in cache
  const fetchArtistBatch = useCallback(
    async (page: number) => {
      if (!lng) return;

      const { startPage, endPage, batchKey } = getBatchForPage(page);

      // Skip if this batch is already fetched
      if (fetchedRanges.current.has(batchKey)) {
        return;
      }

      setIsLoading(true);

      try {
        // Calculate how many items to fetch for this batch
        const batchSize = itemsPerPage * BATCH_SIZE;
        const batchPageNumber = startPage;

        console.log(
          `Fetching batch: pages ${startPage}-${endPage} (${batchSize} items)`,
        );

        const result = await fetchFeaturedArtists(batchPageNumber, batchSize);

        if (!result || !Array.isArray(result.offers)) {
          throw new Error('Invalid response format');
        }

        // Store total count from the first response
        if (totalCount.current === undefined) {
          totalCount.current = result.total;
          setMaxPage(Math.max(1, Math.ceil(result.total / itemsPerPage)));
        }

        // Store fetched data in cache - split into pages
        for (let i = 0; i < BATCH_SIZE; i++) {
          const pageNumber = startPage + i;
          const startIdx = i * itemsPerPage;
          const pageArtists = result.offers.slice(
            startIdx,
            startIdx + itemsPerPage,
          );

          if (pageArtists.length === 0) break;

          cachedData.current[`page-${pageNumber}`] = {
            offers: pageArtists,
            hasMore: pageNumber * itemsPerPage < result.total,
            total: result.total,
          };
        }

        // Mark this range as fetched
        fetchedRanges.current.add(batchKey);
      } catch (error) {
        console.error('Error fetching featured artists batch:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [itemsPerPage, lng, getBatchForPage],
  );

  // Update visible artists when page changes
  useEffect(() => {
    const updateVisibleArtists = async () => {
      const pageKey = `page-${currentPage}`;

      // If we already have this page cached, show it immediately
      if (cachedData.current[pageKey]) {
        setVisibleArtists(cachedData.current[pageKey].offers);
        return;
      }

      // Otherwise fetch the batch containing this page
      await fetchArtistBatch(currentPage);

      // After fetching, try again to get the page from cache
      if (cachedData.current[pageKey]) {
        setVisibleArtists(cachedData.current[pageKey].offers);
      } else {
        setVisibleArtists([]);
      }
    };

    updateVisibleArtists();
  }, [currentPage, fetchArtistBatch]);

  // Prefetch the next batch when user gets close to the end of current batch
  useEffect(() => {
    const { endPage } = getBatchForPage(currentPage);
    const nextBatch = getBatchForPage(endPage + 1);

    // If we're on the last page of a batch, prefetch the next batch
    if (
      currentPage === endPage &&
      !fetchedRanges.current.has(nextBatch.batchKey)
    ) {
      fetchArtistBatch(endPage + 1);
    }
  }, [currentPage, fetchArtistBatch, getBatchForPage]);

  if (!lng) return null;

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < maxPage) {
      setCurrentPage((prev) => prev + 1);
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
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
        {isLoading && visibleArtists.length === 0 ? (
          <div className="col-span-full text-center">{t('loading')}</div>
        ) : visibleArtists.length === 0 ? (
          <div className="col-span-full text-center">No artists found</div>
        ) : (
          visibleArtists.map((artist, index) => (
            <div
              key={index}
              className="flex h-full flex-col rounded-lg border p-6 text-left"
            >
              <img
                src={artist.imageUrl}
                alt={artist.bandName}
                className="mb-6 h-80 w-full rounded-lg object-cover"
                loading={index < itemsPerPage ? 'eager' : 'lazy'}
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
          ))
        )}
      </div>
      <div className="mt-6 flex items-center justify-center gap-2 md:mt-10 md:gap-4">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1 || isLoading}
          className="group flex items-center justify-center rounded-full p-1 transition
             hover:bg-teal-100 disabled:hover:bg-transparent md:p-2"
          aria-label="Previous testimonials"
        >
          <ChevronLeftCircle
            width={24}
            height={24}
            className={`${
              currentPage === 1 ? 'opacity-50' : ''
            } text-[#15b7b9] transition-colors group-hover:text-[#0d7a7b] group-disabled:group-hover:text-[#15b7b9]`}
          />
        </button>

        <div className="flex items-center gap-1 px-2 md:gap-2">
          {Array.from({ length: maxPage }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              disabled={isLoading && !cachedData.current[`page-${index + 1}`]}
              className={`h-2 w-2 rounded-full md:h-3 md:w-3 ${
                currentPage === index + 1 ? 'bg-[#15b7b9]' : 'bg-gray-300'
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
        <button
          onClick={handleNext}
          disabled={currentPage === maxPage || isLoading}
          className="group flex items-center justify-center rounded-full p-1 transition
             hover:bg-teal-100 disabled:hover:bg-transparent md:p-2"
          aria-label="Next testimonials"
        >
          <ChevronRightCircle
            width={24}
            height={24}
            className={`${currentPage === maxPage ? 'opacity-50' : ''} text-[#15b7b9] 
                transition-colors group-hover:text-[#0d7a7b] group-disabled:group-hover:text-[#15b7b9]`}
          />
        </button>
      </div>
    </section>
  );
}
