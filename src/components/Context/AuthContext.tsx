import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/axios';
import { API_ENDPOINTS } from '../../api/endpoints';
import WebSocketService from '../../services/websocket';
import type { Role, User } from '../../types/models';

const ROLE_REDIRECTS: Record<Role, string> = {
  superadmin: '/app',
  admin:      '/app',
  manager:    '/app',
  agent:      '/app',
  client:     '/app',  // DashboardRouter gérera l'affichage client
};

export const getRedirectPath = (role?: string | null): string =>
  (role && ROLE_REDIRECTS[role as Role]) || '/app';

/** Réponse d'authentification (le backend renvoie parfois les données sous `data`). */
interface AuthPayload {
  token: string;
  user: User;
}
interface AuthResponse extends Partial<AuthPayload> {
  data?: AuthPayload;
}
interface MeResponse {
  user?: User;
  data?: { user?: User };
}

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (formData: Record<string, unknown> | FormData) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  hasRole: (...roles: Role[]) => boolean;
  getRedirectPath: typeof getRedirectPath;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [user,    setUser]    = useState<User | null>(null);
  const [token,   setToken]   = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Chargement initial depuis localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser  = localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser) as User);
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await axios.post<AuthResponse>(API_ENDPOINTS.LOGIN, { email, password });
    const { token: newToken, user: newUser } = (response.data.data ?? response.data) as AuthPayload;

    localStorage.setItem('token', newToken);
    localStorage.setItem('user',  JSON.stringify(newUser));
    WebSocketService.reset(); // la prochaine connexion temps réel porte la nouvelle identité
    setToken(newToken);
    setUser(newUser);

    navigate(getRedirectPath(newUser.role), { replace: true });
    return newUser;
  }, [navigate]);

  const register = useCallback(async (formData: Record<string, unknown> | FormData) => {
    const response = await axios.post<AuthResponse>(API_ENDPOINTS.REGISTER, formData);
    const { token: newToken, user: newUser } = (response.data.data ?? response.data) as AuthPayload;

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
      const response    = await axios.get<MeResponse>(API_ENDPOINTS.ME);
      const updatedUser = response.data.data?.user ?? response.data.user ?? null;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch {
      logout();
    }
  }, [logout]);

  const isAuthenticated = !!token && !!user;

  const hasRole = useCallback(
    (...roles: Role[]) => !!user?.role && roles.includes(user.role),
    [user],
  );

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

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans un AuthProvider');
  return ctx;
};

export default AuthContext;
