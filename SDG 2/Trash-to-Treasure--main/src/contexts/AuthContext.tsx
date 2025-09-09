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
  signup: (
    username: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  authAxios: typeof axios; // 🔑 Authenticated Axios instance
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const API_URL = "http://127.0.0.1:8000/api";
  const [user, setUser] = useState<User | null>(null);
  const [authTokens, setAuthTokens] = useState<{
    access: string;
    refresh: string;
  } | null>(null);

  // 🔥 Login (Get JWT token + user data)
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const tokenRes = await axios.post(`${API_URL}/token/`, { username, password });
      const tokens = tokenRes.data;
      setAuthTokens(tokens);
      localStorage.setItem("authTokens", JSON.stringify(tokens));

      const userRes = await axios.post(`${API_URL}/login/`, { username, password });
      if (userRes.status === 200) {
        const loggedUser: User = {
          id: userRes.data.user_id,
          username: userRes.data.username,
          email: userRes.data.email,
          totalPoints: userRes.data.total_points || 0,
          totalWeight: userRes.data.total_weight || 0,
          dateJoined: userRes.data.date_joined,
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

  // 🔥 Signup
  const signup = async (
    username: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const res = await axios.post(`${API_URL}/signup/`, { username, email, password });
      if (res.status === 201) {
        return await login(username, password);
      }
      return false;
    } catch (err) {
      console.error("Signup failed:", err);
      return false;
    }
  };

  // 🔥 Logout
  const logout = () => {
    setUser(null);
    setAuthTokens(null);
    localStorage.removeItem("user");
    localStorage.removeItem("authTokens");
  };

  // 🔥 Update User
  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const hasChanges = Object.entries(updates).some(
      ([key, value]) => (user as any)[key] !== value
    );
    if (!hasChanges) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  // 🔥 Restore from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedTokens = localStorage.getItem("authTokens");
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedTokens) setAuthTokens(JSON.parse(storedTokens));
  }, []);

  // 🔥 Axios instance with Authorization
  const authAxios = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: authTokens?.access ? `Bearer ${authTokens.access}` : "",
    },
  });

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, updateUser, authAxios }}
    >
      {children}
    </AuthContext.Provider>
  );
};
