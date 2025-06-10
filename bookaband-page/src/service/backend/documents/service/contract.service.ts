'use server';

import { BackendError } from '@/service/backend/shared/domain/backendError';
import { withTokenRefreshRetry } from '@/service/backend/auth/service/auth.service';
import authorizedAxiosInstance from '@/service/authorizedAixosInstance';
import { Contract } from '@/service/backend/documents/domain/contract';

export async function getUserContracts(): Promise<Contract[] | BackendError> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance.get('/contracts/user').then((res) => res.data),
  ).catch((error) => {
    return error.response.data as BackendError;
  });
}

export async function getContractById(
  id: string,
): Promise<Contract | BackendError> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance.get(`/contracts/${id}`).then((res) => res.data),
  ).catch((error) => {
    return error.response.data as BackendError;
  });
}
