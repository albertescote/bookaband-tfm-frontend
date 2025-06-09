'use server';

import { BackendError } from '@/service/backend/shared/domain/backendError';
import { withTokenRefreshRetry } from '@/service/backend/auth/service/auth.service';
import authorizedAxiosInstance from '@/service/authorizedAixosInstance';
import { Invoice } from '@/service/backend/documents/domain/invoice';

export async function getInvoices(): Promise<Invoice[] | BackendError> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance.get('/invoices/user').then((res) => res.data),
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

export async function createInvoice(
  invoiceRequest: Pick<Invoice, 'contractId' | 'amount' | 'status'>,
): Promise<Invoice | BackendError> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance
      .post('/invoices', invoiceRequest)
      .then((res) => res.data),
  ).catch((error) => {
    return error.response.data as BackendError;
  });
}

export async function updateInvoice(
  invoice: Invoice,
): Promise<Invoice | BackendError> {
  const { id, ...body } = invoice;
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance
      .put(`/invoices/${id}`, body)
      .then((res) => res.data),
  ).catch((error) => {
    return error.response.data as BackendError;
  });
}

export async function deleteInvoice(id: string): Promise<void | BackendError> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance.delete(`/invoices/${id}`).then((res) => res.data),
  ).catch((error) => {
    return error.response.data as BackendError;
  });
}
