import { getOfferDetailsById } from '@/service/backend/api';
import OfferCard from '@/components/offer-details/offerCard';
import { OfferDetails } from '@/service/backend/domain/offerDetails';

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
  const offerDetails: OfferDetails | undefined =
    searchParams?.id && typeof searchParams.id === 'string'
      ? await getOfferDetailsById(searchParams.id)
      : undefined;

  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-gradient-to-r from-[#e6f0ff] to-[#e6f8ff] py-12">
      <OfferCard language={lng} offerDetails={offerDetails}></OfferCard>
    </div>
  );
}
