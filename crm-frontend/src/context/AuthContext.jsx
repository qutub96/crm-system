import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("crm_user");
    return stored ? JSON.parse(stored) : null;
  });

  async function login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    persistSession(data);
    return data;
  }

  async function register(fullName, email, password, role) {
    const { data } = await api.post("/auth/register", {
      fullName,
      email,
      password,
      role,
    });
    persistSession(data);
    return data;
  }

  function persistSession(data) {
    localStorage.setItem("crm_token", data.token);
    localStorage.setItem(
      "crm_user",
      JSON.stringify({
        email: data.email,
        fullName: data.fullName,
        role: data.role,
        expiresAt: data.expiresAt,
      })
    );
    setUser({
      email: data.email,
      fullName: data.fullName,
      role: data.role,
      expiresAt: data.expiresAt,
    });
  }

  function logout() {
    localStorage.removeItem("crm_token");
    localStorage.removeItem("crm_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
