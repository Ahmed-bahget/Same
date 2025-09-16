
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authService, User, RegisterRequest } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check if user is already logged in on load
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      if (authService.isAuthenticated()) {
        try {
          const response = await authService.getCurrentUser();
          if (response.success && response.data) {
            setUser(response.data);
            setIsAuthenticated(true);
          } else {
            // Token is invalid, clear it
            authService.removeToken();
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch (err) {
          // Token is invalid, clear it
          authService.removeToken();
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (emailOrUsername: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('AuthContext: Starting login process');
      const response = await authService.login({ EmailOrUsername: emailOrUsername, Password: password });
      console.log('AuthContext: Login response:', response);
      
      if (response.success && response.data) {
        console.log('AuthContext: Login successful, setting token and user');
        console.log('AuthContext: Full response data:', JSON.stringify(response.data, null, 2));
        authService.setToken(response.data.Token);
        setUser(response.data.User);
        setIsAuthenticated(true);
        console.log('AuthContext: User authenticated:', response.data.User);
      } else {
        console.error('AuthContext: Login failed:', response.message);
        throw new Error(response.message || 'Login failed');
      }
    } catch (err: any) {
      console.error('AuthContext: Login error:', err);
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.register(userData);
      
      if (response.success && response.data) {
        authService.setToken(response.data.Token);
        setUser(response.data.User);
        setIsAuthenticated(true);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      // Even if logout fails on server, clear local state
      console.error('Logout error:', err);
    } finally {
      authService.removeToken();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const refreshUser = async () => {
    if (!authService.isAuthenticated()) return;
    
    try {
      const response = await authService.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (err) {
      console.error('Failed to refresh user data:', err);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      register,
      logout,
      error,
      loading,
      refreshUser
    }}>
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

