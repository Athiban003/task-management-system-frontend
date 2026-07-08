import { createContext, useContext, useEffect, useState } from "react";
import { restoreTokens, setTokens, clearTokens } from "../services/authStore";

/**
 * AuthContext - Global authentication state
 * Provides: tokens, currentUser, login, logout
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [tokens, setTokensState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On app startup, restore tokens from localStorage
  useEffect(() => {
    const restored = restoreTokens();
    setTokensState(restored);
    setIsLoading(false);
  }, []);

  // Login: store tokens and update state
  const login = (newTokens) => {
    setTokens(newTokens);
    setTokensState(newTokens);
  };

  // Logout: clear tokens and update state
  const logout = () => {
    clearTokens();
    setTokensState(null);
  };

  const isAuthenticated = !!tokens?.accessToken;

  const value = {
    tokens,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 * Usage: const { isAuthenticated, tokens, logout } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
