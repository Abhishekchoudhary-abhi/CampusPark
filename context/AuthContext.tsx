import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { storageService, AppUser } from '../services/storageService';

interface AuthContextType {
  user: AppUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* ==================== RESTORE SESSION ==================== */
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  /* ==================== LOGIN ==================== */
  const login = async (email: string, password: string) => {
    try {
      const res = await storageService.login(email, password);

      setToken(res.token);
      setUser(res.user);

      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
    } catch (err) {
      throw err; // let UI handle error
    }
  };

  /* ==================== LOGOUT ==================== */
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ==================== HOOK ==================== */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
};
