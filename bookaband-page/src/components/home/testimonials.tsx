'use client';

import { useTranslation } from '@/app/i18n/client';
import { FaStar } from 'react-icons/fa';
import { ChevronLeftCircle, ChevronRightCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TestimonialsParams {
  lng: string;
}

export default function Testimonials({ lng }: TestimonialsParams) {
  const { t } = useTranslation(lng, 'home');

  const testimonials = [
    {
      name: 'Emily R.',
      text: 'BookaBand hizo que encontrar el guitarrista perfecto para nuestra boda fuera tan fácil y sin estrés!',
      image: '/assets/testimonial1.jpg',
      rating: 5,
    },
    {
      name: 'James T.',
      text: 'Conecté con músicos increíbles en mi zona en cuestión de minutos. ¡Recomiendo esta plataforma!',
      image: '/assets/testimonial2.jpg',
      rating: 4,
    },
    {
      name: 'Sophia M.',
      text: 'Gracias a BookaBand, nuestra banda encontró un batería increíble para nuestra próxima gira!',
      image: '/assets/testimonial3.jpg',
      rating: 5,
    },
    {
      name: 'Liam G.',
      text: 'Encontré la banda ideal para animar nuestro evento corporativo!',
      image: '/assets/testimonial4.jpg',
      rating: 3,
    },
    {
      name: 'Olivia P.',
      text: 'Increíble plataforma, muy fácil para encontrar músicos disponibles!',
      image: '/assets/testimonial5.jpg',
      rating: 5,
    },
    {
      name: 'Noah D.',
      text: 'Muy buena experiencia, sin duda volveré a usar BookaBand!',
      image: '/assets/testimonial6.jpg',
      rating: 4,
    },
  ];

  // Responsive state for items per page
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(0);

  // Update items per page based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1); // Mobile: show 1 per page
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2); // Tablet: show 2 per page
      } else {
        setItemsPerPage(3); // Desktop: show 3 per page
      }

      // Reset to first page when layout changes to avoid empty pages
      setCurrentPage(0);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxPage = Math.ceil(testimonials.length / itemsPerPage) - 1;

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

  // Calculate card width based on items per page
  const cardWidth = 100 / itemsPerPage;

  // Calculate translation value for the slider - move by itemsPerPage cards at a time
  const translateX = `-${currentPage * ((100 / testimonials.length) * itemsPerPage)}%`;

  return (
    <section className="bg-gray-50 py-8 md:py-12 lg:py-16">
      <h2 className="mb-8 text-center text-2xl font-bold md:mb-12 md:text-3xl">
        {t('testimonials-title')}
      </h2>

      <div className="relative mx-auto w-full max-w-[90%] overflow-hidden md:max-w-[95%] lg:max-w-[1100px]">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            width: `${testimonials.length * (100 / itemsPerPage)}%`,
            transform: `translateX(${translateX})`,
          }}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="px-2 md:px-4"
              style={{ width: `${cardWidth}%` }}
            >
              <div className="flex h-full flex-col justify-between rounded-xl border bg-white p-4 shadow-sm md:p-6">
                <div className="mb-4 flex flex-col items-center gap-2 sm:flex-row sm:items-start md:gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full object-cover md:h-16 md:w-16"
                  />
                  <div className="flex flex-col items-center sm:items-start">
                    <h3 className="text-center text-base font-bold sm:text-left md:text-lg">
                      {testimonial.name}
                    </h3>
                    <div className="flex text-sm text-yellow-400 md:text-base">
                      {Array.from({ length: testimonial.rating }).map(
                        (_, starIndex) => (
                          <FaStar key={starIndex} />
                        ),
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 md:text-base">
                  {testimonial.text}
                </p>
              </div>
            </div>
          ))}
        </div>
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
        {/* Show page indicators for better UX */}
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
