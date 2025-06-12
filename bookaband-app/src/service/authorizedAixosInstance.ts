import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getAccessTokenCookie } from '@/service/utils';
import { BACKEND_URL } from '@/publicConfig';

declare module 'axios' {
  interface InternalAxiosRequestConfig<D = any> {
    _retry?: boolean;
  }
}

const authorizedAxiosInstance = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

authorizedAxiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = getAccessTokenCookie();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

authorizedAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log(
      `Error status: ${(error as AxiosError).code}. Error message: ${
        (error as AxiosError).message
      }`,
    );
    return Promise.reject(error);
  },
);

export default authorizedAxiosInstance;
