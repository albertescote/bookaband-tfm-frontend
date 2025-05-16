'use server';

import { withTokenRefreshRetry } from '@/service/backend/auth/service/auth.service';
import authorizedAxiosInstance from '@/service/authorizedAixosInstance';
import { OfferDetails } from '@/service/backend/artist/domain/offerDetails';
import { OfferOverview } from '@/service/backend/artist/domain/offerOverview';
import { BandSize } from '@/service/backend/artist/domain/bandSize';
import { ArtistDetails } from '@/service/backend/artist/domain/artistDetails';

export interface ArtistsDetailsFilteredResponse {
  offers: OfferDetails[];
  hasMore: boolean;
  total: number;
}

export interface ArtistsFeaturedResponse {
  offers: OfferOverview[];
  hasMore: boolean;
  total: number;
}

export async function fetchFilteredArtists(
  page: number = 1,
  pageSize: number = 10,
  filters?: { location?: string; date?: string; searchQuery?: string },
): Promise<ArtistsDetailsFilteredResponse> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance
      .get('/offers/details', {
        params: {
          page,
          pageSize,
          ...(filters || {}),
        },
      })
      .then((res) => res.data),
  );
}

export async function fetchFeaturedArtists(
  page: number = 1,
  pageSize: number = 10,
): Promise<ArtistsFeaturedResponse> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance
      .get('/offers/featured', {
        params: {
          page,
          pageSize,
        },
      })
      .then((res) => res.data),
  );
}

