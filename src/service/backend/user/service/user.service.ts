'use server';
import { User } from '@/service/backend/user/domain/user';
import { getAccessTokenCookie } from '@/service/utils';
import { decodeJwt } from 'jose';
import axios, { AxiosError } from 'axios';
import { BACKEND_URL } from '@/config';

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
