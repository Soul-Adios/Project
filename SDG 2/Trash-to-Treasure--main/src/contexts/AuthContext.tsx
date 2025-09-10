import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface User {
  id: number;
  username: string;
  email: string;
  totalPoints: number;
  totalWeight: number;
  dateJoined?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  authAxios: typeof axios;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const API_URL = "http://127.0.0.1:8000/api";
  const [user, setUser] = useState<User | null>(null);

  // ---------------- JWT TOKEN HANDLING ----------------
  const getAccessToken = () => localStorage.getItem("access");
  const getRefreshToken = () => localStorage.getItem("refresh");

  // Axios instance that always attaches JWT
  const authAxios = axios.create({ baseURL: API_URL });
  authAxios.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // Auto-refresh expired access tokens
  authAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refresh = getRefreshToken();
        if (refresh) {
          try {
            const res = await axios.post(`${API_URL}/token/refresh/`, { refresh });
            localStorage.setItem("access", res.data.access);
            authAxios.defaults.headers.Authorization = `Bearer ${res.data.access}`;
            originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
            return authAxios(originalRequest);
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            logout();
          }
        }
      }
      return Promise.reject(error);
    }
  );

  // ---------------- AUTH ACTIONS ----------------
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // 1. Get JWT tokens
      const res = await axios.post(`${API_URL}/token/`, { username, password });
      if (res.status === 200) {
        const { access, refresh } = res.data;
        localStorage.setItem("access", access);
        localStorage.setItem("refresh", refresh);

        // 2. Get user profile
        const profile = await authAxios.get("/me/");
        const loggedUser: User = {
          id: profile.data.id,
          username: profile.data.username,
          email: profile.data.email,
          totalPoints: profile.data.total_points || 0,
          totalWeight: profile.data.total_weight || 0,
          dateJoined: profile.data.date_joined,
        };

        setUser(loggedUser);
        localStorage.setItem("user", JSON.stringify(loggedUser));
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  };

  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await axios.post(`${API_URL}/signup/`, { username, email, password });
      if (res.status === 201) {
        // After signup, login to fetch tokens + profile
        return await login(username, password);
      }
      return false;
    } catch (err) {
      console.error("Signup failed:", err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  // Restore user from localStorage on reload
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser, authAxios }}>
      {children}
    </AuthContext.Provider>
  );
};
