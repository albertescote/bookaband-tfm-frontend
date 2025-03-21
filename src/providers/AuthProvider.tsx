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

interface AuthContextType {
  changeMe: { changeMe: boolean; setChangeMe: (changeMe: boolean) => void };
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
  const [changeMe, setChangeMe] = useState<boolean>(false);

  useEffect(() => {
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
      }
    });
  }, [changeMe]);

  return (
    <AuthContext.Provider
      value={{
        changeMe: { changeMe, setChangeMe },
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
