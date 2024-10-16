'use client';
import { useTranslation } from '@/app/i18n';
import { Offer } from '@/service/backend/domain/offer';

export async function BandOffer({
  language,
  offer,
}: {
  language: string;
  offer?: Offer;
}) {
  const { t } = await useTranslation(language, 'manage-offers');
  const navigateToCreateOffer = () => {};

  return (
    <div>
      {offer ? (
        <div>Hola</div>
      ) : (
        <div>
          <button
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] px-3 py-1.5 font-bold text-white transition hover:from-[#b4c6ff] hover:to-[#b4e6ff]"
            onClick={navigateToCreateOffer}
          >
            {t('create-offer-button')}
          </button>
        </div>
      )}
    </div>
  );
}
