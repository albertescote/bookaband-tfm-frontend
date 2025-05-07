'use client';

import { useTranslation } from '@/app/i18n/client';

interface CallToActionParams {
  lng: string;
}

export default function CallToAction({ lng }: CallToActionParams) {
  const { t } = useTranslation(lng, 'home');

  return (
    <section className="py-16">
      <div
        className="mx-auto max-w-4xl rounded-lg bg-cover bg-center p-12 text-center text-white"
        style={{ backgroundImage: "url('/assets/landing-sound.jpg')" }}
      >
        <h2 className="mb-4 mt-12 text-3xl font-bold">{t('cta-title')}</h2>
        <p className="mb-6 mt-6">{t('cta-description')}</p>
        <button className="rounded-full bg-white px-6 py-3 font-semibold text-[#15b7b9] hover:bg-teal-100">
          {t('cta-button')}
        </button>
      </div>
    </section>
  );
}
