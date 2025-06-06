'use client';
import React, { useState } from 'react';
import { ChatView } from '@/service/backend/chat/domain/chatView';
import { MessageSquare, Search } from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';
import { getAvatar } from '@/components/shared/avatar';
import { formatDistanceToNow } from 'date-fns';
import { ca, es } from 'date-fns/locale';
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
    (chat.user?.firstName + ' ' + chat.user?.familyName)
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  const getLastMessagePreview = (chat: ChatView) => {
    if (!chat.messages || chat.messages.length === 0) return '...';
    const lastMessage = chat.messages[chat.messages.length - 1];

    if (lastMessage.metadata?.bookingId) {
      return t('new-booking');
    }

    const messageText = lastMessage.message || '';
    return messageText.length > 40
      ? `${messageText.substring(0, 40)}...`
      : messageText;
  };

  const getLastMessageTime = (chat: ChatView) => {
    if (!chat.messages || chat.messages.length === 0) return '';
    const date = new Date(
      chat.messages[chat.messages.length - 1].timestamp || chat.updatedAt,
    );
    const locale = language === 'es' ? es : language === 'ca' ? ca : undefined;
    return formatDistanceToNow(date, { addSuffix: true, locale });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search-chats')}
              className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 focus:border-[#15b7b9] focus:outline-none focus:ring-1 focus:ring-[#15b7b9]"
            />
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {filteredChats.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-4 text-center">
            <MessageSquare className="mb-4 h-12 w-12 text-gray-400" />
            <p className="text-gray-500">{t('no-chats-found')}</p>
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
                      48,
                      48,
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
