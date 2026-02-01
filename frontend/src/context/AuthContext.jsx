import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [initializing, setInitializing] = useState(true);

  /**
   * 🔐 Bootstrap auth state on app load
   * This runs ONLY to restore an existing session
   */
  useEffect(() => {
    const loadUser = async () => {
      // No token → nothing to restore
      if (!token) {
        setInitializing(false);
        return;
      }

      try {
        const response = await authAPI.getProfile();
        setUser(response.data.data.user);
      } catch (error) {
        console.error('Failed to load user:', error);

        // ❗ Clean up invalid session WITHOUT side-effects
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      } finally {
        setInitializing(false);
      }
    };

    loadUser();
  }, [token]);

  /**
   * 📝 Register
   */
  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { token: newToken, user: newUser } = response.data.data;

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));

      setToken(newToken);
      setUser(newUser);

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  /**
   * 🔑 Login
   * ❗ DOES NOT touch auth state on failure
   */
  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token: newToken, user: newUser } = response.data.data;

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));

      setToken(newToken);
      setUser(newUser);

      return { success: true };
    } catch (error) {
      let errorMessage = 'Login failed';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password';
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * 🚪 Logout
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  /**
   * 👤 Update user locally
   */
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    loading: initializing,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!initializing && children}
    </AuthContext.Provider>
  );
};
