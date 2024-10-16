import { getBandOffer, getUserBands } from '@/service/backend/api';
import { useTranslation } from '@/app/i18n';
import { BandOffer } from '@/components/manage-offers/bandOffer';
import { UserBand } from '@/service/backend/domain/userBand';

interface PageParams {
  params: {
    lng: string;
  };
}

export default async function Page({ params: { lng } }: PageParams) {
  const { t } = await useTranslation(lng, 'manage-offers');
  const userBands = await getUserBands().then(async (bands) => {
    let bandsWithOffers = [];
    if (!bands) {
      return undefined;
    }
    for (const band of bands as UserBand[]) {
      const offer = await getBandOffer(band.id);
      bandsWithOffers.push({ ...band, offer });
    }
    return bandsWithOffers;
  });

  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-gradient-to-r from-[#e6f0ff] to-[#e6f8ff] p-4 py-12">
      <div className="w-full max-w-md transform rounded-2xl bg-white p-8 shadow-lg">
        {!!userBands && userBands.length > 0 ? (
          userBands.map((band) => (
            <BandOffer language={lng} offer={band.offer}></BandOffer>
          ))
        ) : (
          <h1 className="text-center">{t('not-in-a-band-yet')}</h1>
        )}
      </div>
    </div>
  );
}
