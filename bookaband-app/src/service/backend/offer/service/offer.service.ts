'use server';
import { OfferDetails } from '@/service/backend/offer/domain/offerDetails';
import { Offer } from '@/service/backend/offer/domain/offer';
import authorizedAxiosInstance from '@/service/authorizedAixosInstance';
import axiosInstance from '@/service/aixosInstance';
import { withTokenRefreshRetry } from '@/service/backend/auth/service/auth.service';

export async function getAllOffersDetails(): Promise<OfferDetails[]> {
  try {
    const response = await axiosInstance.get('/offers');
    if (!response.data) {
      return [];
    }
    return response.data;
  } catch (e) {
    return [];
  }
}

export async function createOffer(request: {
  bandId?: string;
  price?: number;
  visible?: boolean;
  description?: string;
}): Promise<Offer | undefined> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance.post('/offers', request).then((res) => res.data),
  );
}

export async function updateOffer(
  id: string,
  request: {
    bandId?: string;
    price?: number;
    visible?: boolean;
    description?: string;
  },
): Promise<Offer | undefined> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance
      .put(`/offers/${id}`, request)
      .then((res) => res.data),
  );
}

export async function deleteOffer(id: string): Promise<void> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance.delete(`/offers/${id}`).then((res) => res.data),
  );
}

export async function getOfferById(
  offerId: string,
): Promise<Offer | undefined> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance.get(`/offers/${offerId}`).then((res) => res.data),
  );
}

export async function getOfferDetailsById(
  offerId: string,
): Promise<OfferDetails | undefined> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance
      .get(`/offers/${offerId}/details`)
      .then((res) => res.data),
  );
}
