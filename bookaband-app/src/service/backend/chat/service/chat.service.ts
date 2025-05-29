'use server';
import { ChatView } from '@/service/backend/chat/domain/chatView';
import { ChatHistory } from '@/service/backend/chat/domain/chatHistory';
import authorizedAxiosInstance from '@/service/authorizedAixosInstance';
import { withTokenRefreshRetry } from '@/service/backend/auth/service/auth.service';

export async function getBandChats(
  bandId: string,
): Promise<ChatView[] | undefined> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance.get(`/chat/band/${bandId}`).then((res) => res.data),
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
