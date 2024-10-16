import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { validateAccessToken } from '@/service/auth';

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

  useEffect(() => {
    validateAccessToken().then((accessTokenPayload) => {
      if (accessTokenPayload) {
        setAuthenticated(true);
        setRole(accessTokenPayload.role);
      }
    });
  }, []);

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
