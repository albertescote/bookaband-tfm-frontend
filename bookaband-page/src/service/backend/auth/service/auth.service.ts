'use server';

import { AxiosError } from 'axios';
import {
  deleteAccessTokenCookie,
  deleteRefreshTokenCookie,
  getRefreshTokenCookie,
  parseCookie,
  setTokenCookie,
} from '@/service/utils';
import { ParsedCookie } from '@/service/backend/auth/domain/parsedCookie';
import axiosInstance from '@/service/aixosInstance';

export async function withTokenRefreshRetry<T>(
  apiCall: () => Promise<T>,
  hasRefreshed = false,
): Promise<T | undefined> {
  try {
    return await apiCall();
  } catch (error: any) {
    if (error.response?.status === 401 && !hasRefreshed) {
      try {
        const accessToken = await refreshAccessToken();
        if (!accessToken) {
          await deleteAccessTokenCookie();
          return undefined;
        }
        return withTokenRefreshRetry(apiCall, true);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        return undefined;
      }
    }
    return undefined;
  }
}

export async function refreshAccessToken(): Promise<string | undefined> {
  try {
    const refreshToken = await getRefreshTokenCookie();
    if (!refreshToken) {
      return undefined;
    }
    const response = await axiosInstance.post('/auth/refresh', {
      refreshToken,
    });
    let setCookieHeader = response.headers['set-cookie'];
    if (typeof setCookieHeader === 'string') {
      setCookieHeader = [setCookieHeader];
    }
    const parsedCookies: ParsedCookie[] | undefined = setCookieHeader?.map(
      (cookie) => {
        return parseCookie(cookie);
      },
    );
    const accessTokenCookie = parsedCookies?.find(
      (parsedCookie: ParsedCookie) => parsedCookie.name === 'access_token',
    );
    if (accessTokenCookie) {
      await setTokenCookie(accessTokenCookie);
    }
    return accessTokenCookie?.value;
  } catch (error) {
    await deleteRefreshTokenCookie();
    console.log(
      `Error status: ${(error as AxiosError).code}. Error message: ${
        (error as AxiosError).message
      }`,
    );
    return undefined;
  }
}

export async function logout(): Promise<void> {
  try {
    const refreshToken = await getRefreshTokenCookie();
    if (!refreshToken) {
      console.log('Logout failed: refresh token cookie not found');
      return undefined;
    }
    await axiosInstance.post('/auth/logout', { refreshToken });
    await deleteAccessTokenCookie();
    await deleteRefreshTokenCookie();
    return;
  } catch (error) {
    console.log(
      `Error status: ${(error as AxiosError).code}. Error message: ${
        (error as AxiosError).message
      }`,
    );
    return undefined;
  }
}
