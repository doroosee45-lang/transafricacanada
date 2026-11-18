import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/axios';
import { API_ENDPOINTS } from '../../api/endpoints';
import WebSocketService from '../../services/websocket';

const ROLE_REDIRECTS = {
  superadmin: '/app',
  admin:      '/app',
  manager:    '/app',
  agent:      '/app',
  client:     '/app',  // DashboardRouter gérera l'affichage client
};

export const getRedirectPath = (role) => ROLE_REDIRECTS[role] || '/app';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(null);
  const [loading, setLoading] = useState(true);

  // Chargement initial depuis localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser  = localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await axios.post(API_ENDPOINTS.LOGIN, { email, password });
    const { token: newToken, user: newUser } = response.data.data ?? response.data;

    localStorage.setItem('token', newToken);
    localStorage.setItem('user',  JSON.stringify(newUser));
    WebSocketService.reset(); // la prochaine connexion temps réel porte la nouvelle identité
    setToken(newToken);
    setUser(newUser);

    navigate(getRedirectPath(newUser.role), { replace: true });
    return newUser;
  }, [navigate]);

  const register = useCallback(async (formData) => {
    const response = await axios.post(API_ENDPOINTS.REGISTER, formData);
    const { token: newToken, user: newUser } = response.data.data ?? response.data;

    localStorage.setItem('token', newToken);
    localStorage.setItem('user',  JSON.stringify(newUser));
    WebSocketService.reset();
    setToken(newToken);
    setUser(newUser);

    navigate(getRedirectPath(newUser.role), { replace: true });
    return newUser;
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    WebSocketService.reset(); // aucune connexion ne reste abonnée avec l'ancienne session
    setToken(null);
    setUser(null);
    navigate('/login', { replace: true });
  }, [navigate]);

  const refreshUser = useCallback(async () => {
    try {
      const response    = await axios.get(API_ENDPOINTS.ME);
      const updatedUser = response.data.data?.user ?? response.data.user;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch {
      logout();
    }
  }, [logout]);

  const isAuthenticated = !!token && !!user;

  const hasRole = useCallback((...roles) => roles.includes(user?.role), [user]);

  return (
    <AuthContext.Provider value={{
      user, token, loading, isAuthenticated,
      login, register, logout, refreshUser,
      hasRole, getRedirectPath,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans un AuthProvider');
  return ctx;
};

export default AuthContext;