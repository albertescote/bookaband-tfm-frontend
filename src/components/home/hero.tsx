'use client';

import { useTranslation } from '@/app/i18n/client';

interface HeroParams {
  lng: string;
}

export default function Hero({ lng }: HeroParams) {
  const { t } = useTranslation(lng, 'home');

  return (
    <section className="relative w-full">
      <div
        className="relative h-[70vh] bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/landing-hero.jpeg')" }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 p-6 text-center text-white">
          <h1 className="mb-4 text-4xl font-bold md:text-6xl">
            {t('hero-title')}
          </h1>
          <p className="mb-6 text-lg md:text-2xl">{t('hero-subtitle')}</p>
          <button className="rounded-full bg-[#15b7b9] px-6 py-3 font-semibold text-white hover:bg-[#f3f4f6] hover:text-[#15b7b9]">
            {t('hero-button')}
          </button>
        </div>
      </div>
    </section>
  );
}
