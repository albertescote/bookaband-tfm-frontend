import CreateBandForm from '@/components/bands/CreateBandForm';
import { fetchMusicalStyles } from '@/service/backend/musicalStyle/service/musicalStyle.service';
import { fetchEventTypes } from '@/service/backend/eventTypes/service/eventType.service';
import { MusicalStyle } from '@/service/backend/musicalStyle/domain/musicalStyle';
import { EventType } from '@/service/backend/eventTypes/domain/eventType';
import BandErrorScreen from '@/components/bands/BandErrorScreen';

interface PageParams {
  params: {
    lng: string;
  };
}

export default async function Page({ params: { lng } }: PageParams) {
  try {
    const [musicalStyles, eventTypes] = await Promise.all([
      fetchMusicalStyles(),
      fetchEventTypes(),
    ]);

    if ('message' in musicalStyles || 'message' in eventTypes) {
      return <BandErrorScreen language={lng} />;
    }

    return (
      <CreateBandForm
        language={lng}
        musicalStyles={musicalStyles as MusicalStyle[]}
        eventTypes={eventTypes as EventType[]}
      />
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}
