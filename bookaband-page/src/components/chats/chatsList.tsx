'use client';
import React, { useState } from 'react';
import { ChatView } from '@/service/backend/chat/domain/chatView';
import { MessageSquare, Search } from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';
import { getAvatar } from '@/components/shared/avatar';
import { useAuth } from '@/providers/authProvider';

interface ChatsListProps {
  language: string;
  chats: ChatView[];
  activeChatId?: string;
  onSelectChat: (chatId: string) => void;
}

export function ChatsList({
  language,
  chats,
  activeChatId,
  onSelectChat,
}: ChatsListProps) {
  const { t } = useTranslation(language, 'chat');
  const { unreadMessages, setUnreadMessages } = useAuth();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredChats = chats.filter((chat) =>
    chat.band?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getLastMessagePreview = (chat: ChatView) => {
    if (!chat.messages || chat.messages.length === 0) return '...';
    const lastMessage = chat.messages[chat.messages.length - 1];

    if (lastMessage.bookingMetadata?.bookingId) {
      return t('new-booking');
    }

    if (lastMessage.fileUrl) {
      if (isImageFile(lastMessage.fileUrl)) {
        return t('image-message');
      }
      if (isVideoFile(lastMessage.fileUrl)) {
        return t('video-message');
      }
      return t('document-message');
    }

    const messageText = lastMessage.message || '';
    return messageText.length > 40
      ? `${messageText.substring(0, 40)}...`
      : messageText;
  };

  const isImageFile = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };

  const isVideoFile = (url: string) => {
    return /\.(mp4|webm|ogg)$/i.test(url);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-4 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t('search-chats')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-[#15b7b9] focus:outline-none focus:ring-1 focus:ring-[#15b7b9]"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 p-8 text-center text-gray-500">
            <MessageSquare className="h-12 w-12 text-gray-300" />
            <p>{searchQuery ? t('no-chats-found') : t('no-chats-available')}</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filteredChats.map((chat) => (
              <li
                key={chat.id}
                className={`relative transition ${
                  chat.id === activeChatId ? 'bg-[#e3f8f8]' : 'hover:bg-gray-50'
                }`}
                onClick={() => {
                  setUnreadMessages(unreadMessages - chat.unreadMessagesCount);
                  chat.unreadMessagesCount = 0;
                  onSelectChat(chat.id);
                }}
              >
                <div className="flex cursor-pointer items-center p-4">
                  <div className="relative">
                    {getAvatar(
                      12,
                      chat.band?.imageUrl,
                      chat.band?.name || t('unknown'),
                    )}
                    {chat.unreadMessagesCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#15b7b9] text-xs font-bold text-white">
                        {chat.unreadMessagesCount}
                      </span>
                    )}
                  </div>
                  <div className="ml-3 flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <h3 className="truncate font-medium text-gray-900">
                        {chat.band?.name || t('unknown')}
                      </h3>
                    </div>
                    <p className="mt-1 truncate text-sm text-gray-600">
                      {getLastMessagePreview(chat)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
