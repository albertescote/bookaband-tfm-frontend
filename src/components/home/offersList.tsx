import Link from 'next/link';
import { useTranslation } from '@/app/i18n';
import { OfferDetails } from '@/service/backend/offer/domain/offerDetails';
import { getRandomColor } from '@/lib/utils';

interface OffersListParams {
  lng: string;
  offers: OfferDetails[];
}

export default async function OffersList({ lng, offers }: OffersListParams) {
  const { t } = await useTranslation(lng, 'home');
  return (
    <div className="flex h-full w-full max-w-4xl flex-col gap-6 overflow-y-auto p-6">
      {offers.map((offer) => (
        <Link key={offer.id} href={`${lng}/offer-details?id=${offer.id}`}>
          <span>
            <div className="flex items-center rounded-lg border border-gray-200 bg-white p-6 shadow-lg transition-transform hover:scale-105">
              {offer.imageUrl ? (
                <img
                  src={offer.imageUrl}
                  alt={offer.bandName}
                  className="mr-6 h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div
                  className="mr-6 flex h-24 w-24 items-center justify-center rounded-full text-3xl font-bold text-white"
                  style={{
                    backgroundColor: getRandomColor(offer.bandName),
                  }}
                >
                  {offer.bandName.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <h2 className="mb-1 text-2xl font-semibold">
                  {offer.bandName}
                </h2>
                <p className="text-gray-600">
                  {t('genre') + ': ' + offer.genre}
                </p>
              </div>
              <div>
                <h2>{t('price') + ': ' + offer.price + ' €'}</h2>
                <h2>{offer.description}</h2>
              </div>
            </div>
          </span>
        </Link>
      ))}
    </div>
  );
}
