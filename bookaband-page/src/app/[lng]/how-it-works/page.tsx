import { Metadata } from 'next';
import { getTranslation } from '@/app/i18n';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lng: string }>;
}): Promise<Metadata> {
  const { lng } = await params;
  const { t } = await getTranslation(lng, 'how-it-works');
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
  };
}

export default async function HowItWorksPage({
  params,
}: {
  params: Promise<{ lng: string }>;
}) {
  const { lng } = await params;
  const { t } = await getTranslation(lng, 'how-it-works');

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
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#565d6d] sm:text-4xl">
            {t('features.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#565d6d]/80">
            {t('features.subtitle')}
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(t('features.items', { returnObjects: true })).map(
            ([key, item]: [string, any]) => (
              <div
                key={key}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white p-8"
              >
                <div className="absolute right-0 top-0 h-32 w-32 -translate-y-1/2 translate-x-1/2 rounded-full bg-[#15b7b9]/5" />
                <div className="relative">
                  <h3 className="text-xl font-semibold text-[#565d6d]">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-[#565d6d]/80">{item.description}</p>
                </div>
              </div>
            ),
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#15b7b9] to-[#15b7b9]/90 p-8 md:p-12">
          <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/10" />
          <div className="relative">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {t('process.title')}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
                {t('process.subtitle')}
              </p>
            </div>
            <div className="mt-8 space-y-6 md:mt-12 md:grid md:grid-cols-3 md:gap-8 md:space-y-0">
              {Object.entries(t('process.steps', { returnObjects: true })).map(
                ([key, step]: [string, any], index) => (
                  <div key={key} className="relative flex items-start">
                    <div className="mt-1 flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-lg font-bold text-white md:h-12 md:w-12 md:text-xl">
                        {index + 1}
                      </div>
                    </div>
                    <div className="ml-4 flex-grow">
                      <h3 className="text-xl font-semibold text-white">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-white/90">{step.description}</p>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white p-8 md:p-12">
          <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-[#15b7b9]/5" />
          <div className="relative text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[#565d6d] sm:text-4xl">
              {t('cta.title')}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-[#565d6d]/80">
              {t('cta.description')}
            </p>
            <div className="mt-8">
              <Link
                href={`/${lng}/sign-up`}
                className="inline-block rounded-lg bg-[#15b7b9] px-8 py-4 text-center font-semibold text-white transition-colors hover:bg-[#15b7b9]/90"
              >
                {t('cta.button')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
