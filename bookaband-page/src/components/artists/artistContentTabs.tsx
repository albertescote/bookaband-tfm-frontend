'use client';

import { useTranslation } from '@/app/i18n/client';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/shared/tabs';
import { MediaTab } from '@/components/artists/mediaTab';
import { ReviewsTab } from '@/components/artists/reviewsTab';
import { EventType } from '@/service/backend/filters/domain/eventType';
import EventsTab from '@/components/artists/eventsTab';
import { ArtistDetails } from '@/service/backend/artist/domain/artistDetails';

export function ArtistContentsTab({
  artist,
  language,
  eventTypes,
}: {
  artist: ArtistDetails;
  language: string;
  eventTypes: EventType[];
}) {
  const { t } = useTranslation(language, 'artists');

  return (
    <Tabs defaultValue="media" className="mt-6">
      <TabsList className="w-full justify-start border-b">
        <TabsTrigger value="media">
          {t('media')} ({artist.media?.length ?? 0})
        </TabsTrigger>
        <TabsTrigger value="events">
          {t('events')} ({artist.events?.length ?? 0})
        </TabsTrigger>
        <TabsTrigger value="reviews">
          {t('reviews')} ({artist.reviewCount})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="media">
        <MediaTab artist={artist} t={t} />
      </TabsContent>
      <TabsContent value="events">
        <EventsTab
          artist={artist}
          language={language}
          eventTypes={eventTypes}
        />
      </TabsContent>
      <TabsContent value="reviews">
        <ReviewsTab t={t} reviews={artist.reviews} language={language} />
      </TabsContent>
    </Tabs>
  );
}
