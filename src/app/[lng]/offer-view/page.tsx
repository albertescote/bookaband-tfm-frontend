import { getOffersViewById } from '@/service/backend/api';
import { OfferView } from '@/service/backend/domain/offerView';
import OfferCard from '@/components/offer-view/offerCard';

interface PageParams {
  params: {
    lng: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function Page({
  params: { lng },
  searchParams,
}: PageParams) {
  const offerView: OfferView | undefined =
    searchParams?.id && typeof searchParams.id === 'string'
      ? await getOffersViewById(searchParams.id)
      : undefined;

  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-gradient-to-r from-[#e6f0ff] to-[#e6f8ff] py-12">
      <OfferCard language={lng} offerView={offerView}></OfferCard>
    </div>
  );
}
