'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/service/backend/auth/service/auth.service';
import { getUserInfo } from '@/service/backend/user/service/user.service';
import { Role } from '@/service/backend/user/domain/role';
import { User } from '@/service/backend/user/domain/user';
import { AUTH_URL, PAGE_URL } from '@/publicConfig';
import { getUserBands } from '@/service/backend/band/service/band.service';
import { UserBand } from '@/service/backend/band/domain/userBand';

type AuthContextType = {
  user: User | null;
  userBands: UserBand[];
  selectedBand: UserBand | null;
  setSelectedBand: React.Dispatch<React.SetStateAction<UserBand | null>>;
  loading: boolean;
  logoutUser: () => void;
  unreadMessages: number;
  setUnreadMessages: React.Dispatch<React.SetStateAction<number>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SELECTED_BAND_KEY = 'selectedBand';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userBands, setUserBands] = useState<UserBand[]>([]);
  const [selectedBand, setSelectedBandState] = useState<UserBand | null>(() => {
    if (typeof window !== 'undefined') {
      const savedBand = localStorage.getItem(SELECTED_BAND_KEY);
      return savedBand ? JSON.parse(savedBand) : null;
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const language = pathname?.split('/')[1];

  // Custom setter for selectedBand that also updates localStorage
  const setSelectedBand = (value: React.SetStateAction<UserBand | null>) => {
    setSelectedBandState((prevValue) => {
      const newValue = typeof value === 'function' ? value(prevValue) : value;
      if (typeof window !== 'undefined') {
        if (newValue) {
          localStorage.setItem(SELECTED_BAND_KEY, JSON.stringify(newValue));
        } else {
          localStorage.removeItem(SELECTED_BAND_KEY);
        }
      }
      return newValue;
    });
  };

  useEffect(() => {
    getUserInfo()
      .then((user) => {
        if (user) {
          if (user.role !== Role.Musician) {
            window.location.href = AUTH_URL + `/${language}/login`;
          } else {
            setUser(user);
            getUserBands().then((bands) => {
              if (bands) {
                setUserBands(bands);
                // Only set the first band as selected if there's no selected band in localStorage
                // or if the selected band is not in the user's bands
                if (
                  !selectedBand ||
                  !bands.some((band) => band.id === selectedBand.id)
                ) {
                  setSelectedBand(bands[0]);
                }
              }
            });
          }
        } else {
          setUser(null);
        }
      })
      .catch(() => {
        setUser(null);
        setUserBands([]);
        setSelectedBand(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const logoutUser = async () => {
    await logout();
    setUser(null);
    setUserBands([]);
    setSelectedBand(null);
    window.location.href = PAGE_URL + `/${language}/`;
  };

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = AUTH_URL + `/${language}/login`;
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
    <AuthContext.Provider
      value={{
        user,
        userBands,
        selectedBand,
        setSelectedBand,
        loading,
        logoutUser,
        unreadMessages,
        setUnreadMessages,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useWebAppAuth must be used within a WebAppAuthProvider');
  }
  return context;
}
