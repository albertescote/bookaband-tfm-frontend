import Link from 'next/link';
import { useTranslation } from '@/app/i18n';
import { OfferDetails } from '@/service/backend/offer/domain/offerDetails';
import { getAvatar } from '@/components/shared/avatar';

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
              {getAvatar(96, 96, offer.imageUrl, offer.bandName)}
              <div className="ml-6 flex-1">
                <h2 className="mb-1 text-2xl font-semibold">
                  {offer.bandName}
                </h2>
                <p className="text-gray-600">
                  {t('genre') + ': ' + offer.genre}
                </p>
              </div>
              <div className="text-right">
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
