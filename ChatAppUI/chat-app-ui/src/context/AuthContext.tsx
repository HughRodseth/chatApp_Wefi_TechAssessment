import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import { api } from "../api/client";

export interface AuthUser {
  userId: number;
  userName: string;
  displayName?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (userName: string, password: string) => Promise<void>;
  register: (
    userName: string,
    password: string,
    displayName?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = api.getCurrentUserFromStorage();
    setUser(stored);
    setLoading(false);
  }, []);

  const login = async (userName: string, password: string) => {
    setLoading(true);
    try {
      const current = await api.login(userName, password);
      setUser(current);
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    userName: string,
    password: string,
    displayName?: string
  ) => {
    setLoading(true);
    try {
      const current = await api.registerUser(userName, password, displayName);
      setUser(current);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
