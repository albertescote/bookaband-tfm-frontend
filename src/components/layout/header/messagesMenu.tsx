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
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation(language, 'chat');
  const { user } = useWebPageAuth();

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

  useEffect(() => {
    if (menuOpen && user?.id) {
      getClientChats(user.id).then((data) => {
        if (data) {
          setChats(data);
        }
      });
    }
  }, [menuOpen]);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center justify-center rounded-full text-[#565d6d] transition-colors duration-300 hover:text-[#15b7b9]"
      >
        <MessageSquareText size={24} />
      </button>

      {menuOpen && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border border-[#15b7b9] bg-white shadow-xl">
          <p className="px-4 py-2 text-sm font-semibold text-[#565d6d]">
            {t('recent-messages')}
          </p>
          <div className="divide-y">
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
                    className="block px-4 py-3 text-sm hover:bg-[#15b7b9]/10"
                  >
                    <span className="font-semibold">{name}</span>: {lastMessage}
                    {chat.unreadMessagesCount > 0 && (
                      <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
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
        </div>
      )}
    </div>
  );
}
