import { getBandById } from '@/service/backend/band/service/band.service';
import BandDetails from '@/components/bands/BandDetails';
import BandErrorScreen from '@/components/bands/BandErrorScreen';

interface PageParams {
  params: {
    lng: string;
    id: string;
  };
}

export default async function Page({ params: { lng, id } }: PageParams) {
  try {
    const band = await getBandById(id);
    if (!band) {
      return <BandErrorScreen language={lng} />;
    }

    return <BandDetails language={lng} bandId={id} initialBand={band} />;
  } catch (error) {
    console.error('Error fetching band:', error);
    return <BandErrorScreen language={lng} />;
  }
}
