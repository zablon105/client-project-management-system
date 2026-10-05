import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cpmpts_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('access_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('access_token');
      if (storedToken) {
        try {
          const userData = await authApi.getMe();
          setUser(userData);
          localStorage.setItem('cpmpts_user', JSON.stringify(userData));
        } catch (err) {
          console.error("Failed to load authenticated user", err);
          logout();
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (username, password) => {
    const res = await authApi.login(username, password);
    const { access, refresh, user: userData } = res;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('cpmpts_user', JSON.stringify(userData));
    setToken(access);
    setUser(userData);
    return userData;
  };

  const register = async (userData) => {
    const registeredUser = await authApi.register(userData);
    if (!registeredUser.is_active) {
      return registeredUser;
    }
    return await login(userData.username, userData.password);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('cpmpts_user');
    setToken(null);
    setUser(null);
  };

  const roleTitleMap = {
    admin: 'Admin',
    staff: 'Staff',
    client: 'Client'
  };

  const activeRole = user ? roleTitleMap[user.role] || 'Admin' : 'Admin';

  const value = {
    user,
    token,
    activeRole,
    isAuthenticated: !!token,
    isLoading,
    login,
    register,
    logout,
    setUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
