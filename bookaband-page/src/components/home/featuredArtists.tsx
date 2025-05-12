'use client';

import { useTranslation } from '@/app/i18n/client';
import {
  ArtistsFeaturedResponse,
  fetchFeaturedArtists,
} from '@/service/backend/artist/service/artist.service';
import { useEffect, useState } from 'react';
import { ChevronLeftCircle, ChevronRightCircle } from 'lucide-react';

interface FeaturedArtistsParams {
  lng: string;
}

export default function FeaturedArtists({ lng }: FeaturedArtistsParams) {
  const { t } = useTranslation(lng, 'home');
  const [artists, setArtists] = useState<ArtistsFeaturedResponse>({
    offers: [],
    hasMore: false,
    total: 0,
  });
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(0);
  const [maxPage, setMaxPage] = useState(0);

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
      setCurrentPage(0); // reset to first page on resize
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch data when page or pageSize change
  useEffect(() => {
    fetchFeaturedArtists(currentPage, itemsPerPage).then((result) => {
      setArtists(result);
      setMaxPage(Math.max(0, Math.ceil(result.total / itemsPerPage) - 1));
    });
  }, [currentPage, itemsPerPage]);

  if (!lng) return null;

  const handlePrev = () => {
    if (currentPage > 0) {
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
      <h2 className="mb-12 text-center text-3xl font-bold">
        {t('featured-musicians-title')}
      </h2>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
        {artists.offers.map((artist, index) => (
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
      <div className="mt-6 flex items-center justify-center gap-2 md:mt-10 md:gap-4">
        <button
          onClick={handlePrev}
          disabled={currentPage === 0}
          className="group flex items-center justify-center rounded-full p-1 transition hover:bg-teal-100 disabled:cursor-not-allowed md:p-2"
          aria-label="Previous testimonials"
        >
          <ChevronLeftCircle
            width={24}
            height={24}
            className={`${currentPage === 0 ? 'opacity-50' : ''} text-[#15b7b9] transition-colors group-hover:text-[#0d7a7b]`}
          />
        </button>
        <div className="flex items-center gap-1 px-2 md:gap-2">
          {Array.from({ length: maxPage + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`h-2 w-2 rounded-full md:h-3 md:w-3 ${
                currentPage === index ? 'bg-[#15b7b9]' : 'bg-gray-300'
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
        <button
          onClick={handleNext}
          disabled={currentPage === maxPage}
          className="group flex items-center justify-center rounded-full p-1 transition hover:bg-teal-100 disabled:cursor-not-allowed md:p-2"
          aria-label="Next testimonials"
        >
          <ChevronRightCircle
            width={24}
            height={24}
            className={`${currentPage === maxPage ? 'opacity-50' : ''} text-[#15b7b9] transition-colors group-hover:text-[#0d7a7b]`}
          />
        </button>
      </div>
    </section>
  );
}
