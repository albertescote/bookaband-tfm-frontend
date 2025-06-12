'use client';

import { useTranslation } from '@/app/i18n/client';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroParams {
  lng: string;
}

export default function Hero({ lng }: HeroParams) {
  const { t } = useTranslation(lng, 'home');
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const slides = t('slides', { returnObjects: true }) as {
    title: string;
    subtitle: string;
    image: string;
  }[];

  const startAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 5000);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    startAutoSlide();
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    startAutoSlide();
  };

  useEffect(() => {
    startAutoSlide();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative h-screen max-h-[600px] sm:h-[70vh]">
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${current * 100}vw)`,
            width: `${slides.length * 100}vw`,
          }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="h-full w-screen flex-shrink-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${slide.image}')` }}
            >
              <div className="flex h-full items-center justify-center bg-black bg-opacity-40 p-4 text-center text-white">
                <div>
                  <h1 className="mb-2 text-2xl font-bold sm:text-3xl md:mb-4 md:text-4xl lg:text-5xl xl:text-6xl">
                    {slide.title}
                  </h1>
                  <p className="mb-4 text-sm sm:text-base md:mb-6 md:text-lg lg:text-xl xl:text-2xl">
                    {slide.subtitle}
                  </p>
                  <button
                    onClick={() => router.push(`/${lng}/how-it-works`)}
                    className="rounded-full bg-[#15b7b9] px-4 py-2 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#f3f4f6] hover:text-[#15b7b9] sm:px-6 sm:py-3 sm:text-base"
                  >
                    {t('hero-button')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white bg-opacity-30 p-1 transition-all duration-300 hover:bg-opacity-50 sm:left-4 sm:p-2"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} className="sm:h-8 sm:w-8" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white bg-opacity-30 p-1 transition-all duration-300 hover:bg-opacity-50 sm:right-4 sm:p-2"
          aria-label="Next slide"
        >
          <ChevronRight size={24} className="sm:h-8 sm:w-8" />
        </button>

        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrent(index);
                startAutoSlide();
              }}
              className={`h-2 w-2 rounded-full transition-all duration-300 sm:h-3 sm:w-3 ${
                current === index
                  ? 'scale-125 bg-white'
                  : 'bg-white bg-opacity-50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
