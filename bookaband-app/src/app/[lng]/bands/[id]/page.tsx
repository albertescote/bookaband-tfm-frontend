import { getBandProfileById } from '@/service/backend/band/service/band.service';
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
    const bandProfile = await getBandProfileById(id);
    if (!bandProfile) {
      return <BandErrorScreen language={lng} />;
    }

    return (
      <BandDetails
        language={lng}
        bandId={id}
        initialBandProfile={bandProfile}
      />
    );
  } catch (error) {
    console.error('Error fetching band profile:', error);
    return <BandErrorScreen language={lng} />;
  }
}
