import OfferForm from '@/components/offer/offerForm';
import { getOfferById } from '@/service/backend/api';

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
  const bandId = searchParams?.band_id as string | undefined;
  const offer =
    searchParams?.id && typeof searchParams.id === 'string'
      ? await getOfferById(searchParams.id)
      : undefined;
  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-gradient-to-r from-[#e6f0ff] to-[#e6f8ff]">
      <OfferForm language={lng} bandId={bandId} offer={offer}></OfferForm>
    </div>
  );
}
