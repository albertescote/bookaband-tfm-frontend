import OffersList from '@/components/offer/offersList';
import { getAllOffersView } from '@/service/backend/api';
import { useTranslation } from '@/app/i18n';

interface PageParams {
  params: {
    lng: string;
  };
}

export default async function Home({ params: { lng } }: PageParams) {
  const offers = await getAllOffersView();
  const { t } = await useTranslation(lng, 'home');

  return (
    <main>
      <div className="flex min-h-[75vh] flex-col items-center justify-center bg-gradient-to-r from-[#e6f0ff] to-[#e6f8ff] p-4">
        {offers.length > 0 ? (
          <OffersList lng={lng} offers={offers} />
        ) : (
          <div className="text-center text-gray-600">{t('no-offers')}</div>
        )}
      </div>
    </main>
  );
}
