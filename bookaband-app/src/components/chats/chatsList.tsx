'use client';
import React, { useState } from 'react';
import { ChatView } from '@/service/backend/chat/domain/chatView';
import { MessageSquare, Search } from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';
import { getAvatar } from '@/components/shared/avatar';
import { formatDistanceToNow } from 'date-fns';
import { ca, es } from 'date-fns/locale';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadMessages, setUnreadMessages] = useState(
    chats.reduce((acc, chat) => acc + chat.unreadMessagesCount, 0),
  );

  const isImageFile = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };

  const isVideoFile = (url: string) => {
    return /\.(mp4|webm|ogg)$/i.test(url);
  };

  const getLastMessagePreview = (chat: ChatView) => {
    if (!chat.messages.length) return '';

    const lastMessage = chat.messages[chat.messages.length - 1];

    if (lastMessage.fileUrl) {
      if (isImageFile(lastMessage.fileUrl)) {
        return t('image-message');
      }
      if (isVideoFile(lastMessage.fileUrl)) {
        return t('video-message');
      }
      return t('document-message');
    }

    return lastMessage.message || '';
  };

  const getLastMessageTime = (chat: ChatView) => {
    if (!chat.messages.length) return '';

    const lastMessage = chat.messages[chat.messages.length - 1];
    const messageDate = lastMessage.timestamp
      ? new Date(lastMessage.timestamp)
      : new Date();

    const locale = language === 'es' ? es : language === 'ca' ? ca : undefined;
    return formatDistanceToNow(messageDate, {
      addSuffix: true,
      locale,
    });
  };

  const filteredChats = chats.filter((chat) => {
    const searchTerm = searchQuery.toLowerCase();
    const userName =
      `${chat.user?.firstName} ${chat.user?.familyName}`.toLowerCase();
    const bandName = chat.band?.name.toLowerCase();
    const lastMessage = getLastMessagePreview(chat).toLowerCase();

    return (
      userName.includes(searchTerm) ||
      bandName.includes(searchTerm) ||
      lastMessage.includes(searchTerm)
    );
  });

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <div className="relative">
          <input
            type="text"
            placeholder={t('search-chats')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-gray-200 py-2 pl-10 pr-4 focus:border-[#15b7b9] focus:outline-none focus:ring-1 focus:ring-[#15b7b9]"
          />
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex h-full items-center justify-center p-4">
            <div className="text-center">
              <MessageSquare className="mx-auto mb-2 h-8 w-8 text-gray-400" />
              <p className="text-gray-500">{t('no-chats-found')}</p>
            </div>
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
                      10,
                      chat.user?.imageUrl,
                      chat.user?.firstName + ' ' + chat.user?.familyName ||
                        t('unknown'),
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
                        {chat.user?.firstName + ' ' + chat.user?.familyName ||
                          t('unknown')}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {getLastMessageTime(chat)}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                      <p className="truncate">{getLastMessagePreview(chat)}</p>
                    </div>
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
