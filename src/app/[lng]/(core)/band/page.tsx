import BandDetails from '@/components/band/bandDetails';
import CreateBand from '@/components/band/createBand';

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
  const bandId: string | undefined = searchParams?.id;

  return (
    <div className="flex h-[75vh] items-center justify-center bg-gradient-to-r from-[#e6f0ff] to-[#e6f8ff] p-4">
      <div className="w-full max-w-md transform rounded-2xl bg-white p-8 shadow-lg">
        {!!bandId ? (
          <BandDetails language={lng} bandId={bandId}></BandDetails>
        ) : (
          <CreateBand language={lng}></CreateBand>
        )}
      </div>
    </div>
  );
}
