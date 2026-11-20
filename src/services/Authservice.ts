import api from "./axios";
import type { Payload } from "../types/api";
import type { User } from "../types/models";

interface LoginResponse {
  token?: string;
  user?: User;
}

const authService = {

  // POST /api/auth/register
  register: (data: Payload) =>
    api.post("/auth/register", data),

  // POST /api/auth/login
  login: async (email: string, password: string) => {
    const res = await api.post<LoginResponse>("/auth/login", { email, password });
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user",  JSON.stringify(res.data.user));
    }
    return res;
  },

  // GET /api/auth/me
  getMe: () =>
    api.get("/auth/me"),

  // PUT /api/auth/update-profile
  updateProfile: (data: Payload) => {
    const isFormData = data instanceof FormData;
    return api.put("/auth/update-profile", data, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
  },

  // PUT /api/auth/change-password
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put("/auth/change-password", { currentPassword, newPassword }),

  // POST /api/auth/forgot-password
  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),

  // PUT /api/auth/reset-password/:token
  resetPassword: (token: string, password: string) =>
    api.put(`/auth/reset-password/${token}`, { password }),

  // Déconnexion locale
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },

  // Récupérer l'user depuis localStorage
  getCurrentUser: (): User | null => {
    const user = localStorage.getItem("user");
    return user ? (JSON.parse(user) as User) : null;
  },

  // Vérifier si connecté
  isAuthenticated: () => !!localStorage.getItem("token"),
};

export default authService;
