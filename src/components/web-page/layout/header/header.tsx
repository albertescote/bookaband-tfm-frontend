'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/web-page/layout/header/navBar';
import UserButtons from '@/components/web-page/layout/header/userButtons';
import { useWebPageAuth } from '@/providers/webPageAuthProvider';
import { Bell, Calendar, LogOut, MessageSquareText } from 'lucide-react';
import { getAvatar } from '@/components/shared/avatar';
import { getClientNotifications } from '@/service/backend/notifications/service/notifications.service';
import { getClientChats } from '@/service/backend/chat/service/chat.service';

export default function Header({ language }: { language: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logoutUser } = useWebPageAuth();
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
  const [unreadMessages, setUnreadMessages] = useState<number>(0);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isMenuOpen) {
        closeMenu();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    let notificationsInterval: NodeJS.Timeout;
    let messagesInterval: NodeJS.Timeout;

    if (user?.id) {
      const getNotificationsAndUpdateUnread = (userId: string) => {
        getClientNotifications(userId).then((receivedNotifications) => {
          if (receivedNotifications) {
            const totalUnread = receivedNotifications.filter(
              (notification) => notification.unread,
            ).length;
            setUnreadNotifications(totalUnread);
          }
        });
      };

      const getChatsAndUpdateUnreadMessages = (userId: string) => {
        getClientChats(userId).then((receivedChats) => {
          if (receivedChats) {
            const totalUnreadMessages = receivedChats.reduce(
              (total, chat) => total + chat.unreadMessagesCount,
              0,
            );
            setUnreadMessages(totalUnreadMessages);
          }
        });
      };

      getNotificationsAndUpdateUnread(user.id);
      getChatsAndUpdateUnreadMessages(user.id);

      notificationsInterval = setInterval(() => {
        getNotificationsAndUpdateUnread(user.id);
      }, 30000);

      messagesInterval = setInterval(() => {
        getChatsAndUpdateUnreadMessages(user.id);
      }, 30000);
    }

    return () => {
      if (notificationsInterval) clearInterval(notificationsInterval);
      if (messagesInterval) clearInterval(messagesInterval);
    };
  }, [user?.id]);

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#f3f4f6] px-4 py-2 sm:px-6">
      <div className="relative flex h-full items-center justify-between">
        <Link href="/" className="relative z-10">
          <Image
            src="/assets/logo.svg"
            alt="logo"
            height="200"
            width="200"
            className="h-6 w-auto sm:h-8"
          />
        </Link>

        <div className="ml-4 hidden flex-1 items-center justify-between lg:flex">
          <div className="flex-1">
            <Navbar language={language} />
          </div>
          <div className="ml-auto">
            <UserButtons language={language} />
          </div>
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="relative z-30 rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
          aria-label="Toggle menu"
        >
          <div className="relative h-5 w-5 overflow-hidden">
            <span
              className={`absolute left-0 block h-0.5 w-5 transform bg-current transition duration-300 ease-in-out ${
                isMenuOpen ? 'top-2 rotate-45' : 'top-0'
              }`}
            />
            <span
              className={`absolute left-0 top-2 block h-0.5 w-5 transform bg-current transition duration-300 ease-in-out ${
                isMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute left-0 block h-0.5 w-5 transform bg-current transition duration-300 ease-in-out ${
                isMenuOpen ? 'top-2 -rotate-45' : 'top-4'
              }`}
            />
          </div>
        </button>

        {isMenuOpen && (
          <div
            className="fixed inset-0 z-10 bg-black bg-opacity-50 lg:hidden"
            onClick={closeMenu}
          />
        )}

        <div
          className={`fixed inset-y-0 right-0 z-20 w-full max-w-xs overflow-y-auto bg-white shadow-xl transition-transform duration-300 ease-in-out lg:hidden ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="mt-16 flex flex-col items-center space-y-6 p-6">
              <div className="w-full">
                <Navbar language={language} onLinkClick={closeMenu} />
              </div>
              {!user && (
                <div className="w-full">
                  <UserButtons language={language} />
                </div>
              )}
            </div>

            {user && (
              <div className="mt-auto border-t border-gray-200 p-4">
                <div className="flex items-center justify-around">
                  <Link
                    href="/chat"
                    className="relative flex items-center justify-center rounded-full text-[#565d6d] transition-colors duration-300 hover:text-[#15b7b9]"
                    onClick={closeMenu}
                  >
                    <MessageSquareText size={24} />
                    {unreadMessages > 0 && (
                      <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-[#15b7b9] ring-2 ring-white"></span>
                    )}
                  </Link>
                  <Link
                    href="/notifications"
                    className="relative flex items-center justify-center rounded-full text-[#565d6d] transition-colors duration-300 hover:text-[#15b7b9]"
                    onClick={closeMenu}
                  >
                    <Bell size={24} />
                    {unreadNotifications > 0 && (
                      <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-[#15b7b9] ring-2 ring-white"></span>
                    )}
                  </Link>
                  <Link
                    href="/bookings"
                    className="relative flex items-center justify-center rounded-full text-[#565d6d] transition-colors duration-300 hover:text-[#15b7b9]"
                    onClick={closeMenu}
                  >
                    <Calendar size={24} />
                  </Link>
                  <button
                    onClick={() => {
                      logoutUser();
                      closeMenu();
                    }}
                    className="relative flex items-center justify-center rounded-full text-[#565d6d] transition-colors duration-300 hover:text-[#15b7b9]"
                  >
                    <LogOut size={24} />
                  </button>
                  <Link
                    href="/profile"
                    className="relative flex items-center justify-center rounded-full text-[#565d6d] transition-colors duration-300 hover:text-[#15b7b9]"
                    onClick={closeMenu}
                  >
                    {getAvatar(36, 36, user.imageUrl, user.firstName)}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
