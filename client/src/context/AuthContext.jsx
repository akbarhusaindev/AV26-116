import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api.js";

const AuthContext = createContext(null);

const STORAGE_USER = "smarttask_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_USER);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const persistAuth = useCallback((nextToken, nextUser) => {
    if (nextToken) localStorage.setItem("token", nextToken);
    else localStorage.removeItem("token");
    if (nextUser) localStorage.setItem(STORAGE_USER, JSON.stringify(nextUser));
    else localStorage.removeItem(STORAGE_USER);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    persistAuth(null, null);
  }, [persistAuth]);

  useEffect(() => {
    const init = async () => {
      const stored = localStorage.getItem("token");
      if (!stored) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get("/auth/profile");
        setUser(data.user);
        localStorage.setItem(STORAGE_USER, JSON.stringify(data.user));
      } catch {
        persistAuth(null, null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [persistAuth]);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    persistAuth(data.token, data.user);
    return data.user;
  }, [persistAuth]);

  const register = useCallback(async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    persistAuth(data.token, data.user);
    return data.user;
  }, [persistAuth]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
    }),
    [user, token, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
