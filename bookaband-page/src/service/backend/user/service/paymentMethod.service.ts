'use server';

import { BackendError } from '@/service/backend/shared/domain/backendError';
import { withTokenRefreshRetry } from '@/service/backend/auth/service/auth.service';
import authorizedAxiosInstance from '@/service/authorizedAixosInstance';
import { PaymentMethod } from '@/service/backend/user/domain/paymentMethod';

export async function updatePaymentMethod(
  id: string,
  isDefault: boolean,
  alias?: string,
): Promise<PaymentMethod | BackendError> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance
      .put(`/payment-method/${id}`, { isDefault, ...(alias && { alias }) })
      .then((res) => res.data),
  ).catch((error) => {
    return error.response.data as BackendError;
  });
}

export async function createPaymentMethod(paymentMethodRequest: {
  type: string;
  lastFour: string;
  isDefault: boolean;
  brand?: string;
  alias?: string;
}): Promise<PaymentMethod | BackendError> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance
      .post('/payment-method', paymentMethodRequest)
      .then((res) => res.data),
  ).catch((error) => {
    return error.response.data as BackendError;
  });
}

export async function deletePaymentMethod(
  id: string,
): Promise<PaymentMethod | BackendError> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance
      .delete(`/payment-method/${id}`)
      .then((res) => res.data),
  ).catch((error) => {
    return error.response.data as BackendError;
  });
}
