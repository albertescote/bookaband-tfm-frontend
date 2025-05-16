'use server';
import { AUTH_URL, GOOGLE_CLIENT_ID } from '@/config';
import { AxiosError } from 'axios';
import { parseCookie, setTokenCookie } from '@/service/utils';
import { AuthenticationResult } from '@/service/backend/auth/domain/authenticationResult';
import { ParsedCookie } from '@/service/backend/auth/domain/parsedCookie';
import axiosInstance from '@/service/aixosInstance';
import { BackendError } from '@/service/backend/shared/domain/backendError';

export async function authenticate(
  email: string | undefined,
  password: string | undefined,
  rememberMe: boolean,
): Promise<AuthenticationResult> {
  try {
    const loginBody = {
      email,
      password,
    };
    const response = await axiosInstance.post('/auth/login', loginBody);
    const setCookieHeader = response.headers['set-cookie'];
    const parsedCookies: ParsedCookie[] | undefined = setCookieHeader?.map(
      (cookie) => {
        return parseCookie(cookie);
      },
    );
    const accessTokenCookie = parsedCookies?.find(
      (parsedCookie: ParsedCookie) => parsedCookie.name === 'access_token',
    );
    const refreshTokenCookie = parsedCookies?.find(
      (parsedCookie: ParsedCookie) => parsedCookie.name === 'refresh_token',
    );
    if (accessTokenCookie && refreshTokenCookie) {
      setTokenCookie(accessTokenCookie, rememberMe ? 60 * 15 : undefined);
      setTokenCookie(
        refreshTokenCookie,
        rememberMe ? 60 * 60 * 24 * 30 : undefined,
      );
      return {
        valid: true,
        role: response.data.role,
      };
    }
    return {
      valid: false,
      errorMessage: 'An error occurred while being authenticated',
    };
  } catch (error) {
    return {
      valid: false,
      errorMessage: (error as AxiosError<BackendError>)?.response?.data?.error,
    };
  }
}

export async function loginWithGoogle(
  code: string,
): Promise<AuthenticationResult> {
  try {
    const loginWithGoogle = {
      code,
    };
    const response = await axiosInstance.post(
      '/auth/federation/login/google',
      loginWithGoogle,
    );
    const setCookieHeader = response.headers['set-cookie'];
    const parsedCookies: ParsedCookie[] | undefined = setCookieHeader?.map(
      (cookie) => {
        return parseCookie(cookie);
      },
    );
    const accessTokenCookie = parsedCookies?.find(
      (parsedCookie: ParsedCookie) => parsedCookie.name === 'access_token',
    );
    const refreshTokenCookie = parsedCookies?.find(
      (parsedCookie: ParsedCookie) => parsedCookie.name === 'refresh_token',
    );
    if (accessTokenCookie && refreshTokenCookie) {
      setTokenCookie(accessTokenCookie);
      setTokenCookie(refreshTokenCookie);
      return {
        valid: true,
        role: response.data.role,
      };
    }
    return {
      valid: false,
      errorMessage: 'An error occurred while being authenticated with google',
    };
  } catch (error) {
    return {
      valid: false,
      errorMessage: (error as AxiosError<BackendError>)?.response?.data?.error,
    };
  }
}

export async function signUpWithGoogle(
  code: string,
  role: string,
): Promise<AuthenticationResult> {
  try {
    const loginWithGoogle = {
      role,
      code,
    };
    const response = await axiosInstance.post(
      '/auth/federation/signup/google',
      loginWithGoogle,
    );
    const setCookieHeader = response.headers['set-cookie'];
    const parsedCookies: ParsedCookie[] | undefined = setCookieHeader?.map(
      (cookie) => {
        return parseCookie(cookie);
      },
    );
    const accessTokenCookie = parsedCookies?.find(
      (parsedCookie: ParsedCookie) => parsedCookie.name === 'access_token',
    );
    const refreshTokenCookie = parsedCookies?.find(
      (parsedCookie: ParsedCookie) => parsedCookie.name === 'refresh_token',
    );
    if (accessTokenCookie && refreshTokenCookie) {
      setTokenCookie(accessTokenCookie);
      setTokenCookie(refreshTokenCookie);
      return {
        valid: true,
        role: response.data.role,
      };
    }
    return {
      valid: false,
      errorMessage: 'An error occurred while being authenticated with google',
    };
  } catch (error) {
    return {
      valid: false,
      errorMessage: (error as AxiosError<BackendError>)?.response?.data?.error,
    };
  }
}

export async function getLoginWithGoogleUrl() {
  const params = new URLSearchParams();
  params.append('client_id', GOOGLE_CLIENT_ID);
  params.append('redirect_uri', `${AUTH_URL}/federation/callback/google`);
  params.append('response_type', 'code');
  params.append('scope', 'openid email profile');
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function getSignUpWithGoogleUrl(role: string) {
  const params = new URLSearchParams();
  params.append('client_id', GOOGLE_CLIENT_ID);
  params.append(
    'redirect_uri',
    `${AUTH_URL}/federation/callback/google?role=${role}`,
  );
  params.append('response_type', 'code');
  params.append('scope', 'openid email profile');
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}
