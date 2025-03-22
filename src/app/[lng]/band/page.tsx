import BandDetails from '@/components/band/bandDetails';
import CreateBand from '@/components/band/createBand';
import { getBandDetailsById } from '@/service/backend/band/service/band.service';
import { BandWithDetails } from '@/service/backend/band/domain/bandWithDetails';

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
  const band: BandWithDetails | undefined =
    searchParams?.id && typeof searchParams.id === 'string'
      ? await getBandDetailsById(searchParams.id)
      : undefined;

  return (
    <div className="flex h-[75vh] items-center justify-center bg-gradient-to-r from-[#e6f0ff] to-[#e6f8ff] p-4">
      <div className="w-full max-w-md transform rounded-2xl bg-white p-8 shadow-lg">
        {!!band ? (
          <BandDetails language={lng} band={band}></BandDetails>
        ) : (
          <CreateBand language={lng}></CreateBand>
        )}
      </div>
    </div>
  );
}
