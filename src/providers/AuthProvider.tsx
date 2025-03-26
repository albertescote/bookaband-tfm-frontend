import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { validateAccessToken } from '@/service/backend/auth/service/auth.service';
import { UserBand } from '@/service/backend/band/domain/userBand';
import { Role } from '@/service/backend/user/domain/role';

import { getUserBands } from '@/service/backend/band/service/band.service';
import { usePathname, useRouter } from 'next/navigation';

const COMMON_PROTECTED_ROUTES: string[] = [
  '/offer-details',
  '/profile',
  '/chat',
  '/chat/[id]',
  '/booking',
  '/booking/[id]',
];

const CLIENT_PROTECTED_ROUTES: string[] = ['/chat/new'];
const MUSICIAN_PROTECTED_ROUTES: string[] = [
  '/manage-offers',
  '/band',
  '/offer',
];

interface AuthContextType {
  forceRefresh: {
    forceRefresh: boolean;
    setForceRefresh: (forceRefresh: boolean) => void;
  };
  authentication: {
    isAuthenticated: boolean;
    setAuthenticated: (auth: boolean) => void;
  };
  role: { role: string; setRole: (role: string) => void };
  userBands: {
    userBands: UserBand[];
    setUserBands: (userBands: UserBand[]) => void;
  };
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  console.log('setting role to none 1');
  const [role, setRole] = useState('none');
  const [userBands, setUserBands] = useState<UserBand[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const [forceRefresh, setForceRefresh] = useState<boolean>(false);

  const isProtectedRoute = (
    path: string | null,
    lng: string | undefined,
  ): boolean => {
    if (!path || !lng) return false;

    const allProtectedRoutes = [
      ...COMMON_PROTECTED_ROUTES,
      ...(role === Role.Client ? CLIENT_PROTECTED_ROUTES : []),
      ...(role === Role.Musician ? MUSICIAN_PROTECTED_ROUTES : []),
    ];

    const langPrefix = `/${lng}`;
    return allProtectedRoutes.some((route) => {
      const routePattern = new RegExp(
        `^${langPrefix}${route.replace(/\[.*?\]/, '[^/]+')}$`,
      );
      return routePattern.test(path);
    });
  };

  useEffect(() => {
    let isMounted = true;

    const validateAuth = async () => {
      try {
        const accessTokenPayload = await validateAccessToken();
        if (!isMounted) return;

        if (accessTokenPayload) {
          setAuthenticated(true);
          console.log('setting role to:', accessTokenPayload.role);
          setRole(accessTokenPayload.role);
          if (accessTokenPayload.role === Role.Musician) {
            const userBandsArray = await getUserBands();
            if (userBandsArray && isMounted) setUserBands(userBandsArray);
          }
        } else if (isProtectedRoute(pathname, pathname?.split('/')[1])) {
          setAuthenticated(false);
          console.log('setting role to none 2');
          setRole('none');
          setUserBands([]);
          console.log(pathname);
          router.push('/login');
        }
      } catch (error) {
        console.error('Auth validation failed:', error);
      }
    };

    validateAuth().then();
    return () => {
      isMounted = false;
    };
  }, [pathname, forceRefresh]);

  return (
    <AuthContext.Provider
      value={{
        forceRefresh: { forceRefresh, setForceRefresh },
        authentication: {
          isAuthenticated,
          setAuthenticated,
        },
        role: { role, setRole },
        userBands: { userBands, setUserBands },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
