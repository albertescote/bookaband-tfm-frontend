'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/service/backend/auth/service/auth.service';
import { getUserInfo } from '@/service/backend/user/service/user.service';
import { Role } from '@/service/backend/user/domain/role';
import { User } from '@/service/backend/user/domain/user';
import { getClientChats } from '@/service/backend/chat/service/chat.service';

type AuthContextType = {
  user: User | null;
  unreadMessages: number;
  setUnreadMessages: React.Dispatch<React.SetStateAction<number>>;
  logoutUser: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [unreadMessages, setUnreadMessages] = useState<number>(0);
  const router = useRouter();
  const pathname = usePathname();
  const language = pathname?.split('/')[1];

  useEffect(() => {
    getUserInfo()
      .then((user) => {
        if (user) {
          if (user.role !== Role.Client) {
            setUser(null);
          } else {
            setUser(user);
            getClientChats(user.id).then((chats) => {
              if ('error' in chats) return;
              const totalUnread = chats.reduce(
                (sum, item) => sum + item.unreadMessagesCount,
                0,
              );
              setUnreadMessages(totalUnread);
            });
          }
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, []);

  const logoutUser = async () => {
    await logout();
    setUser(null);
    router.push(`/${language}/`);
  };

  return (
    <AuthContext.Provider
      value={{ user, unreadMessages, setUnreadMessages, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useWebPageAuth must be used within a WebPageAuthProvider');
  }
  return context;
}
