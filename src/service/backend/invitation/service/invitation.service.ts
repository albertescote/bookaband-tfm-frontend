'use server';
import { Invitation } from '@/service/backend/invitation/domain/invitation';
import authorizedAxiosInstance from '@/service/authorizedAixosInstance';
import { withTokenRefreshRetry } from '@/service/backend/auth/service/auth.service';

export async function getUserInvitations(): Promise<Invitation[] | undefined> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance.get('/invitations').then((res) => res.data),
  );
}

export async function acceptInvitation(id: string): Promise<void> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance
      .put(`/invitations/${id}/accept`)
      .then((res) => res.data),
  );
}

export async function declineInvitation(id: string): Promise<void> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance
      .put(`/invitations/${id}/decline`)
      .then((res) => res.data),
  );
}
