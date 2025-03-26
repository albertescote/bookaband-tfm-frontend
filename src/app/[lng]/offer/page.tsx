import OfferForm from '@/components/offer/offerForm';

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
  const bandId: string | undefined = searchParams?.band_id;
  const offerId: string | undefined = searchParams?.id;

  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-gradient-to-r from-[#e6f0ff] to-[#e6f8ff]">
      <OfferForm language={lng} bandId={bandId} offerId={offerId}></OfferForm>
    </div>
  );
}
