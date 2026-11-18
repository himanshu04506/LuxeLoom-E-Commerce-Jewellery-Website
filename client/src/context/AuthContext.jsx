import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe, loginUser as loginApi, registerUser as registerApi } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('luxeloom_token') || null);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('luxeloom_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const data = await getMe();
        if (data && data.success && data.user) {
          setUser(data.user);
          localStorage.setItem('luxeloom_user', JSON.stringify(data.user));
        } else if (!user) {
          // Only clear if we don't already have a valid local user
          logout();
        }
      } catch (err) {
        // If network error, preserve the stored session in offline/cached mode
        console.warn('[AuthContext] getMe network notice, using local session');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (credentials) => {
    const data = await loginApi(credentials);
    if (data.success && data.token && data.user) {
      localStorage.setItem('luxeloom_token', data.token);
      localStorage.setItem('luxeloom_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const register = async (userData) => {
    const data = await registerApi(userData);
    if (data.success && data.token && data.user) {
      localStorage.setItem('luxeloom_token', data.token);
      localStorage.setItem('luxeloom_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const updateUser = (updatedUser) => {
    if (updatedUser) {
      const merged = { ...user, ...updatedUser };
      setUser(merged);
      localStorage.setItem('luxeloom_user', JSON.stringify(merged));
    }
  };

  const logout = () => {
    localStorage.removeItem('luxeloom_token');
    localStorage.removeItem('luxeloom_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        login,
        register,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
