'use client';
import { MessageSquareText } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/app/i18n/client';
import { ChatView } from '@/service/backend/chat/domain/chatView';
import { getClientChats } from '@/service/backend/chat/service/chat.service';
import { useWebPageAuth } from '@/providers/webPageAuthProvider';

export default function MessagesMenu({ language }: { language: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [chats, setChats] = useState<ChatView[]>([]);
  const [unreadMessages, setUnreadMessages] = useState<number>(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation(language, 'chat');
  const { user } = useWebPageAuth();

  const getChatsAndUpdateUnreadMessages = (userId: string) => {
    getClientChats(userId).then((receivedChats) => {
      if (receivedChats) {
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

  const handleNavigateToChat = (unreadMessagesFromOpenedChat: number) => {
    setUnreadMessages(unreadMessages - unreadMessagesFromOpenedChat);
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
          className="animate-fade-in absolute right-0 z-50 mt-2 w-80 transform rounded-xl border border-[#15b7b9] bg-white shadow-2xl transition-all duration-300 ease-out"
          style={{ minWidth: '18rem' }}
        >
          <p className="px-4 py-3 text-sm font-semibold tracking-wide text-[#222]">
            {t('recent-messages')}
          </p>
          <div className="divide-y divide-gray-200">
            {chats.length > 0 ? (
              chats.map((chat) => {
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
                    href={`/${language}/chat/${chat.id}`}
                    onClick={() => {
                      handleNavigateToChat(chat.unreadMessagesCount);
                    }}
                    className="flex items-center justify-between gap-2 rounded-md px-4 py-3 text-sm text-[#4a4f5a] transition-colors duration-200 hover:bg-[#15b7b9]/10 hover:text-[#15b7b9]"
                  >
                    <div className="flex flex-grow flex-col overflow-hidden">
                      <span className="truncate font-semibold">{name}</span>
                      <span className="max-w-[14rem] truncate text-xs text-gray-500">
                        {lastMessage}
                      </span>
                    </div>
                    {chat.unreadMessagesCount > 0 && (
                      <span className="flex-shrink-0 rounded-full bg-[#15b7b9] px-2 py-0.5 text-xs text-white">
                        {chat.unreadMessagesCount}
                      </span>
                    )}
                  </Link>
                );
              })
            ) : (
              <p className="px-4 py-3 text-sm text-gray-500">{t('no-chats')}</p>
            )}
          </div>
          <div className="border-t border-gray-200">
            <Link
              href={`/${language}/chat`}
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
