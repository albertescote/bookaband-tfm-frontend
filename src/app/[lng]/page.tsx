import Image from 'next/image';
import { useTranslation } from '@/app/i18n';

interface PageParams {
  params: {
    lng: string;
  };
}

export default async function Home({ params: { lng } }: PageParams) {
  const { t } = await useTranslation(lng, 'home');
  return (
    <main>
      <section className="h-[75vh] bg-gradient-to-r from-[#e6f0ff] to-[#e6f8ff] py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h1 className="text-3xl font-bold md:text-4xl">
                {t('main-title')}
              </h1>
              <p className="mt-4">{t('main-description')}</p>
            </div>
            <div>
              <Image
                alt="Barter Concept"
                className="w-full rounded-lg object-cover"
                height="400"
                src="/assets/main-barter.jpg"
                style={{
                  aspectRatio: '600/400',
                  objectFit: 'cover',
                }}
                width="600"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
