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
  const [role, setRole] = useState('none');
  const [userBands, setUserBands] = useState<UserBand[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const [forceRefresh, setForceRefresh] = useState<boolean>(false);

  useEffect(() => {
    const isProtectedRoute = (path: string, lng: string): boolean => {
      let allProtectedRoutes: string[] = [];
      allProtectedRoutes = allProtectedRoutes.concat(
        COMMON_PROTECTED_ROUTES,
        CLIENT_PROTECTED_ROUTES,
        MUSICIAN_PROTECTED_ROUTES,
      );

      const langPrefix = `/${lng}`;

      const protectedRouteFound = allProtectedRoutes.find((route) => {
        return new RegExp(
          `^${langPrefix}${route.replace(/\[.*\]/, '[^/]+')}$`,
        ).test(path);
      });
      return !!protectedRouteFound;
    };
    validateAccessToken().then((accessTokenPayload) => {
      if (accessTokenPayload) {
        setAuthenticated(true);
        setRole(accessTokenPayload.role);
        if (accessTokenPayload.role === Role.Musician) {
          getUserBands().then((userBandsArray) => {
            if (userBandsArray) {
              setUserBands(userBandsArray);
            }
          });
        }
      } else if (isProtectedRoute(pathname, pathname.split('/')[1])) {
        setAuthenticated(false);
        setRole('none');
        setUserBands([]);
        router.push('/login');
      }
    });
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
