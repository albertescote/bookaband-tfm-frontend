'use server';

import { withTokenRefreshRetry } from '@/service/backend/auth/service/auth.service';
import authorizedAxiosInstance from '@/service/authorizedAixosInstance';
import { BandCatalogItem } from '@/service/backend/artist/domain/bandCatalogItem';
import { FeaturedBand } from '@/service/backend/artist/domain/featuredBand';
import { ArtistDetails } from '@/service/backend/artist/domain/artistDetails';
import { BackendError } from '@/service/backend/shared/domain/backendError';
import { Artist } from '@/service/backend/artist/domain/artist';

export interface ArtistsDetailsFilteredResponse {
  bandCatalogItems: BandCatalogItem[];
  hasMore: boolean;
  total: number;
}

export interface ArtistsFeaturedResponse {
  featuredBands: FeaturedBand[];
  hasMore: boolean;
  total: number;
}

export async function fetchFilteredArtists(
  page: number = 1,
  pageSize: number = 10,
  filters?: {
    location?: string;
    date?: string;
    timezone?: string;
    artistName?: string;
  },
): Promise<ArtistsDetailsFilteredResponse> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance
      .get('/bands/details', {
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
      .get('/bands/featured', {
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
): Promise<ArtistDetails | BackendError> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance.get(`/bands/${id}/profile`).then((res) => res.data),
  ).catch((error) => {
    return error.response.data as BackendError;
  });
}

export async function fetchArtistById(
  id: string,
): Promise<Artist | BackendError> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance.get(`/bands/${id}`).then((res) => res.data),
  ).catch((error) => {
    return error.response.data as BackendError;
  });
}
