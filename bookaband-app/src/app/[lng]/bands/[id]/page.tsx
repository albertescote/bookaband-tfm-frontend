import { getBandProfileById } from '@/service/backend/band/service/band.service';
import { fetchMusicalStyles } from '@/service/backend/musicalStyle/service/musicalStyle.service';
import { fetchEventTypes } from '@/service/backend/eventTypes/service/eventType.service';
import BandDetails from '@/components/bands/BandDetails';
import BandErrorScreen from '@/components/bands/BandErrorScreen';
import { MusicalStyle } from '@/service/backend/musicalStyle/domain/musicalStyle';
import { EventType } from '@/service/backend/eventTypes/domain/eventType';

interface PageParams {
  params: {
    lng: string;
    id: string;
  };
}

export default async function Page({ params: { lng, id } }: PageParams) {
  try {
    const [bandProfile, musicalStyles, eventTypes] = await Promise.all([
      getBandProfileById(id),
      fetchMusicalStyles(),
      fetchEventTypes(),
    ]);

    console.log(bandProfile);

    if (!bandProfile || 'message' in bandProfile) {
      return <BandErrorScreen language={lng} />;
    }

    if ('message' in musicalStyles || 'message' in eventTypes) {
      return <BandErrorScreen language={lng} />;
    }

    return (
      <BandDetails
        lng={lng}
        id={id}
        initialBandProfile={bandProfile}
        initialMusicalStyles={musicalStyles as MusicalStyle[]}
        initialEventTypes={eventTypes as EventType[]}
      />
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return <BandErrorScreen language={lng} />;
  }
}
