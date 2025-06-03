'use server';

import axiosInstance from '@/service/aixosInstance';
import { BackendError } from '@/service/backend/shared/domain/backendError';
import { MusicalStyle } from '@/service/backend/musicalStyle/domain/musicalStyle';

export async function fetchMusicalStyles(): Promise<
  MusicalStyle[] | BackendError
> {
  return axiosInstance
    .get('/musical-styles')
    .then((res) => res.data)
    .catch((error) => {
      return error.response.data;
    });
}
