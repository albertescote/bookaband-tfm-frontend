'use server';

import { withTokenRefreshRetry } from '@/service/backend/auth/service/auth.service';
import authorizedAxiosInstance from '@/service/authorizedAixosInstance';
import { OfferDetails } from '@/service/backend/artist/domain/offerDetails';
import { OfferOverview } from '@/service/backend/artist/domain/offerOverview';

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
          ...(filters && { filters }),
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
