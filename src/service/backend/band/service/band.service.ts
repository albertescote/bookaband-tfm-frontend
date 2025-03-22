'use server';
import { Band } from '@/service/backend/band/domain/band';
import { UserBand } from '@/service/backend/band/domain/userBand';
import { getAccessTokenCookie } from '@/service/utils';
import axios, { AxiosError } from 'axios';
import { BACKEND_URL } from '@/config';
import { BandWithDetails } from '@/service/backend/band/domain/bandWithDetails';

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

export async function joinBand(
  bandId: string,
  userEmail: string,
): Promise<void> {
  try {
    const accessToken = getAccessTokenCookie();
    if (!accessToken) {
      console.log('Join band failed: access token cookie not found');
      return undefined;
    }
    await axios.post(
      BACKEND_URL + `/invitations/send`,
      { bandId, userEmail },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
  } catch (error) {
    console.log(
      `Error status: ${(error as AxiosError).code}. Error message: ${
        (error as AxiosError).message
      }`,
    );
    return undefined;
  }
}

export async function deleteBand(id: string): Promise<void> {
  try {
    const accessToken = getAccessTokenCookie();
    if (!accessToken) {
      console.log('Delete band failed: access token cookie not found');
      return undefined;
    }
    await axios.delete(BACKEND_URL + `/bands/${id}`, {
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

export async function getBandDetailsById(
  id: string,
): Promise<BandWithDetails | undefined> {
  try {
    const accessToken = getAccessTokenCookie();
    if (!accessToken) {
      console.log(
        'Get band details by id failed: access token cookie not found',
      );
      return undefined;
    }
    const response = await axios.get(BACKEND_URL + `/bands/${id}/details`, {
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

export async function getBandViewById(id: string): Promise<Band | undefined> {
  try {
    const accessToken = getAccessTokenCookie();
    if (!accessToken) {
      console.log('Get band by id failed: access token cookie not found');
      return undefined;
    }
    const response = await axios.get(BACKEND_URL + `/bands/${id}/view`, {
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
