import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { validateAccessToken } from '@/service/backend/auth/service/auth.service';
import { Role } from '@/service/backend/user/domain/role';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

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
  const searchParams = useSearchParams();

  const isProtectedRoute = (
    path: string | null,
    lng: string | undefined,
  ): { isProtected: boolean; routePattern?: string } => {
    if (!path || !lng) return { isProtected: false };

    const allProtectedRoutes = [
      ...COMMON_PROTECTED_ROUTES,
      ...(role === Role.Client ? CLIENT_PROTECTED_ROUTES : []),
      ...(role === Role.Musician ? MUSICIAN_PROTECTED_ROUTES : []),
    ];

    const langPrefix = `/${lng}`;
    for (const route of allProtectedRoutes) {
      const routePattern = new RegExp(
        `^${langPrefix}${route.replace(/\[.*?\]/, '[^/]+')}$`,
      );
      if (routePattern.test(path)) {
        return { isProtected: true, routePattern: route };
      }
    }
    return { isProtected: false };
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
        } else {
          const lng = pathname?.split('/')[1];
          const { isProtected, routePattern } = isProtectedRoute(pathname, lng);

          if (isProtected && pathname && routePattern && lng) {
            setAuthenticated(false);
            setRole('none');

            router.push(`/${lng}/login`);
          }
        }
      } catch (error) {
        console.error('Auth validation failed:', error);
      }
    };

    validateAuth().then();
    return () => {
      isMounted = false;
    };
  }, [pathname, searchParams]);

  return (
    <AuthContext.Provider
      value={{
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
