'use server';
import { OfferDetails } from '@/service/backend/offer/domain/offerDetails';
import { Offer } from '@/service/backend/offer/domain/offer';
import axios, { AxiosError } from 'axios';
import { BACKEND_URL } from '@/config';
import { getAccessTokenCookie } from '@/service/utils';

export async function getAllOffersDetails(): Promise<OfferDetails[]> {
  try {
    const response = await axios.get(BACKEND_URL + '/offers');
    if (!response.data) {
      return [];
    }
    return response.data;
  } catch (error) {
    console.log(
      `Error status: ${(error as AxiosError).code}. Error message: ${
        (error as AxiosError).message
      }`,
    );
    return [];
  }
}

export async function createOffer(request: {
  bandId?: string;
  price?: number;
  description?: string;
}): Promise<Offer | undefined> {
  try {
    const accessToken = getAccessTokenCookie();
    if (!accessToken) {
      console.log('Create offer failed: access token cookie not found');
      return undefined;
    }
    const response = await axios.post(BACKEND_URL + '/offers', request, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.log(
      `Error status: ${(error as AxiosError).code}. Error message: ${
        (error as AxiosError).message
      }`,
    );
    return undefined;
  }
}

export async function updateOffer(
  id: string,
  request: {
    bandId?: string;
    price?: number;
    description?: string;
  },
): Promise<Offer | undefined> {
  try {
    const accessToken = getAccessTokenCookie();
    if (!accessToken) {
      console.log('Create offer failed: access token cookie not found');
      return undefined;
    }
    const response = await axios.put(BACKEND_URL + `/offers/${id}`, request, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.log(
      `Error status: ${(error as AxiosError).code}. Error message: ${
        (error as AxiosError).message
      }`,
    );
    return undefined;
  }
}

export async function deleteOffer(id: string): Promise<void> {
  try {
    const accessToken = getAccessTokenCookie();
    if (!accessToken) {
      console.log('Create band failed: access token cookie not found');
      return undefined;
    }
    await axios.delete(BACKEND_URL + `/offers/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch (error) {
    console.log(
      `Error status: ${(error as AxiosError).code}. Error message: ${
        (error as AxiosError).message
      }`,
    );
    return undefined;
  }
}

export async function getOfferById(
  offerId: string,
): Promise<Offer | undefined> {
  try {
    const accessToken = getAccessTokenCookie();
    if (!accessToken) {
      console.log('Get offer by id failed: access token cookie not found');
      return undefined;
    }
    const response = await axios.get(BACKEND_URL + `/offers/${offerId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.data) {
      return undefined;
    }
    return response.data;
  } catch (error) {
    console.log(
      `Error status: ${(error as AxiosError).code}. Error message: ${
        (error as AxiosError).message
      }`,
    );
    return undefined;
  }
}

export async function getOfferDetailsById(
  offerId: string,
): Promise<OfferDetails | undefined> {
  try {
    const accessToken = getAccessTokenCookie();
    if (!accessToken) {
      console.log(
        'Get offers details by id failed: access token cookie not found',
      );
      return undefined;
    }
    const response = await axios.get(
      BACKEND_URL + `/offers/${offerId}/details`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    if (!response.data) {
      return undefined;
    }
    return response.data;
  } catch (error) {
    console.log(
      `Error status: ${(error as AxiosError).code}. Error message: ${
        (error as AxiosError).message
      }`,
    );
    return undefined;
  }
}
