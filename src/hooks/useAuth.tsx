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
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
  setUser: (user: User | null) => void;
}
interface LoginResponse {
  access_token: string;
  token_type: string; // optional
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ Get from .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // ✅ Login and fetch user from /me
  const login = async (email: string, password: string): Promise<void> => {
    try {
      console.log('🔗 Sending login request...', email, password);
  
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);
      formData.append('grant_type', '');
      formData.append('scope', '');
      formData.append('client_id', '');
      formData.append('client_secret', '');
  
      const loginResponse = await axios.post<LoginResponse>(
        `${API_BASE_URL}/auth/login`,
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
  
      const accessToken = loginResponse.data.access_token;
      localStorage.setItem('token', accessToken);
  
      // Fetch user info
      const userResponse = await axios.get<User>(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      const userData = userResponse.data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error: any) {
      const backendMessage = error?.response?.data?.detail;
  
      if (backendMessage === 'Account is not active') {
        throw new Error('Your account is not active. Please check your email to confirm and activate it.');
      }
  
      console.error('Login failed:', error);
      throw new Error('Login failed. Please try again.');
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const hasRole = (roles: UserRole[]) => {
    return user ? roles.includes(user.role) : false;
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole, setUser }}>
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
