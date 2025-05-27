import { tokenService } from "@/services/api";
import { jwtDecode } from "jwt-decode";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para validar si el token está expirado
  const isTokenExpired = useCallback((token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      // Agregar buffer de 30 segundos para evitar que expire durante una petición
      return decoded.exp < currentTime + 30;
    } catch {
      return true;
    }
  }, []);

  // Función para decodificar y establecer usuario
  const setUserFromToken = useCallback((token) => {
    try {
      const decoded = jwtDecode(token);
      const userData = {
        username: decoded.username || decoded.user,
        userId: decoded.user_id || decoded.id,
        email: decoded.email,
        // Agregar más campos según el payload JWT
      };
      setUser(userData);
      return true;
    } catch (error) {
      console.error("Error decodificando el token:", error);
      return false;
    }
  }, []);

  // Al montar, verificar token existente
  useEffect(() => {
    const initializeAuth = async () => {
      const token = tokenService.getAccessToken();

      if (token && !isTokenExpired(token)) {
        if (setUserFromToken(token)) {
          setLoading(false);
          return;
        }
      }

      // Si no hay token válido, limpiar tokens, usuario y loading
      tokenService.clearAllTokens();
      setUser(null);
      setLoading(false);
    };

    initializeAuth();
  }, [isTokenExpired, setUserFromToken]);

  const login = useCallback(
    (accessToken, refreshToken) => {
      if (!accessToken) {
        console.error("El token de acceso es requerido para iniciar sesión");
        return false;
      }

      if (isTokenExpired(accessToken)) {
        console.error("No se puede iniciar sesión con un token expirado");
        return false;
      }

      tokenService.setAccessToken(accessToken);
      if (refreshToken) {
        tokenService.setRefreshToken(refreshToken);
      }

      const success = setUserFromToken(accessToken);
      if (success) {
        setLoading(false);
      }

      return success;
    },
    [isTokenExpired, setUserFromToken]
  );

  const logout = useCallback(() => {
    tokenService.clearAllTokens();
    setUser(null);
    setLoading(false);

    // Usar replace para evitar problemas de navegación
    window.location.replace("/home");
  }, []);

  // Función para verificar si el usuario está autenticado
  const isAuthenticated = useCallback(() => {
    const token = tokenService.getAccessToken();
    return token && !isTokenExpired(token) && user;
  }, [isTokenExpired, user]);

  // Función para obtener información del usuario actual
  const getCurrentUser = useCallback(() => {
    return user;
  }, [user]);

  // Memoizar el valor del contexto
  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      isAuthenticated,
      getCurrentUser,
    }),
    [user, loading, login, logout, isAuthenticated, getCurrentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}