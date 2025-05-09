'use client';
import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage, useChat } from '@/hooks/useSocket';
import {
  MessageSquareOff,
  Paperclip,
  Phone,
  Send,
  Smile,
  Video,
} from 'lucide-react';
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
import { format } from 'date-fns';
import { ca, es } from 'date-fns/locale';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

interface ChatProps {
  language: string;
  chatId?: string;
  bandId?: string;
}

const Chat: React.FC<ChatProps> = ({ language, chatId, bandId }) => {
  const { t } = useTranslation(language, 'chat');
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
  const [showEmojis, setShowEmojis] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messageInputRef = useRef<HTMLInputElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const createEmptyChat = async (
    bandId: string,
  ): Promise<ChatHistory | undefined> => {
    if (!bandId) {
      setError(t('band-id-required'));
      return;
    }

    const [userInfo, band] = await Promise.all([
      getUserInfo().catch((err: Error) => {
        throw err;
      }),
      getBandViewById(bandId).catch((err: Error) => {
        throw err;
      }),
    ]);

    if (!userInfo) {
      setError(t('failed-to-get-user'));
      return;
    }
    if (!band) {
      setError(t('band-not-found'));
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
      getChatById(chatId).then((chat: ChatHistory | undefined) => {
        setIsLoading(false);
        setChat(chat);
      });
    } else if (bandId) {
      createEmptyChat(bandId).then((chat) => {
        setChat(chat);
        setIsLoading(false);
      });
    } else {
      setError(t('chat-or-band-id-required'));
    }
  }, [chatId, bandId]);

  useEffect(() => {
    if (chat) {
      const newSenderId = chat.user.id;
      const newRecipientId = chat.band.id;
      const newImageUrl = chat.band?.imageUrl;
      const newDisplayName = chat.band?.name || t('unknown');

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
          timestamp: msg.timestamp,
        })),
      );
    }
  }, [chat, t]);

  const { messages, sendMessage } = useChat(senderId);

  useEffect(() => {
    setAllMessages((prevMessages) => [...prevMessages, ...messages]);
  }, [messages]);

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
            timestamp: new Date(),
          };
          setAllMessages((prev) => [...prev, newMessage]);

          sendMessage(chat!.id, recipientId, message);
          setMessage('');
          setShowEmojis(false);
        });
      } else {
        const newMessage: ChatMessage = {
          chatId: chat!.id,
          senderId,
          recipientId,
          message,
          timestamp: new Date(),
        };
        setAllMessages((prev) => [...prev, newMessage]);

        sendMessage(chat!.id, recipientId, message);
        setMessage('');
        setShowEmojis(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const groupMessagesByDate = () => {
    if (!allMessages.length) return [];

    const groups: { date: string; messages: ChatMessage[] }[] = [];
    let currentDate = '';
    let currentGroup: ChatMessage[] = [];

    const locale = language === 'es' ? es : language === 'ca' ? ca : undefined;

    allMessages.forEach((msg) => {
      const messageDate = msg.timestamp ? new Date(msg.timestamp) : new Date();
      const formattedDate = format(messageDate, 'MMMM d, yyyy', { locale });
      const capitalizedDate =
        formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

      if (capitalizedDate !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({ date: currentDate, messages: currentGroup });
        }
        currentDate = capitalizedDate;
        currentGroup = [msg];
      } else {
        currentGroup.push(msg);
      }
    });

    if (currentGroup.length > 0) {
      groups.push({ date: currentDate, messages: currentGroup });
    }

    return groups;
  };

  const goToChats = () => {
    router.push(`/${language}/chats`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojis(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prevMessage) => prevMessage + emojiData.emoji);
  };

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className="text-center text-red-500">{error}</div>
          <button
            onClick={goToChats}
            className="mt-4 rounded-md bg-[#15b7b9] px-4 py-2 text-white"
          >
            {t('back-to-chats')}
          </button>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate();

  return (
    <div className="flex h-full flex-col">
      {isLoading ? (
        <div className="flex h-full flex-col items-center justify-center gap-4">
          <Spinner className="h-12 w-12 text-[#15b7b9]" />
          <p className="text-lg font-medium text-gray-600">
            {t('loading-chat')}
          </p>
        </div>
      ) : (
        <div className="flex h-full flex-col">
          {!chat ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <h1 className="text-xl font-semibold text-gray-700">
                  {t('chat-not-found')}
                </h1>
                <button
                  onClick={goToChats}
                  className="mt-4 rounded-md bg-[#15b7b9] px-4 py-2 text-white"
                >
                  {t('back-to-chats')}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col">
              {/* Chat Header */}
              <div className="flex items-center justify-between border-b bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  {/* Back button removed as we're using the unified layout */}
                  {getAvatar(40, 40, imageUrl, displayName)}
                  <div>
                    <h2 className="font-medium">{displayName}</h2>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
                    <Phone size={20} />
                  </button>
                  <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
                    <Video size={20} />
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
                {messageGroups.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center gap-3 p-4">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#e3f8f8]">
                      <MessageSquareOff className="h-12 w-12 text-[#15b7b9]" />
                    </div>
                    <p className="text-center text-gray-500">
                      {t('no-messages-yet')}
                    </p>
                    <p className="text-center text-sm text-gray-400">
                      {t('start-conversation')}
                    </p>
                  </div>
                ) : (
                  messageGroups.map((group, groupIndex) => (
                    <div key={groupIndex} className="mb-6">
                      <div className="mb-4 flex justify-center">
                        <span className="rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-600">
                          {group.date}
                        </span>
                      </div>

                      {group.messages.map((chatMessage, index) => {
                        const isSender = chatMessage.senderId === senderId;
                        const showAvatar =
                          index === 0 ||
                          group.messages[index - 1]?.senderId !==
                            chatMessage.senderId;

                        const locale =
                          language === 'es'
                            ? es
                            : language === 'ca'
                              ? ca
                              : undefined;

                        return (
                          <div
                            key={index}
                            className={`mb-4 flex ${isSender ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[75%] ${isSender ? 'order-2' : 'order-1'}`}
                            >
                              <div
                                className={`rounded-2xl px-4 py-2 ${
                                  isSender
                                    ? 'rounded-tr-none bg-[#15b7b9] text-white'
                                    : 'rounded-tl-none bg-white text-gray-800'
                                } shadow-sm`}
                              >
                                {chatMessage.message}
                              </div>
                              <div
                                className={`mt-1 text-xs text-gray-500 ${isSender ? 'text-right' : 'text-left'}`}
                              >
                                {chatMessage.timestamp &&
                                  format(
                                    new Date(chatMessage.timestamp),
                                    'h:mm a',
                                    { locale },
                                  )}
                              </div>
                            </div>

                            {!isSender && showAvatar && (
                              <div className="order-0 mr-2">
                                {getAvatar(32, 32, imageUrl, displayName)}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="border-t bg-white p-4">
                <div className="flex items-center gap-2">
                  <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
                    <Paperclip size={20} />
                  </button>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      ref={messageInputRef}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder={t('type-a-message')}
                      className="w-full rounded-full border border-gray-200 py-3 pl-4 focus:border-[#15b7b9] focus:outline-none focus:ring-1 focus:ring-[#15b7b9]"
                    />
                    <div
                      ref={emojiPickerRef}
                      className="absolute bottom-12 right-0 z-50"
                    >
                      {showEmojis && (
                        <EmojiPicker
                          onEmojiClick={onEmojiClick}
                          width={350}
                          height={400}
                          searchDisabled={false}
                          skinTonesDisabled={true}
                        />
                      )}
                    </div>
                    <button
                      onClick={() => setShowEmojis(!showEmojis)}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 transition-all duration-200 ${
                        showEmojis
                          ? 'bg-[#15b7b9] text-white'
                          : 'text-gray-500 hover:bg-gray-100 hover:text-[#15b7b9]'
                      }`}
                      title={t('add-emoji')}
                    >
                      <Smile
                        size={24}
                        className="transition-transform duration-200 hover:scale-110"
                      />
                    </button>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className={`rounded-full p-3 text-white transition-all ${
                      message.trim()
                        ? 'bg-[#15b7b9] hover:bg-[#109a9c]'
                        : 'bg-gray-300'
                    }`}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Chat;
