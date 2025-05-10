import axios, { AxiosError } from 'axios';
import { BACKEND_URL } from '@/config';

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
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

export default axiosInstance;
