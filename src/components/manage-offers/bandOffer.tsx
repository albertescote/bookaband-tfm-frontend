'use client';
import { useTranslation } from '@/app/i18n/client';
import { Offer } from '@/service/backend/domain/offer';
import { PencilIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/navigation';

export function BandOffer({
  language,
  offer,
  bandId,
}: {
  language: string;
  bandId: string;
  offer?: Offer;
}) {
  const { t } = useTranslation(language, 'manage-offers');
  const router = useRouter();
  const navigateToCreateOffer = () => {
    router.push(`/offer?band_id=${bandId}`);
  };
  const navigateToViewOfferDetails = () => {
    router.push(`/offer?id=${offer!.id}`);
  };

  return (
    <div>
      {offer ? (
        <div className="flex items-center justify-between rounded border border-gray-200 p-4 shadow-sm">
          <div>
            <p>
              <strong>{t('id')}:</strong> {offer.id}
            </p>
            <p>
              <strong>{t('price')}:</strong> {offer.price} €
            </p>
            {offer.description && (
              <p>
                <strong>{t('description')}:</strong> {offer.description}
              </p>
            )}
          </div>
          <PencilIcon
            className="ml-8 h-5 w-5 cursor-pointer"
            onClick={navigateToViewOfferDetails}
            aria-label="View offer details"
          />
        </div>
      ) : (
        <button
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] px-3 py-1.5 font-bold text-white transition hover:from-[#b4c6ff] hover:to-[#b4e6ff]"
          onClick={navigateToCreateOffer}
        >
          {t('create-offer-button')}
        </button>
      )}
    </div>
  );
}
