'use server';

import { BackendError } from '@/service/backend/shared/domain/backendError';
import { withTokenRefreshRetry } from '@/service/backend/auth/service/auth.service';
import authorizedAxiosInstance from '@/service/authorizedAixosInstance';
import { Contract } from '@/service/backend/documents/domain/contract';

export async function getContractsByBandId(
  bandId: string,
): Promise<Contract[] | BackendError> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance
      .get(`/contracts/band/${bandId}`)
      .then((res) => res.data),
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

export async function updateContract(
  contract: Contract,
): Promise<Contract | BackendError> {
  const { id, ...body } = contract;
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance
      .put(`/contracts/${id}`, body)
      .then((res) => res.data),
  ).catch((error) => {
    return error.response.data as BackendError;
  });
}

export async function deleteContract(id: string): Promise<void | BackendError> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance.delete(`/contracts/${id}`).then((res) => res.data),
  ).catch((error) => {
    return error.response.data as BackendError;
  });
}
