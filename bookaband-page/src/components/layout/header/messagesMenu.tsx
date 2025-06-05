'use client';

import { MessageSquareOff, MessageSquareText } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/app/i18n/client';
import { ChatView } from '@/service/backend/chat/domain/chatView';
import { getClientChats } from '@/service/backend/chat/service/chat.service';
import { useAuth } from '@/providers/authProvider';
import { toast } from 'react-hot-toast';
import { getAvatar } from '@/components/shared/avatar';

export default function MessagesMenu({ language }: { language: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [chats, setChats] = useState<ChatView[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation(language, 'chat');
  const { user, unreadMessages, setUnreadMessages } = useAuth();

  const getChatsAndUpdateUnreadMessages = (userId: string) => {
    getClientChats(userId).then((receivedChats) => {
      if ('error' in receivedChats) {
        toast.error(receivedChats.error);
      } else {
        setChats(receivedChats);
        const totalUnreadMessages = receivedChats.reduce(
          (total, chat) => total + chat.unreadMessagesCount,
          0,
        );
        setUnreadMessages(totalUnreadMessages);
      }
    });
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (user?.id) {
      getChatsAndUpdateUnreadMessages(user.id);

      interval = setInterval(() => {
        getChatsAndUpdateUnreadMessages(user.id);
      }, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [user?.id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavigateToChat = (
    unreadMessagesFromOpenedChat: number,
    chatId: string,
  ) => {
    setUnreadMessages(unreadMessages - unreadMessagesFromOpenedChat);

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, unreadMessagesCount: 0 } : chat,
      ),
    );

    setMenuOpen(false);
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="relative flex items-center justify-center rounded-full text-[#565d6d] transition-colors duration-300 hover:text-[#15b7b9]"
      >
        <MessageSquareText size={24} />
        {unreadMessages > 0 && (
          <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-[#15b7b9] ring-2 ring-white"></span>
        )}
      </button>

      {menuOpen && (
        <div
          className="absolute right-0 z-50 mt-6 w-80 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg ring-1 ring-black ring-opacity-5"
          style={{ maxHeight: '500px' }}
        >
          <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-[#15b7b9]/10 to-white px-4 py-3">
            <h3 className="text-sm font-semibold text-gray-900">
              {t('recent-messages')}
            </h3>
            {unreadMessages > 0 && (
              <span className="rounded-full bg-[#15b7b9] px-2 py-1 text-xs font-medium text-white">
                {unreadMessages} {t('new')}
              </span>
            )}
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: '320px' }}>
            {chats.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {chats.map((chat) => {
                  const lastMessage =
                    chat.messages.length > 0
                      ? chat.messages[chat.messages.length - 1].content
                      : t('no-messages');

                  const name =
                    chat.band?.name ||
                    `${chat.user.firstName} ${chat.user.familyName}`;

                  return (
                    <Link
                      key={chat.id}
                      href={`/${language}/chats?chat_id=${chat.id}`}
                      onClick={() => {
                        handleNavigateToChat(chat.unreadMessagesCount, chat.id);
                      }}
                      className="flex items-center gap-3 px-4 py-3 transition-colors duration-200 hover:bg-[#15b7b9]/5"
                    >
                      {getAvatar(12, chat.band.imageUrl, chat.band.name)}
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="truncate text-sm font-medium text-gray-900">
                            {name}
                          </span>
                          {chat.unreadMessagesCount > 0 && (
                            <span className="flex-shrink-0 rounded-full bg-[#15b7b9] px-2 py-0.5 text-xs text-white">
                              {chat.unreadMessagesCount}
                            </span>
                          )}
                        </div>
                        <p className="truncate text-xs text-gray-500">
                          {lastMessage}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-4 py-6 text-center">
                <MessageSquareOff size={36} className="mb-2 text-gray-300" />
                <p className="text-sm text-gray-500">{t('no-chats')}</p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-100">
            <Link
              href={`/${language}/chats`}
              onClick={() => setMenuOpen(false)}
              className="block w-full px-4 py-3 text-center text-sm font-semibold text-[#15b7b9] transition-colors duration-200 hover:bg-[#15b7b9]/10"
            >
              {t('view-all-messages')}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
