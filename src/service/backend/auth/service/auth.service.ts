'use server';
import { BACKEND_PUBLIC_KEY, FRONTEND_URL, GOOGLE_CLIENT_ID } from '@/config';
import { AxiosError } from 'axios';
import { decodeJwt, importJWK, JWK, jwtVerify } from 'jose';
import {
  deleteAccessTokenCookie,
  deleteRefreshTokenCookie,
  getAccessTokenCookie,
  getRefreshTokenCookie,
  isTokenExpired,
  parseCookie,
  setTokenCookie,
} from '@/service/utils';
import { AuthenticationResult } from '@/service/backend/auth/domain/authenticationResult';
import { AccessTokenPayload } from '@/service/backend/auth/domain/accessTokenPayload';
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
      const payload = decodeJwt(accessTokenCookie.value);
      return {
        valid: true,
        role: (payload as unknown as AccessTokenPayload).role,
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

export async function validateAccessTokenSignature(): Promise<AccessTokenPayload | null> {
  try {
    const accessToken = getAccessTokenCookie();
    if (!accessToken) {
      console.log(
        'Access token validation failed: access token cookie not found',
      );
      return null;
    }

    const parts = accessToken.split('.');
    if (parts.length !== 3) {
      console.log('Access token validation failed: invalid JWT structure');
      return null;
    }

    const jsonString = Buffer.from(BACKEND_PUBLIC_KEY, 'base64').toString(
      'utf-8',
    );
    const jwk: JWK = JSON.parse(jsonString);
    const keyLike = await importJWK(jwk, jwk.alg ?? 'ES256');

    await jwtVerify(accessToken, keyLike, {
      algorithms: [jwk.alg ?? 'ES256'],
    }).catch((e) => {
      if (e.message !== '"exp" claim timestamp check failed') {
        throw e;
      }
    });

    const payload = decodeJwt(accessToken);

    return payload as unknown as AccessTokenPayload;
  } catch (error) {
    console.log('Access token validation failed: ' + (error as Error).message);
    return null;
  }
}

export async function validateAccessToken(): Promise<AccessTokenPayload | null> {
  try {
    let accessToken: string | undefined = getAccessTokenCookie();
    if (!accessToken) {
      console.log(
        'Access token validation failed: access token cookie not found',
      );
      return null;
    }
    if (isTokenExpired(accessToken)) {
      const refreshedAccessToken = await refreshAccessToken();
      if (!refreshedAccessToken) {
        deleteAccessTokenCookie();
        return null;
      }
      accessToken = refreshedAccessToken;
    }
    const jsonString = Buffer.from(BACKEND_PUBLIC_KEY, 'base64').toString(
      'utf-8',
    );
    const jwk: JWK = JSON.parse(jsonString);
    const keyLike = await importJWK(jwk, jwk.alg ?? 'ES256');
    const verifyResult = await jwtVerify(accessToken, keyLike, {
      algorithms: [jwk.alg ?? 'ES256'],
    });
    return verifyResult.payload as unknown as AccessTokenPayload;
  } catch (error) {
    console.log('Access token validation failed: ' + (error as Error).message);
    return null;
  }
}

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
          deleteAccessTokenCookie();
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
    const refreshToken = getRefreshTokenCookie();
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
      setTokenCookie(accessTokenCookie);
    }
    return accessTokenCookie?.value;
  } catch (error) {
    deleteRefreshTokenCookie();
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
    const refreshToken = getRefreshTokenCookie();
    if (!refreshToken) {
      console.log('Logout failed: refresh token cookie not found');
      return undefined;
    }
    await axiosInstance.post('/auth/logout', { refreshToken });
    deleteAccessTokenCookie();
    deleteRefreshTokenCookie();
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
      const payload = decodeJwt(accessTokenCookie.value);
      return {
        valid: true,
        role: (payload as unknown as AccessTokenPayload).role,
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
      const payload = decodeJwt(accessTokenCookie.value);
      return {
        valid: true,
        role: (payload as unknown as AccessTokenPayload).role,
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
  params.append('redirect_uri', `${FRONTEND_URL}/federation/callback/google`);
  params.append('response_type', 'code');
  params.append('scope', 'openid email profile');
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function getSignUpWithGoogleUrl(role: string) {
  const params = new URLSearchParams();
  params.append('client_id', GOOGLE_CLIENT_ID);
  params.append(
    'redirect_uri',
    `${FRONTEND_URL}/federation/callback/google?role=${role}`,
  );
  params.append('response_type', 'code');
  params.append('scope', 'openid email profile');
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}
