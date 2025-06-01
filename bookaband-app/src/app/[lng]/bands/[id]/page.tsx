import { getBandById } from '@/service/backend/band/service/band.service';
import BandDetails from '@/components/bands/BandDetails';

interface PageParams {
  params: {
    lng: string;
    id: string;
  };
}

export default async function Page({ params: { lng, id } }: PageParams) {
  const band = await getBandById(id);
  console.log(band);
  if (!band) {
    throw new Error('Band not found');
  }

  return <BandDetails language={lng} bandId={id} initialBand={band} />;
}
