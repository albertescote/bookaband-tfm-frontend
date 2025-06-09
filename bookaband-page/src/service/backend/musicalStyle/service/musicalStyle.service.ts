'use server';

import axiosInstance from '@/service/aixosInstance';
import { MusicalStyle } from '@/service/backend/musicalStyle/domain/musicalStyle';

export async function fetchMusicalStyles(): Promise<MusicalStyle[]> {
  return axiosInstance
    .get('/musical-styles')
    .then((res) => res.data)
    .catch((error) => {
      return error.response?.data;
    });
}
