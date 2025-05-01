import OfferCard from '@/components/offer-details/offerCard';

interface PageParams {
  params: {
    lng: string;
  };
  searchParams?: { [key: string]: string | undefined };
}

export default async function Page({
  params: { lng },
  searchParams,
}: PageParams) {
  const offerId: string | undefined = searchParams?.id;

  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-gradient-to-r from-[#e6f0ff] to-[#e6f8ff] py-12">
      <OfferCard language={lng} offerId={offerId}></OfferCard>
    </div>
  );
}
