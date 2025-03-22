'use client';
import { useTranslation } from '@/app/i18n/client';
import { EyeIcon, EyeOffIcon, PencilIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

export function BandOffers({ language }: { language: string }) {
  const { t } = useTranslation(language, 'manage-offers');
  const { userBands } = useAuth().userBands;
  const router = useRouter();
  const navigateToViewOfferDetails = (offerId: string) => {
    router.push(`/offer?id=${offerId}`);
  };
  const navigateToCreateOffer = (bandId: string) => {
    router.push(`/offer?band_id=${bandId}`);
  };

  return (
    <div>
      {!!userBands && userBands.length > 0 ? (
        userBands.map((band) => (
          <div key={band.id} className="my-8 flex items-center justify-between">
            <h3 className="mr-4 text-lg font-semibold text-gray-800">
              {band.name}
            </h3>
            {band.offer ? (
              <div className="flex items-center justify-between rounded border border-gray-200 p-4 shadow-sm">
                <div>
                  <p>
                    <strong>{t('id')}:</strong> {band.offer.id}
                  </p>
                  <p>
                    <strong>{t('price')}:</strong> {band.offer.price} €
                  </p>
                  {band.offer.description && (
                    <p>
                      <strong>{t('description')}:</strong>{' '}
                      {band.offer.description}
                    </p>
                  )}
                </div>
                {band.offer.visible && <EyeIcon className="h-4 w-4" />}
                {!band.offer.visible && <EyeOffIcon className="h-4 w-4" />}
                <PencilIcon
                  className="ml-8 h-5 w-5 cursor-pointer"
                  onClick={() => navigateToViewOfferDetails(band.offer!.id)}
                  aria-label="View offer details"
                />
              </div>
            ) : (
              <button
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] px-3 py-1.5 font-bold text-white transition hover:from-[#b4c6ff] hover:to-[#b4e6ff]"
                onClick={() => navigateToCreateOffer(band.id)}
              >
                {t('create-offer-button')}
              </button>
            )}
          </div>
        ))
      ) : (
        <h1 className="text-center">{t('not-in-a-band-yet')}</h1>
      )}
    </div>
  );
}
