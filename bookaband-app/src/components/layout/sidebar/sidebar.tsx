'use client';

import { useAuth } from '@/providers/authProvider';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { getAvatar } from '@/components/shared/avatar';
import LanguageSwitcher from './language-switcher';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useTranslation } from '@/app/i18n/client';
import { NavItem } from '@/components/layout/sidebar/navItem';
import { ChatsList } from '@/components/chats/chatsList';
import { useEffect, useState } from 'react';
import { ChatView } from '@/service/backend/chat/domain/chatView';
import { getBandChats } from '@/service/backend/chat/service/chat.service';

export default function Sidebar() {
  const { user, logoutUser, selectedBand } = useAuth();
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const language = params.lng as string;
  const { t } = useTranslation(language, 'home');
  const isChatsPage = pathname.includes('/chats');
  const [isMainSidebarCollapsed, setIsMainSidebarCollapsed] =
    useState(isChatsPage);
  const [chats, setChats] = useState<ChatView[]>([]);
  const currentChatId = searchParams.get('chat_id');

  useEffect(() => {
    setIsMainSidebarCollapsed(isChatsPage);
  }, [isChatsPage]);

  useEffect(() => {
    if (!selectedBand) return;
    getBandChats(selectedBand.id).then((chats) => {
      if (chats) {
        setChats(chats);
      }
    });
  }, [selectedBand]);

  const toggleMainSidebar = () => {
    setIsMainSidebarCollapsed(!isMainSidebarCollapsed);
  };

  const handleChatSelect = (chatId: string) => {
    router.push(`/${language}/chats?chat_id=${chatId}`);
  };

  const handleChatsClick = () => {
    if (chats.length > 0) {
      handleChatSelect(chats[0].id);
    } else {
      router.push(`/${language}/chats`);
    }
  };

  return (
    <div className="flex">
      {/* Main Navigation Sidebar */}
      <aside
        className={`hidden border-r bg-white shadow-md transition-all duration-300 md:flex ${
          isMainSidebarCollapsed ? 'w-0' : 'w-64'
        }`}
      >
        <div className="flex w-64 flex-col">
          <div className="p-6 text-2xl font-extrabold text-[#15b7b9]">
            BookaBand
          </div>
          <nav className="flex-1 space-y-2 px-4">
            <NavItem href="/dashboard" label={t('dashboard')} />
            <NavItem href="/calendar" label={t('calendar')} />
            <NavItem
              href="/chats"
              label={t('chats')}
              onClick={handleChatsClick}
            />
            <NavItem href="/bands" label={t('bands')} />
            <NavItem href="/performances" label={t('performances')} />
            <NavItem href="/payments" label={t('payments')} />
            <NavItem href="/profile" label={t('profile-tab')} />
          </nav>
          <div className="space-y-4 border-t p-4">
            <div className="flex items-center space-x-3 px-3">
              {getAvatar(28, 28, user?.imageUrl, user?.firstName)}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.familyName}
                </p>
                <p className="truncate text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <div
              className={`space-y-1 ${isMainSidebarCollapsed ? 'hidden' : ''}`}
            >
              <LanguageSwitcher language={language} />
              <button
                onClick={logoutUser}
                className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="h-5 w-5" />
                <span>{t('logout')}</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Chat List Sidebar (only visible on chats page) */}
      {isChatsPage && (
        <aside className="hidden w-64 flex-col border-r bg-white shadow-md md:flex">
          <div className="flex items-center justify-between border-b bg-gradient-to-r from-[#15b7b9] to-[#1fc8ca] px-4 pb-5 pt-4">
            <h2 className="text-lg font-semibold text-white">{t('chats')}</h2>
            <button
              onClick={toggleMainSidebar}
              className="rounded-full p-1 text-white hover:bg-white/20"
            >
              {isMainSidebarCollapsed ? (
                <ChevronLeft className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </button>
          </div>
          <ChatsList
            language={language}
            chats={chats}
            activeChatId={currentChatId || undefined}
            onSelectChat={handleChatSelect}
          />
        </aside>
      )}
    </div>
  );
}
