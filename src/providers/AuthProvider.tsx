import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { validateAccessToken } from '@/service/backend/auth/service/auth.service';
import { Role } from '@/service/backend/user/domain/role';
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
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState('none');
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
          setRole(accessTokenPayload.role);
        } else if (isProtectedRoute(pathname, pathname?.split('/')[1])) {
          setAuthenticated(false);
          setRole('none');
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
