'use client';
import { useTranslation } from '@/app/i18n/client';
import { getAvatar } from '@/components/shared/avatar';
import { getAllOffersDetails } from '@/service/backend/offer/service/offer.service';
import { useEffect, useState } from 'react';
import { OfferDetails } from '@/service/backend/offer/domain/offerDetails';
import { useRouter } from 'next/navigation';

interface OffersListParams {
  lng: string;
}

export default function OffersList({ lng }: OffersListParams) {
  const { t } = useTranslation(lng, 'home');
  const [offers, setOffers] = useState<OfferDetails[]>([]);
  const router = useRouter();

  useEffect(() => {
    getAllOffersDetails().then((offers) => {
      setOffers(offers);
    });
  }, []);

  const navigateToDetails = (id: string) => {
    router.push(`/${lng}/offer-details?id=${id}`);
  };

  return (
    <div>
      {offers.length > 0 ? (
        <div className="flex h-full w-full max-w-4xl flex-col gap-6 overflow-y-auto p-6">
          {offers.map((offer) => (
            <button
              key={offer.id}
              onClick={() => navigateToDetails(offer.id)}
              className="w-full"
            >
              <div className="flex w-full items-center rounded-lg border border-gray-200 bg-white p-6 shadow-lg transition-transform hover:scale-105">
                <div className="flex flex-1 items-center justify-start">
                  {getAvatar(96, 96, offer.imageUrl, offer.bandName)}
                  <div className="ml-6 text-left">
                    <h2 className="mb-1 text-2xl font-semibold">
                      {offer.bandName}
                    </h2>
                    <p className="text-gray-600">
                      {t('genre') + ': ' + offer.genre}
                    </p>
                  </div>
                </div>
                <div className="flex-1 text-right">
                  <p className="mb-1">{offer.description}</p>
                  <h2 className="font-semibold">
                    {t('price') + ': ' + offer.price + ' €'}
                  </h2>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600">{t('no-offers')}</div>
      )}
    </div>
  );
}
