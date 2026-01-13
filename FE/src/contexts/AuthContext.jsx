import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing session
    const savedUser = authService.getUser();
    if (savedUser && authService.isAuthenticated()) {
      // Transform role number to string for component compatibility
      const userData = {
        ...savedUser,
        role: savedUser.role === 1 ? 'admin' : savedUser.role === 2 ? 'student' : 'teacher',
      };
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const result = await authService.login(username, password);
    const userData = {
      ...result.user,
      role: result.user.role === 1 ? 'admin' : result.user.role === 2 ? 'student' : 'teacher',
      profile: result.profile,
    };
    setUser(userData);
    return userData;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
