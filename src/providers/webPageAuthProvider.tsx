'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/service/backend/auth/service/auth.service';
import { getUserInfo } from '@/service/backend/user/service/user.service';
import { Role } from '@/service/backend/user/domain/role';
import { User } from '@/service/backend/user/domain/user';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  logoutUser: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const publicRoutes = ['/'];

export function WebPageAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const language = pathname?.split('/')[1];

  const normalizedPath = pathname?.split('/').slice(2).join('/') || '';
  const pathWithoutLang = '/' + normalizedPath;

  useEffect(() => {
    getUserInfo()
      .then((user) => {
        if (user) {
          if (user.role !== Role.Client) {
            router.push(`/${language}/dashboard`);
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
    router.push(`/${language}/`);
  };

  useEffect(() => {
    if (!loading && !user) {
      const isPublic = publicRoutes.some(
        (publicRoute) =>
          pathWithoutLang === publicRoute ||
          pathWithoutLang.startsWith(publicRoute + '/'),
      );

      if (!isPublic) {
        router.push(`/${language}/login`);
      }
    }
  }, [loading, user, router, pathWithoutLang]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#15b7b9] border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useWebPageAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useWebPageAuth must be used within a WebPageAuthProvider');
  }
  return context;
}
