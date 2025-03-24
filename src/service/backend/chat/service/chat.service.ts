'use server';
import { ChatView } from '@/service/backend/chat/domain/chatView';
import { ChatHistory } from '@/service/backend/chat/domain/chatHistory';
import { getUserInfo } from '@/service/backend/user/service/user.service';
import authorizedAxiosInstance from '@/service/authorizedAixosInstance';
import { withTokenRefreshRetry } from '@/service/backend/auth/service/auth.service';

export async function getUserChats(
  userId: string,
): Promise<ChatView[] | undefined> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance.get(`/chat/user/${userId}`).then((res) => res.data),
  );
}

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

export async function createNewChat(
  bandId: string,
): Promise<string | undefined> {
  return withTokenRefreshRetry(() =>
    authorizedAxiosInstance
      .post(`/chat`, { bandId })
      .then((res) => res.data.id),
  );
}

export async function checkExistingChat(bandId: string) {
  const userInfo = await getUserInfo();
  if (userInfo) {
    const chats = await getUserChats(userInfo.id);
    const existingChat = chats?.find((chat) => chat.band.id == bandId);
    if (existingChat) {
      return existingChat.id;
    }
  }
  return undefined;
}
