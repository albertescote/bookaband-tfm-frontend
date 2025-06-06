'use server';
import { ChatView } from '@/service/backend/chat/domain/chatView';
import { ChatHistory } from '@/service/backend/chat/domain/chatHistory';
import authorizedAxiosInstance from '@/service/authorizedAixosInstance';
import { withTokenRefreshRetry } from '@/service/backend/auth/service/auth.service';
import { BackendError } from '@/service/backend/shared/domain/backendError';

export async function getClientChats(
  userId: string,
): Promise<ChatView[] | BackendError> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance
      .get(`/chat/client/${userId}`)
      .then((res) => res.data),
  );
}

export async function getChatById(
  chatId: string,
): Promise<ChatHistory | undefined> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance
      .get(`/chat/${chatId}/history`)
      .then((res) => res.data),
  );
}

export async function createNewChat(
  bandId: string,
): Promise<string | undefined> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance
      .post(`/chat`, { bandId })
      .then((res) => res.data.id),
  );
}
