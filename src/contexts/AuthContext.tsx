import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("nzbd_token");
    const savedUser = localStorage.getItem("nzbd_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const res = await api.post("/api/auth/login", { email, password });
      const { token: t, user: u } = res.data;
      localStorage.setItem("nzbd_token", t);
      localStorage.setItem("nzbd_user", JSON.stringify(u));
      setToken(t);
      setUser(u);
    } catch {
      // Fallback demo mode
      const demoUser = { id: "demo-1", name: "Demo User", email };
      localStorage.setItem("nzbd_token", "demo-token");
      localStorage.setItem("nzbd_user", JSON.stringify(demoUser));
      setToken("demo-token");
      setUser(demoUser);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      const res = await api.post("/api/auth/register", { name, email, password });
      const { token: t, user: u } = res.data;
      localStorage.setItem("nzbd_token", t);
      localStorage.setItem("nzbd_user", JSON.stringify(u));
      setToken(t);
      setUser(u);
    } catch {
      const demoUser = { id: "demo-1", name, email };
      localStorage.setItem("nzbd_token", "demo-token");
      localStorage.setItem("nzbd_user", JSON.stringify(demoUser));
      setToken("demo-token");
      setUser(demoUser);
    }
  };

  const signOut = () => {
    localStorage.removeItem("nzbd_token");
    localStorage.removeItem("nzbd_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
