'use client';

import { useTranslation } from '@/app/i18n/client';
import { FaStar } from 'react-icons/fa';
import { ChevronLeftCircle, ChevronRightCircle } from 'lucide-react';
import { useState } from 'react';

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

  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(0);

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

  const translateX = `-${currentPage * 50}%`;

  return (
    <section className="bg-gray-50 py-16">
      <h2 className="mb-12 text-center text-3xl font-bold">
        {t('testimonials-title')}
      </h2>

      {/* Slider */}
      <div className="relative mx-auto max-w-[1100px] overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            width: `${(testimonials.length / itemsPerPage) * 100}%`,
            transform: `translateX(${translateX})`,
          }}
        >
          {testimonials.map((testimonial, index) => (
            <div key={index} className="flex w-1/3 flex-col p-4">
              <div className="flex h-full flex-col justify-between rounded-xl border bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <h3 className="text-lg font-bold">{testimonial.name}</h3>
                    <div className="flex text-yellow-400">
                      {Array.from({ length: testimonial.rating }).map(
                        (_, starIndex) => (
                          <FaStar key={starIndex} />
                        ),
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">{testimonial.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10 flex justify-center gap-4">
        <button
          onClick={handlePrev}
          disabled={currentPage === 0}
          className={`${currentPage === 0 ? 'opacity-50' : 'group flex items-center justify-center rounded-full p-2 transition hover:bg-teal-100'}`}
        >
          <ChevronLeftCircle
            width={30}
            height={30}
            className="text-[#15b7b9] transition-colors group-hover:text-[#0d7a7b]"
          />
        </button>
        <button
          onClick={handleNext}
          disabled={currentPage === maxPage}
          className={`${currentPage === maxPage ? 'opacity-50' : 'group flex items-center justify-center rounded-full p-2 transition hover:bg-teal-100'}`}
        >
          <ChevronRightCircle
            width={30}
            height={30}
            className="text-[#15b7b9] transition-colors group-hover:text-[#0d7a7b]"
          />
        </button>
      </div>
    </section>
  );
}
