'use server';
import { Invitation } from '@/service/backend/invitation/domain/invitation';
import { getAccessTokenCookie } from '@/service/utils';
import axios, { AxiosError } from 'axios';
import { BACKEND_URL } from '@/config';

export async function getUserInvitations(): Promise<Invitation[] | undefined> {
  try {
    const accessToken = getAccessTokenCookie();
    if (!accessToken) {
      console.log('Get chat failed: access token cookie not found');
      return undefined;
    }
    const response = await axios.get(BACKEND_URL + `/invitations`, {
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

export async function acceptInvitation(id: string): Promise<void> {
  try {
    const accessToken = getAccessTokenCookie();
    if (!accessToken) {
      console.log('Accept invitation failed: access token cookie not found');
      return undefined;
    }
    const response = await axios.put(
      BACKEND_URL + `/invitations/${id}/accept`,
      {},
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

export async function declineInvitation(id: string): Promise<void> {
  try {
    const accessToken = getAccessTokenCookie();
    if (!accessToken) {
      console.log('Decline invitation failed: access token cookie not found');
      return undefined;
    }
    const response = await axios.put(
      BACKEND_URL + `/invitations/${id}/decline`,
      {},
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
