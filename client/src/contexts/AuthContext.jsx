import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useMemo, useState } from "react";
import { authProviderPropTypes } from "@/propTypes/authProvider.propTypes";
import {
  getAccessToken as readToken,
  setRefreshToken as writeRefresh,
  setAccessToken as writeToken,
  clearAllTokens
} from "@/services/tokenService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para validar si el token está expirado
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch {
      return true;
    }
  };

  // Función para decodificar y establecer usuario
  const setUserFromToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      setUser({ 
        username: decoded.username || decoded.user, 
        userId: decoded.user_id || decoded.id 
      });
      return true;
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  };

  // Al montar, verificar token existente
  useEffect(() => {
    const token = readToken();
    
    if (token && !isTokenExpired(token)) {
      if (setUserFromToken(token)) {
        setLoading(false);
        return;
      }
    }
    
    // Si no hay token válido, limpiar tokens, usuario y loading
    clearAllTokens();
    setUser(null);
    setLoading(false);
  }, []);

  const login = (accessToken, refreshToken) => {
    if (!accessToken) {
      console.error('Access token is required for login');
      return false;
    }

    if (isTokenExpired(accessToken)) {
      console.error('Cannot login with expired token');
      return false;
    }

    writeToken(accessToken);
    if (refreshToken) {
      writeRefresh(refreshToken);
    }
    
    const success = setUserFromToken(accessToken);
    if (success) {
      setLoading(false);
    }
    
    return success;
  };

  const logout = () => {
    clearAllTokens();
    setUser(null);
    setLoading(false);
    
    // Usar replace para evitar problemas de navegación
    window.location.replace('/home');
  };

  // Función para verificar si el usuario está autenticado
  const isAuthenticated = () => {
    const token = readToken();
    return token && !isTokenExpired(token) && user;
  };

  // Memoizar el valor del contexto
  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      isAuthenticated,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = authProviderPropTypes;