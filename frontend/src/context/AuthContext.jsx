import { createContext, useContext, useState, useCallback } from "react";
import { getAuthToken, getAuthUser, logoutUser } from "../api/authApi.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Restore session from localStorage on first render
  const [user, setUser] = useState(() => getAuthUser());
  const [token, setToken] = useState(() => getAuthToken());

  const isLoggedIn = !!token && !!user;

  /**
   * Called after a successful login or register response.
   * authApi.js already stored the token+user in localStorage,
   * so here we just sync React state to match.
   */
  const login = useCallback((data) => {
    setToken(data.token);
    setUser(data.user);
  }, []);

  /**
   * Clears localStorage and resets React state.
   * Navigation after logout is handled by the caller (Navbar).
   */
  const logout = useCallback(() => {
    logoutUser(); // clears localStorage
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthContext;
