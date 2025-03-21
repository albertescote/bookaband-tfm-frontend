import OffersList from '@/components/home/offersList';
import { useTranslation } from '@/app/i18n';
import { getAllOffersDetails } from '@/service/backend/offer/service/offer.service';

interface PageParams {
  params: {
    lng: string;
  };
}

export default async function Home({ params: { lng } }: PageParams) {
  const offersDetails = await getAllOffersDetails();
  const { t } = await useTranslation(lng, 'home');

  return (
    <main>
      <div className="flex min-h-[75vh] flex-col items-center justify-center bg-gradient-to-r from-[#e6f0ff] to-[#e6f8ff] p-4">
        {offersDetails.length > 0 ? (
          <OffersList lng={lng} offers={offersDetails} />
        ) : (
          <div className="text-center text-gray-600">{t('no-offers')}</div>
        )}
      </div>
    </main>
  );
}
