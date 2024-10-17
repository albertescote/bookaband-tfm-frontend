import { useTranslation } from '@/app/i18n';
import { getOffersViewById } from '@/service/backend/api';
import { OfferView } from '@/service/backend/domain/offerView';

interface PageParams {
  params: {
    lng: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

function getRandomColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 70%, 60%)`;
}

export default async function Page({
  params: { lng },
  searchParams,
}: PageParams) {
  const { t } = await useTranslation(lng, 'offer-view');
  const offerView: OfferView | undefined =
    searchParams?.id && typeof searchParams.id === 'string'
      ? await getOffersViewById(searchParams.id)
      : undefined;

  return (
    <div className="flex h-[75vh] items-center justify-center bg-gradient-to-r from-[#e6f0ff] to-[#e6f8ff] p-4">
      <div className="w-full max-w-md transform rounded-2xl bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center">
          {offerView?.imageUrl ? (
            <img
              src={offerView.imageUrl}
              alt={offerView.bandName}
              className="h-28 w-28 rounded-full object-cover shadow-md"
            />
          ) : (
            <div
              className="flex h-28 w-28 items-center justify-center rounded-full text-4xl font-bold text-white shadow-md transition-all"
              style={{
                backgroundColor: getRandomColor(offerView?.bandName ?? 'dummy'),
              }}
            >
              {offerView?.bandName ? offerView.bandName.charAt(0) : '?'}
            </div>
          )}
          <h2 className="mt-4 text-2xl font-semibold text-gray-800">
            {offerView?.bandName}
          </h2>
          <p className="mt-2 text-lg text-gray-500">
            {t('price')}: {offerView?.price} €
          </p>
          <p className="mt-2 text-sm text-gray-600">
            {t('genre')}:{' '}
            <span className="text-gray-800">{offerView?.genre}</span>
          </p>
          {offerView?.description && (
            <p className="mt-4 text-center text-sm text-gray-600">
              {offerView.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
