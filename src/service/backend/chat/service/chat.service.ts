'use server';
import { ChatView } from '@/service/backend/chat/domain/chatView';
import { ChatPrimitives } from '@/service/backend/chat/domain/chat';
import { ChatHistory } from '@/service/backend/chat/domain/chatHistory';
import { getAccessTokenCookie } from '@/service/utils';
import axios, { AxiosError } from 'axios';
import { BACKEND_URL } from '@/config';
import { getUserInfo } from '@/service/backend/user/service/user.service';

export async function getUserChats(
  userId: string,
): Promise<ChatView[] | undefined> {
  try {
    const accessToken = getAccessTokenCookie();
    if (!accessToken) {
      console.log('Get user chats failed: access token cookie not found');
      return undefined;
    }
    const response = await axios.get(BACKEND_URL + `/chat/user/${userId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.data) {
      return undefined;
    }
    return response.data;
  } catch (error) {
    console.log(
      `Error status: ${(error as AxiosError).code}. Error message: ${
        (error as AxiosError).message
      }`,
    );
    return undefined;
  }
}

export async function getBandChats(
  bandId: string,
): Promise<ChatView[] | undefined> {
  try {
    const accessToken = getAccessTokenCookie();
    if (!accessToken) {
      console.log('Get band chats failed: access token cookie not found');
      return undefined;
    }
    const response = await axios.get(BACKEND_URL + `/chat/band/${bandId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.data) {
      return undefined;
    }
    return response.data;
  } catch (error) {
    console.log(
      `Error status: ${(error as AxiosError).code}. Error message: ${
        (error as AxiosError).message
      }`,
    );
    return undefined;
  }
}

export async function getChatById(
  chatId: string,
): Promise<ChatHistory | undefined> {
  try {
    const accessToken = getAccessTokenCookie();
    if (!accessToken) {
      console.log('Get chat failed: access token cookie not found');
      return undefined;
    }
    const response = await axios.get(BACKEND_URL + `/chat/${chatId}/history`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.data) {
      return undefined;
    }
    return response.data;
  } catch (error) {
    console.log(
      `Error status: ${(error as AxiosError).code}. Error message: ${
        (error as AxiosError).message
      }`,
    );
    return undefined;
  }
}

export async function createNewChat(
  bandId: string,
): Promise<string | undefined> {
  try {
    const existingChatId = await checkExistingChat(bandId);
    if (existingChatId) {
      return existingChatId;
    }
    const accessToken = getAccessTokenCookie();
    if (!accessToken) {
      console.log('Create chat failed: access token cookie not found');
      return undefined;
    }
    const response = (await axios.post(
      BACKEND_URL + `/chat`,
      { bandId },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    )) as { data: ChatPrimitives };
    if (!response.data) {
      return undefined;
    }
    return response.data.id;
  } catch (error) {
    console.log(
      `Error status: ${(error as AxiosError).code}. Error message: ${
        (error as AxiosError).message
      }`,
    );
    return undefined;
  }
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
