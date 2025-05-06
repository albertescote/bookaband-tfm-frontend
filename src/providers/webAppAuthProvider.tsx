'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/service/backend/auth/service/auth.service';
import { getUserInfo } from '@/service/backend/user/service/user.service';
import { Role } from '@/service/backend/user/domain/role';

type User = {
  id: string;
  email: string;
  name?: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  logoutUser: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function WebAppAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const language = pathname?.split('/')[1];

  useEffect(() => {
    getUserInfo()
      .then((user) => {
        if (user) {
          if (user.role === Role.Client) {
            router.push(`/${language}/`);
          } else {
            setUser(user);
          }
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const logoutUser = async () => {
    await logout();
    setUser(null);
    router.push(`/${language}/login`);
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/${language}/login`);
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#15b7b9] border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, loading, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useWebAppAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useWebAppAuth must be used within a WebAppAuthProvider');
  }
  return context;
}
