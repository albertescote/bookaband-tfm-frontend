import { Metadata } from 'next';
import { useTranslation } from '@/app/i18n';

export async function generateMetadata({
  params: { lng },
}: {
  params: { lng: string };
}): Promise<Metadata> {
  const { t } = await useTranslation(lng, 'about');
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
  };
}

export default async function AboutPage({
  params: { lng },
}: {
  params: { lng: string };
}) {
  const { t } = await useTranslation(lng, 'about');

  return (
    <div className="min-h-screen bg-white">
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#565d6d] sm:text-5xl md:text-6xl">
            {t('hero.title')}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#565d6d]/80">
            {t('hero.subtitle')}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#15b7b9] to-[#15b7b9]/90 p-8 md:p-12">
          <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/10" />
          <div className="relative">
            <h2 className="mb-6 text-3xl font-bold text-white">
              {t('mission.title')}
            </h2>
            <p className="mb-8 text-lg text-white/90">
              {t('mission.description')}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold text-[#565d6d]">
          {t('features.title')}
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="group rounded-xl border border-gray-100 bg-white p-6 transition-colors hover:border-[#15b7b9]/30">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#15b7b9]/10 transition-colors group-hover:bg-[#15b7b9]/20">
              <svg
                className="h-6 w-6 text-[#15b7b9]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="mb-4 text-xl font-semibold text-[#565d6d]">
              {t('features.band.title')}
            </h3>
            <p className="text-[#565d6d]/80">
              {t('features.band.description')}
            </p>
          </div>
          <div className="group rounded-xl border border-gray-100 bg-white p-6 transition-colors hover:border-[#15b7b9]/30">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#15b7b9]/10 transition-colors group-hover:bg-[#15b7b9]/20">
              <svg
                className="h-6 w-6 text-[#15b7b9]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="mb-4 text-xl font-semibold text-[#565d6d]">
              {t('features.booking.title')}
            </h3>
            <p className="text-[#565d6d]/80">
              {t('features.booking.description')}
            </p>
          </div>
          <div className="group rounded-xl border border-gray-100 bg-white p-6 transition-colors hover:border-[#15b7b9]/30">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#15b7b9]/10 transition-colors group-hover:bg-[#15b7b9]/20">
              <svg
                className="h-6 w-6 text-[#15b7b9]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mb-4 text-xl font-semibold text-[#565d6d]">
              {t('features.offers.title')}
            </h3>
            <p className="text-[#565d6d]/80">
              {t('features.offers.description')}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white p-8 text-center md:p-12">
          <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-[#15b7b9]/5" />
          <div className="relative">
            <h2 className="mb-4 text-3xl font-bold text-[#565d6d]">
              {t('cta.title')}
            </h2>
            <p className="mb-8 text-lg text-[#565d6d]/80">
              {t('cta.description')}
            </p>
            <a
              href={`/${lng}/sign-up`}
              className="inline-block rounded-lg bg-[#15b7b9] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#15b7b9]/90"
            >
              {t('cta.button')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
