'use server';
import axios, { AxiosError } from 'axios';
import { BACKEND_URL } from '@/config';
import { OfferView } from '@/service/backend/domain/offerView';
import { User } from '@/service/backend/domain/user';
import { getAccessTokenCookie } from '@/service/utils';
import { decodeJwt } from 'jose';
import { UserBand } from '@/service/backend/domain/userBand';
import { Band } from '@/service/backend/domain/band';

export async function getAllOffersView(): Promise<OfferView[]> {
  try {
    const response = await axios.get(BACKEND_URL + '/offers-view');
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

export async function createUser(request: {
  firstName?: string;
  familyName?: string;
  email?: string;
  password?: string;
  role?: string;
}): Promise<void> {
  try {
    await axios.post(BACKEND_URL + '/user', request);
  } catch (error) {
    console.log(
      `Error status: ${(error as AxiosError).code}. Error message: ${
        (error as AxiosError).message
      }`,
    );
    return undefined;
  }
}

export async function createBand(request: {
  name?: string;
  genre?: string;
}): Promise<Band | undefined> {
  try {
    const accessToken = getAccessTokenCookie();
    if (!accessToken) {
      console.log('Create band failed: access token cookie not found');
      return undefined;
    }
    const response = await axios.post(BACKEND_URL + '/bands', request, {
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

export async function getUserInfo(): Promise<User | undefined> {
  try {
    const accessToken = getAccessTokenCookie();
    if (!accessToken) {
      console.log('Get user info failed: access token cookie not found');
      return undefined;
    }
    const decodedJwt = decodeJwt(accessToken);
    const userId = decodedJwt.sub;
    if (!userId) {
      console.log('Invalid access token: missing sub property');
      return undefined;
    }
    const response = await axios.get(BACKEND_URL + `/user/${userId}`, {
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

export async function getUserBands(): Promise<UserBand[] | undefined> {
  try {
    const accessToken = getAccessTokenCookie();
    if (!accessToken) {
      console.log('Get user bands failed: access token cookie not found');
      return undefined;
    }
    const response = await axios.get(BACKEND_URL + `/bands`, {
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

export async function getBandById(id: string): Promise<Band | undefined> {
  try {
    const accessToken = getAccessTokenCookie();
    if (!accessToken) {
      console.log('Get band by id failed: access token cookie not found');
      return undefined;
    }
    const response = await axios.get(BACKEND_URL + `/bands/${id}`, {
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

export async function getOffersViewById(
  offerId: string,
): Promise<OfferView | undefined> {
  try {
    const accessToken = getAccessTokenCookie();
    if (!accessToken) {
      console.log('Get offer info failed: access token cookie not found');
      return undefined;
    }
    const response = await axios.get(BACKEND_URL + `/offers-view/${offerId}`, {
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
