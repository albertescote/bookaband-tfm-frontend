'use server';

import { withTokenRefreshRetry } from '@/service/backend/auth/service/auth.service';
import authorizedAxiosInstance from '@/service/authorizedAixosInstance';
import { ArtistReview } from '@/service/backend/artistReview/domain/artistReview';

interface CreateArtistReviewRequest {
  bookingId: string;
  rating: number;
  comment: string;
}

export async function createArtistReview(
  request: CreateArtistReviewRequest,
): Promise<boolean> {
  try {
    await withTokenRefreshRetry(() =>
      authorizedAxiosInstance.post('/reviews', request).then((res) => res.data),
    );
    return true;
  } catch (e) {
    return false;
  }
}

export async function getArtistReviewByBookingId(
  bookingId: string,
): Promise<ArtistReview | null> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance
      .get(`/reviews/booking/${bookingId}`)
      .then((res) => res.data),
  );
}
