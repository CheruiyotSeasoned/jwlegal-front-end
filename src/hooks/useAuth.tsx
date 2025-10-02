import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import axios from 'axios';

export type UserRole = 'admin' | 'lawyer' | 'client' | 'judicial' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: string;
  avatar_url: string | null;
  phone: string;
  address: string;
  date_of_birth: string;
  national_id: string;
  lsk_number: string;
  specialization: string;
  years_of_experience: number;
  profile_completed: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  token: string | null;
  hasRole: (roles: UserRole[]) => boolean;
  setUser: (user: User | null) => void;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  // ✅ Fetch user from token
  const fetchUser = async (token: string) => {
    try {
      const userResponse = await axios.get<User>(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = userResponse.data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      console.error('Failed to verify token, logging out.', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // ✅ Login
  const login = async (email: string, password: string): Promise<void> => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const loginResponse = await axios.post<LoginResponse>(
        `${API_BASE_URL}/auth/login`,
        formData,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      const accessToken = loginResponse.data.access_token;
      localStorage.setItem('token', accessToken);
      setToken(accessToken);

      await fetchUser(accessToken);
    } catch (error: any) {
      const backendMessage = error?.response?.data?.detail;
      if (backendMessage === 'Account is not active') {
        throw new Error(
          'Your account is not active. Please check your email to confirm and activate it.'
        );
      }
      console.error('Login failed:', error);
      throw new Error('Login failed. Please try again.');
    }
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  // ✅ Role checker
  const hasRole = (roles: UserRole[]) => {
    return user ? roles.includes(user.role) : false;
  };

  // ✅ Verify token on reload
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      fetchUser(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, token, hasRole, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
