import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  useEffect(() => {
    try {
      if (token) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Error handling token in localStorage:", error);
    }
  }, [token]);

  const login = (newToken) => {
    try {
      setToken(newToken);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = () => {
    try {
      setToken(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
