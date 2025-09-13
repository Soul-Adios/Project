import { API_BASE_URL } from "@/config";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios, { AxiosInstance } from "axios";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  username: string;
  email: string;
  totalPoints?: number;
  totalWeight?: number;
  progress?: number;
  dateJoined?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  authAxios: AxiosInstance;
  loading: boolean;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Axios instance with baseURL from config.ts
  const authAxios = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access") || ""}`,
    },
  });

  // ✅ Attach JWT token automatically
  authAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // ✅ Logout on unauthorized
  authAxios.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) logout();
      return Promise.reject(err);
    }
  );

  // ✅ Normalize backend response
  const normalizeUser = (data: any): User => ({
    id: data.id,
    username: data.username,
    email: data.email,
    totalPoints: data.total_points || 0,
    totalWeight: data.total_weight || 0,
    dateJoined: data.date_joined,
  });

  const fetchUser = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await authAxios.get("/me/");
      setUser(normalizeUser(res.data));
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // ✅ Use API_BASE_URL instead of localhost
  const login = async (username: string, password: string) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/token/`, { username, password });
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      await fetchUser();
      return true;
    } catch {
      return false;
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      await axios.post(`${API_BASE_URL}/signup/`, { username, email, password });
      return await login(username, password);
    } catch {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
    navigate("/login");
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, authAxios, loading, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
