import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useMemo, useState } from "react";
import { authProviderPropTypes } from "@/propTypes/authProvider.propTypes";
import {
  getAccessToken as readToken,
  setRefreshToken as writeRefresh,
  setAccessToken as writeToken,
  removeAccessToken as removeToken
} from "@/services/tokenService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // on mount, check for existing token
  useEffect(() => {
    const token = readToken();
    if (token) {
      setUser({}); // Or decode user from token right away
    }
    setLoading(false);
  }, []);

  const login = (accessToken, refreshToken) => {
    writeToken(accessToken);
    writeRefresh(refreshToken);
    const decoded = jwtDecode(accessToken);
    setUser({ username: decoded.username, userId: decoded.user_id });
    setLoading(false);
  };

  const logout = () => {
    writeToken(null);
    writeRefresh(null);
    setUser(null);
    removeToken();
    window.location.href = "/login";
  };

  // memoize context value object to avoid re-creations on every render
  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = authProviderPropTypes;
