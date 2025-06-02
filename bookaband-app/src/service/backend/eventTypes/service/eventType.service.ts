'use server';

import axiosInstance from '@/service/aixosInstance';
import { BackendError } from '@/service/backend/shared/domain/backendError';
import { EventType } from '@/service/backend/eventTypes/domain/eventType';

export async function fetchEventTypes(): Promise<EventType[] | BackendError> {
  return axiosInstance
    .get('/event-types')
    .then((res) => res.data)
    .catch((error) => {
      return error.response.data;
    });
}