export async function fetchArtistDetailsById(
  id: string,
): Promise<ArtistDetails> {
  const EVENT_TYPE_IDS = {
    WEDDINGS: '6f64f41b-8135-4bcf-b5e5-3a47169e575f',
    PRIVATE_PARTIES: '7c223ed2-e955-4007-ac8a-f23235127ac5',
    FESTIVALS: 'ec30f141-5914-46e3-a482-39d55a097e9b',
    RESTAURANTS_HOTELS: 'd28c8f50-ef20-4e23-9992-1a6f1e540a09',
    BUSINESSES: '4d36abfe-0ce7-4ac5-a888-ce31d22cff8c',
  };

  return {
    id: 'offer_123',
    bandId: 'b4ed7600-12da-4673-960d-ff29af2606db',
    bandName: 'Calvin Harris',
    genre: 'Electronic,Dance,Hip-Hop',
    bookingDates: [
      '2025-06-15T20:00:00Z',
      '2025-07-03T18:30:00Z',
      '2025-08-10T21:00:00Z',
    ],
    description:
      'Soy Calvin Harris, DJ y productor ganador de un Grammy que crea los ritmos de tus himnos de baile favoritos. Desde «Summer» hasta estadios con entradas agotadas, mi música aporta la energía que mantiene al mundo en movimiento.',
    location: 'New York City, NY',
    featured: true,
    bandSize: BandSize.SOLO,
    equipment: ['sound', 'lighting', 'microphone'],
    eventTypeIds: ['weddings', 'festivals', 'privateParties'],
    reviewCount: 87,
    price: 275,
    imageUrl:
      'https://images.pexels.com/photos/379962/pexels-photo-379962.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 4.8,
    createdDate: new Date().toISOString(),

    bio: 'Soy Calvin Harris, DJ y productor ganador de un Grammy que crea los ritmos de tus himnos de baile favoritos. Desde «Summer» hasta estadios con entradas agotadas, mi música aporta la energía que mantiene al mundo en movimiento.',
    followers: 20100,
    following: 57,

    media: [
      {
        id: 'media1',
        url: 'https://videos.pexels.com/video-files/1692701/1692701-uhd_2560_1440_30fps.mp4',
        type: 'video',
      },
      {
        id: 'media2',
        url: 'https://images.pexels.com/photos/167467/pexels-photo-167467.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        type: 'image',
      },
      {
        id: 'media3',
        url: 'https://images.pexels.com/photos/2231756/pexels-photo-2231756.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        type: 'image',
      },
      {
        id: 'media4',
        url: 'https://images.pexels.com/photos/16118364/pexels-photo-16118364/free-photo-of-home-jugant-musica-music.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        type: 'image',
      },
      {
        id: 'media1',
        url: 'https://videos.pexels.com/video-files/1692701/1692701-uhd_2560_1440_30fps.mp4',
        type: 'video',
      },
      {
        id: 'media2',
        url: 'https://images.pexels.com/photos/167467/pexels-photo-167467.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        type: 'image',
      },
      {
        id: 'media3',
        url: 'https://images.pexels.com/photos/2231756/pexels-photo-2231756.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        type: 'image',
      },
      {
        id: 'media4',
        url: 'https://images.pexels.com/photos/16118364/pexels-photo-16118364/free-photo-of-home-jugant-musica-music.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        type: 'image',
      },
      {
        id: 'media1',
        url: 'https://videos.pexels.com/video-files/1692701/1692701-uhd_2560_1440_30fps.mp4',
        type: 'video',
      },
      {
        id: 'media2',
        url: 'https://images.pexels.com/photos/167467/pexels-photo-167467.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        type: 'image',
      },
      {
        id: 'media3',
        url: 'https://images.pexels.com/photos/2231756/pexels-photo-2231756.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        type: 'image',
      },
      {
        id: 'media4',
        url: 'https://images.pexels.com/photos/16118364/pexels-photo-16118364/free-photo-of-home-jugant-musica-music.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        type: 'image',
      },
      {
        id: 'media1',
        url: 'https://videos.pexels.com/video-files/1692701/1692701-uhd_2560_1440_30fps.mp4',
        type: 'video',
      },
      {
        id: 'media2',
        url: 'https://images.pexels.com/photos/167467/pexels-photo-167467.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        type: 'image',
      },
      {
        id: 'media3',
        url: 'https://images.pexels.com/photos/2231756/pexels-photo-2231756.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        type: 'image',
      },
      {
        id: 'media4',
        url: 'https://images.pexels.com/photos/16118364/pexels-photo-16118364/free-photo-of-home-jugant-musica-music.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        type: 'image',
      },
      {
        id: 'media1',
        url: 'https://videos.pexels.com/video-files/1692701/1692701-uhd_2560_1440_30fps.mp4',
        type: 'video',
      },
      {
        id: 'media2',
        url: 'https://images.pexels.com/photos/167467/pexels-photo-167467.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        type: 'image',
      },
      {
        id: 'media3',
        url: 'https://images.pexels.com/photos/2231756/pexels-photo-2231756.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        type: 'image',
      },
      {
        id: 'media4',
        url: 'https://images.pexels.com/photos/16118364/pexels-photo-16118364/free-photo-of-home-jugant-musica-music.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        type: 'image',
      },
      {
        id: 'media1',
        url: 'https://videos.pexels.com/video-files/1692701/1692701-uhd_2560_1440_30fps.mp4',
        type: 'video',
      },
      {
        id: 'media2',
        url: 'https://images.pexels.com/photos/167467/pexels-photo-167467.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        type: 'image',
      },
      {
        id: 'media3',
        url: 'https://images.pexels.com/photos/2231756/pexels-photo-2231756.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        type: 'image',
      },
      {
        id: 'media4',
        url: 'https://images.pexels.com/photos/16118364/pexels-photo-16118364/free-photo-of-home-jugant-musica-music.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        type: 'image',
      },
    ],

    reviews: [
      {
        id: 'rev1',
        rating: 5,
        comment: 'Amazing performance! Everyone loved it.',
        reviewer: 'Laura G.',
        date: '2025-05-01T20:00:00Z',
      },
      {
        id: 'rev2',
        rating: 4,
        comment: 'Great setlist and vibes. Would hire again.',
        reviewer: 'Carlos P.',
        date: '2025-04-22T19:30:00Z',
      },
    ],

    events: [
      {
        id: 'event1',
        name: 'Event1',
        date: '2025-06-15T20:00:00Z',
        eventTypeId: EVENT_TYPE_IDS.WEDDINGS,
        city: 'Barcelona',
        country: 'Spain',
        venue: 'Castell de Sant Marçal',
        isPublic: true,
      },
      {
        id: 'event2',
        name: 'Event2',
        date: '2025-07-03T18:30:00Z',
        eventTypeId: EVENT_TYPE_IDS.FESTIVALS,
        city: 'Madrid',
        country: 'Spain',
        venue: 'Parque del Retiro',
        isPublic: true,
      },
      {
        id: 'event3',
        name: 'Event3',
        date: '2025-08-10T21:00:00Z',
        eventTypeId: EVENT_TYPE_IDS.PRIVATE_PARTIES,
        city: 'Valencia',
        country: 'Spain',
        venue: 'Villa Rivera',
        isPublic: true,
      },
      {
        id: 'event4',
        name: 'Event4',
        date: '2025-09-20T17:00:00Z',
        eventTypeId: EVENT_TYPE_IDS.RESTAURANTS_HOTELS,
        city: 'Seville',
        country: 'Spain',
        venue: 'Hotel Alfonso XIII',
        isPublic: false,
      },
      {
        id: 'event5',
        name: 'Event5',
        date: '2025-10-05T19:00:00Z',
        eventTypeId: EVENT_TYPE_IDS.BUSINESSES,
        city: 'Bilbao',
        country: 'Spain',
        venue: 'Bizkaia Aretoa',
        isPublic: true,
      },
    ],
    socialLinks: [
      { platform: 'Instagram', url: 'https://instagram.com/calvinharris' },
      { platform: 'Twitter', url: 'https://twitter.com/calvinharris' },
      {
        platform: 'Spotify',
        url: 'https://open.spotify.com/artist/7CajNmpbOovFoOoasH2HaY',
      },
    ],
  };
}
