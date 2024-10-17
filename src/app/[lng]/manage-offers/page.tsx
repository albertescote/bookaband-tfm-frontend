import { getUserBands } from '@/service/backend/api';
import { useTranslation } from '@/app/i18n';
import { BandOffer } from '@/components/manage-offers/bandOffer';

interface PageParams {
  params: {
    lng: string;
  };
}

export default async function Page({ params: { lng } }: PageParams) {
  const { t } = await useTranslation(lng, 'manage-offers');
  const userBands = await getUserBands();

  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-gradient-to-r from-[#e6f0ff] to-[#e6f8ff] p-4 py-12">
      <div className="w-full min-w-[90vh] max-w-md transform rounded-2xl bg-white p-8 shadow-lg">
        {!!userBands && userBands.length > 0 ? (
          userBands.map((band) => (
            <div className="my-8 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                {band.name}
              </h3>
              <BandOffer
                language={lng}
                bandId={band.id}
                offer={band.offer}
              ></BandOffer>
            </div>
          ))
        ) : (
          <h1 className="text-center">{t('not-in-a-band-yet')}</h1>
        )}
      </div>
    </div>
  );
}
