import { useTranslation } from '@/app/i18n';
import { Offer } from '@/service/backend/domain/offer';

interface OffersListParams {
  lng: string;
  offers: Offer[];
}

export default async function OffersList({ lng, offers }: OffersListParams) {
  const { t } = await useTranslation(lng, 'home');
  return (
    <div className="flex h-full w-full max-w-4xl flex-col gap-6 overflow-y-auto p-4">
      {offers.map((offer) => (
        <button>
          <div
            key={offer.id}
            className="flex items-center rounded-lg border border-gray-200 bg-white p-6 shadow-lg"
          >
            <img
              src={offer.imageUrl}
              alt={offer.bandName}
              className="mr-6 h-24 w-24 rounded-full object-cover"
            />

            <div className="flex-1">
              <h2 className="mb-1 text-2xl font-semibold">{offer.bandName}</h2>
              <p className="text-gray-600">{t('genre') + ': ' + offer.genre}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
