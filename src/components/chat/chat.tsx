'use client';
import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage, useChat } from '@/hooks/useSocket';
import { useAuth } from '@/providers/webPageAuthProvider';
import { Role } from '@/service/backend/user/domain/role';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';
import { useRouter } from 'next/navigation';
import { ChatHistory } from '@/service/backend/chat/domain/chatHistory';
import {
  createNewChat,
  getChatById,
} from '@/service/backend/chat/service/chat.service';
import { getAvatar } from '@/components/shared/avatar';
import { getUserInfo } from '@/service/backend/user/service/user.service';
import { getBandViewById } from '@/service/backend/band/service/band.service';
import { Spinner } from '@/components/shared/spinner';

interface ChatProps {
  language: string;
  chatId?: string;
  bandId?: string;
}

const Chat: React.FC<ChatProps> = ({ language, chatId, bandId }) => {
  const { t } = useTranslation(language, 'chat');
  const { role } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState<string>('');
  const [allMessages, setAllMessages] = useState<ChatMessage[]>([]);
  const [chat, setChat] = useState<ChatHistory | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [senderId, setSenderId] = useState<string>('');
  const [recipientId, setRecipientId] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | undefined>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [error, setError] = useState<string>('');

  const createEmptyChat = async (
    bandId: string,
  ): Promise<ChatHistory | undefined> => {
    if (!bandId) {
      setError('Band ID is required');
      return;
    }

    const [userInfo, band] = await Promise.all([
      getUserInfo().catch((err) => {
        throw err;
      }),
      getBandViewById(bandId).catch((err) => {
        throw err;
      }),
    ]);

    if (!userInfo) {
      setError('Failed to get user information');
      return;
    }
    if (!band) {
      setError('Band not found');
      return;
    }
    const now = new Date();
    return {
      id: crypto.randomUUID(),
      createdAt: now,
      messages: [],
      user: userInfo,
      band: band,
      updatedAt: now,
    };
  };

  useEffect(() => {
    if (chatId) {
      getChatById(chatId).then((chat) => {
        setIsLoading(false);
        setChat(chat);
      });
    } else if (bandId) {
      createEmptyChat(bandId).then((chat) => {
        setChat(chat);
        setIsLoading(false);
      });
    } else {
      setError('Chat ID or Band ID is required');
    }
  }, []);

  useEffect(() => {
    if (chat && role.role !== 'none') {
      const newSenderId =
        role.role === Role.Client ? chat.user.id : chat.band.id;
      const newRecipientId =
        role.role === Role.Client ? chat.band.id : chat.user.id;
      const newImageUrl =
        role.role === Role.Client ? chat.band?.imageUrl : chat.user?.imageUrl;
      const newDisplayName =
        role.role === Role.Client
          ? chat.band?.name || 'Unknown'
          : `${chat.user?.firstName || ''} ${chat.user?.familyName || ''}`.trim();

      setSenderId(newSenderId);
      setRecipientId(newRecipientId);
      setImageUrl(newImageUrl);
      setDisplayName(newDisplayName);

      setAllMessages(
        chat.messages.map((msg) => ({
          chatId: chat.id,
          senderId: msg.senderId,
          recipientId: msg.recipientId,
          message: msg.content,
        })),
      );
    }
  }, [chat, role]);

  const { messages, sendMessage } = useChat(senderId);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setAllMessages((prevMessages) => [...prevMessages, ...messages]);
  }, [messages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [allMessages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      if (allMessages.length === 0) {
        createNewChat(chat!.band.id).then((id) => {
          if (id) {
            chat!.id = id;
          }
          const newMessage: ChatMessage = {
            chatId: chat!.id,
            senderId,
            recipientId,
            message,
          };
          setAllMessages((prev) => [...prev, newMessage]);

          sendMessage(chat!.id, recipientId, message);
          setMessage('');
        });
      } else {
        const newMessage: ChatMessage = {
          chatId: chat!.id,
          senderId,
          recipientId,
          message,
        };
        setAllMessages((prev) => [...prev, newMessage]);

        sendMessage(chat!.id, recipientId, message);
        setMessage('');
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div>
      {isLoading ? (
        <div className="flex min-h-[25vh] flex-col items-center justify-center gap-4">
          <Spinner className="h-12 w-12 text-blue-500" />
          <p className="text-lg font-medium text-gray-600">
            Loading your chat...
          </p>
        </div>
      ) : (
        <div>
          {!chat ? (
            <h1 className="text-center">{t('chat-not-found')}</h1>
          ) : (
            <div className="mx-auto flex h-[75vh] min-w-[90vh] flex-col rounded-xl border bg-white shadow-lg">
              <div className="rounded-t-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 text-lg font-semibold text-white">
                <div className="flex items-center">
                  <button
                    onClick={() => {
                      router.back();
                      router.refresh();
                    }}
                    className="mr-4 text-white"
                  >
                    <ArrowLeft className="h-6 w-6" />
                  </button>
                  {getAvatar(64, 64, imageUrl, displayName)}
                  <span className="ml-4 text-xl">
                    {role.role === Role.Client
                      ? chat.band.name
                      : `${chat.user.firstName} ${chat.user.familyName}`}
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {allMessages.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-center text-gray-500">
                      {t('no-messages-yet')}
                    </p>
                  </div>
                ) : (
                  allMessages.map((chatMessage, index) => (
                    <div
                      key={index}
                      className={`max-w-xs rounded-lg p-3 ${
                        chatMessage.senderId === senderId
                          ? 'ml-auto self-end bg-indigo-500 text-white'
                          : 'self-start bg-gray-200 text-gray-800'
                      }`}
                    >
                      {chatMessage.message}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="flex items-center rounded-b-xl border-t bg-gray-50 p-4">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={t('type-a-message')}
                  className="flex-1 rounded-full border border-gray-300 p-3 transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="ml-3 rounded-full bg-indigo-500 p-3 text-white transition-all duration-200 hover:bg-indigo-600"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Chat;
