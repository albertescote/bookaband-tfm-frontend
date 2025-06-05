'use client';

import React, { useEffect, useState } from 'react';
import Chat from './chat';
import { ChatsList } from './chatsList';
import { Menu, MessageCircle, X } from 'lucide-react';
import { ChatView } from '@/service/backend/chat/domain/chatView';
import { useTranslation } from '@/app/i18n/client';
import Link from 'next/link';

interface ChatClientPageProps {
  language: string;
  chats: ChatView[];
  chatId?: string;
  bandId?: string;
}

export function ChatLayout({
  language,
  chats,
  chatId,
  bandId,
}: ChatClientPageProps) {
  const { t } = useTranslation(language, 'chat');
  const [activeChatId, setActiveChatId] = useState<string | undefined>(chatId);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [chatsState, setChatsState] = useState<ChatView[]>(chats);

  useEffect(() => {
    setChatsState(chats);
  }, [chats]);

  useEffect(() => {
    if (bandId) {
      const existingChat = chats.find((chat) => chat.band.id === bandId);
      if (existingChat) {
        selectChat(existingChat.id);
      }
    } else if (chatId) {
      selectChat(chatId);
    } else if (chats.length > 0 && !activeChatId) {
      selectChat(chats[0].id);
    }
  }, [bandId, chatId, chats]);

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
    if (isMobile && (activeChatId || bandId)) {
      setSidebarOpen(false);
    }
  }, [activeChatId, bandId, isMobile]);

  const selectChat = (selectedChatId: string) => {
    setChatsState((prevChats) => {
      return prevChats.map((chat) => ({
        ...chat,
        unreadMessagesCount:
          chat.id === selectedChatId ? 0 : chat.unreadMessagesCount,
      }));
    });
    setActiveChatId(selectedChatId);
  };

  const renderMainContent = () => {
    if (activeChatId || bandId) {
      return (
        <Chat
          language={language}
          userChats={chats}
          setChats={setChatsState}
          bandId={bandId}
          chatId={activeChatId}
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

            <div className="flex flex-col space-y-3">
              <Link
                href={`/${language}/find-artists`}
                className="w-full rounded-full bg-[#15b7b9] px-6 py-3 font-medium text-white transition-colors hover:bg-[#109a9c]"
              >
                {t('browse-bands')}
              </Link>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] overflow-hidden bg-white">
      <div
        className={`fixed z-20 h-[calc(100vh-5rem)] transition-all duration-300 ease-in-out md:relative ${
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

          <div
            className={`flex-1 overflow-y-auto transition-all duration-300 ${
              sidebarOpen ? 'opacity-100' : 'opacity-0 md:hidden'
            }`}
          >
            {sidebarOpen && (
              <div className="h-full">
                <ChatsList
                  language={language}
                  chats={chatsState}
                  activeChatId={activeChatId}
                  onSelectChat={selectChat}
                />
              </div>
            )}
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
        className={`flex-1 overflow-hidden transition-all duration-300 ${isMobile && sidebarOpen ? 'opacity-30' : ''}`}
      >
        {renderMainContent()}
      </div>
    </div>
  );
}
