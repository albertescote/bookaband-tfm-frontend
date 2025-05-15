'use server';

import { BackendError } from '@/service/backend/shared/domain/backendError';
import { withTokenRefreshRetry } from '@/service/backend/auth/service/auth.service';
import authorizedAxiosInstance from '@/service/authorizedAixosInstance';
import { BillingAddress } from '@/service/backend/user/domain/billingAddress';

export async function updateBillingAddress(
  billingAddress: BillingAddress,
): Promise<BillingAddress | BackendError> {
  const { id, ...body } = billingAddress;
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance
      .put(`/billing-address/${id}`, body)
      .then((res) => res.data),
  ).catch((error) => {
    return error.response.data as BackendError;
  });
}

export async function createBillingAddress(billingAddressRequest: {
  country: string;
  city: string;
  postalCode: string;
  addressLine1: string;
  addressLine2?: string;
}): Promise<BillingAddress | BackendError> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance
      .post('/billing-address', billingAddressRequest)
      .then((res) => res.data),
  ).catch((error) => {
    return error.response.data as BackendError;
  });
}

export async function deleteBillingAddress(
  id: string,
): Promise<BillingAddress | BackendError> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance
      .delete(`/billing-address/${id}`)
      .then((res) => res.data),
  ).catch((error) => {
    return error.response.data as BackendError;
  });
}
