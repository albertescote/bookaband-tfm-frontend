'use server';

import axiosInstance from '@/service/aixosInstance';
import { EventType } from '@/service/backend/filters/domain/eventType';
import { BackendError } from '@/service/backend/shared/domain/backendError';

export async function fetchEventTypes(): Promise<EventType[] | BackendError> {
  return axiosInstance
    .get('/event-types')
    .then((res) => res.data)
    .catch((error) => {
      return error.response.data;
    });
}
