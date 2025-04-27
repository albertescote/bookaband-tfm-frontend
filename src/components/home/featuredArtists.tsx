'use client';

import { useTranslation } from '@/app/i18n/client';

interface FeaturedArtistsParams {
  lng: string;
}

export default function FeaturedArtists({ lng }: FeaturedArtistsParams) {
  const { t } = useTranslation(lng, 'home');

  const musicians = [
    {
      name: 'Alex Romero',
      genre: 'Techno',
      description:
        'DJ especializado en ritmos electrónicos intensos y atmósferas hipnóticas.',
      image: '/assets/musician1.jpg',
    },
    {
      name: 'James Reed',
      genre: 'Jazz',
      description: 'Cautiva al público con melodías suaves.',
      image: '/assets/musician2.jpg',
    },
    {
      name: 'Sophia Lane',
      genre: 'Pop',
      description: 'Crea melodías pegajosas y ritmos dinámicos.',
      image: '/assets/musician3.jpg',
    },
  ];

  return (
    <section className="py-16">
      <h2 className="mb-12 text-center text-3xl font-bold">
        {t('featured-musicians-title')}
      </h2>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
        {musicians.map((musician, index) => (
          <div
            key={index}
            className="flex h-full flex-col rounded-lg border p-6 text-left"
          >
            <img
              src={musician.image}
              alt={musician.name}
              className="mb-6 h-80 w-full rounded-lg object-cover"
            />
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <h3 className="mb-2 text-xl font-semibold">{musician.name}</h3>
                <p className="mb-1 text-gray-500">{`${t('genre')}: ${musician.genre}`}</p>
                <p className="mb-4">{musician.description}</p>
              </div>
              <button className="w-full rounded-lg border border-[#15b7b9] px-4 py-2 text-[#15b7b9] hover:bg-[#15b7b9] hover:text-white">
                {t('view-profile')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
