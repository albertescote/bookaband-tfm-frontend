'use server';

import { BackendError } from '@/service/backend/shared/domain/backendError';
import { withTokenRefreshRetry } from '@/service/backend/auth/service/auth.service';
import authorizedAxiosInstance from '@/service/authorizedAixosInstance';
import { Invoice } from '@/service/backend/documents/domain/invoice';

export async function getInvoicesByBandId(
  bandId: string,
): Promise<Invoice[] | BackendError> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance
      .get(`/invoices/band/${bandId}`)
      .then((res) => res.data),
  ).catch((error) => {
    return error.response.data as BackendError;
  });
}

export async function getInvoiceById(
  id: string,
): Promise<Invoice | BackendError> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance.get(`/invoices/${id}`).then((res) => res.data),
  ).catch((error) => {
    return error.response.data as BackendError;
  });
}

export async function payInvoice(id: string): Promise<void | BackendError> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance
      .put(`/invoices/${id}/payment`)
      .then((res) => res.data),
  ).catch((error) => {
    return error.response.data as BackendError;
  });
}
