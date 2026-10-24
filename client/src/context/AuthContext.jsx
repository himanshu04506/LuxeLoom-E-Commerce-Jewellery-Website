import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe, loginUser as loginApi, registerUser as registerApi } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('luxeloom_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await getMe();
        if (data.success) {
          setUser(data.user);
        } else {
          logout();
        }
      } catch (err) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (credentials) => {
    const data = await loginApi(credentials);
    if (data.success && data.token) {
      localStorage.setItem('luxeloom_token', data.token);
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const register = async (userData) => {
    const data = await registerApi(userData);
    if (data.success && data.token) {
      localStorage.setItem('luxeloom_token', data.token);
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('luxeloom_token');
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
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
