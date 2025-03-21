'use server';
import { BACKEND_PUBLIC_KEY, BACKEND_URL } from '@/config';
import axios, { AxiosError } from 'axios';
import { importJWK, JWK, jwtVerify } from 'jose';
import { getAccessTokenCookie } from '@/service/utils';
import { AuthenticationResult } from '@/service/backend/auth/domain/authenticationResult';
import { AccessTokenPayload } from '@/service/backend/auth/domain/accessTokenPayload';

export async function authenticate(
  email: string | undefined,
  password: string | undefined,
): Promise<AuthenticationResult> {
  try {
    const loginBody = {
      email,
      password,
    };
    const response = await axios.post(BACKEND_URL + '/auth/login', loginBody);
    if (!response.data.access_token) {
      return {
        valid: false,
        errorMessage: 'An error occurred while being authenticated',
      };
    }
    return { valid: true, accessToken: response.data.access_token };
  } catch (error) {
    console.log(
      `Error status: ${(error as AxiosError).code}. Error message: ${
        (error as AxiosError).message
      }`,
    );
    return { valid: false, errorMessage: 'Invalid credentials!' };
  }
}

export async function validateAccessToken(): Promise<AccessTokenPayload | null> {
  try {
    const accessToken = getAccessTokenCookie();
    if (!accessToken) {
      console.log(
        'Access token validation failed: access token cookie not found',
      );
      return null;
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
