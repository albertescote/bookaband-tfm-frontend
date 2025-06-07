'use client';

import React, { useEffect, useState } from 'react';
import { Menu, MessageCircle, X } from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';
import { ChatView } from '@/service/backend/chat/domain/chatView';
import { getBandChats } from '@/service/backend/chat/service/chat.service';
import { useAuth } from '@/providers/authProvider';
import Chat from '@/components/chats/chat';

interface ChatClientPageProps {
  language: string;
  chatId?: string;
}

export function ChatLayout({ language, chatId }: ChatClientPageProps) {
  const { t } = useTranslation(language, 'chat');
  const { selectedBand } = useAuth();
  const [activeChatId, setActiveChatId] = useState<string | undefined>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [chatsState, setChatsState] = useState<ChatView[]>([]);

  useEffect(() => {
    if (!selectedBand) return;
    getBandChats(selectedBand?.id).then((chats) => {
      if (chats) {
        setChatsState(chats);
        if (chatId) {
          selectChat(chatId);
        } else if (chats.length > 0) {
          selectChat(chats[0].id);
        }
      }
    });
  }, []);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    if (isMobile && activeChatId) {
      setSidebarOpen(false);
    }
  }, [activeChatId, isMobile]);

  const selectChat = (selectedChatId: string) => {
    setChatsState((prev) => {
      if (!prev) return prev;
      return prev.map((chat) =>
        chat.id === selectedChatId ? { ...chat, unreadMessagesCount: 0 } : chat,
      );
    });
    setActiveChatId(selectedChatId);
  };

  const renderMainContent = () => {
    if (activeChatId) {
      const selectedChat = chatsState.find((chat) => chat.id === activeChatId);
      return (
        <Chat
          language={language}
          chatId={activeChatId}
          initialChat={selectedChat}
        />
      );
    } else {
      return (
        <div className="flex h-full items-center justify-center p-4">
          <div className="max-w-md rounded-xl bg-white p-8 text-center ">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#e3f8f8]">
              <MessageCircle size={40} className="text-[#15b7b9]" />
            </div>

            <h1 className="mb-4 text-2xl font-bold text-[#15b7b9]">
              {t('start-chatting')}
            </h1>

            <p className="mb-6 text-gray-600">{t('no-chats-start-new')}</p>

            <div className="flex flex-col space-y-3"></div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white">
      <div
        className={`fixed z-20 h-full transition-all duration-300 ease-in-out md:relative ${
          sidebarOpen
            ? 'w-96 translate-x-0'
            : 'w-0 -translate-x-full md:w-16 md:translate-x-0'
        }`}
      >
        <div className="flex h-full flex-col overflow-hidden bg-white shadow-lg">
          <div className="flex h-16 items-center justify-between border-b bg-gradient-to-r from-[#15b7b9] to-[#1fc8ca] px-4">
            <h2
              className={`text-xl font-bold text-white transition-opacity duration-300 ${
                sidebarOpen ? 'opacity-100' : 'opacity-0 md:hidden'
              }`}
            >
              {t('chats')}
            </h2>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-full p-1 text-white hover:bg-white/20"
            >
              {sidebarOpen ? (
                <X size={20} />
              ) : (
                <Menu size={20} className="hidden md:block" />
              )}
            </button>
          </div>
        </div>
      </div>

      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {!sidebarOpen && isMobile && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed bottom-4 left-4 z-20 rounded-full bg-[#15b7b9] p-3 text-white shadow-lg md:hidden"
        >
          <Menu size={24} />
        </button>
      )}

      <div
        className={`flex-1 transition-all duration-300 ${isMobile && sidebarOpen ? 'opacity-30' : ''}`}
      >
        {renderMainContent()}
      </div>
    </div>
  );
}
