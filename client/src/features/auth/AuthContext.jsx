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
  // CAMBIO CRÍTICO: Inicializar estado desde tokens existentes
  const [user, setUser] = useState(() => {
    const token = tokenService.getAccessToken();
    if (token && !isTokenExpired(token)) {
      try {
        const decoded = jwtDecode(token);
        return {
          username: decoded.username || decoded.user,
          userId: decoded.user_id || decoded.id,
          email: decoded.email,
        };
      } catch {
        return null;
      }
    }
    return null;
  });
  
  // CAMBIO: loading debe ser false si ya tenemos usuario válido
  const [loading, setLoading] = useState(() => {
    const token = tokenService.getAccessToken();
    return !(token && !isTokenExpired(token));
  });

  // Función para validar si el token está expirado
  function isTokenExpired(token) {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      // Agregar buffer de 30 segundos para evitar que expire durante una petición
      return decoded.exp < currentTime + 30;
    } catch {
      return true;
    }
  }

  // Función para decodificar y establecer usuario
  const setUserFromToken = useCallback((token) => {
    try {
      const decoded = jwtDecode(token);
      const userData = {
        username: decoded.username || decoded.user,
        userId: decoded.user_id || decoded.id,
        email: decoded.email,
      };
      setUser(userData);
      return true;
    } catch (error) {
      console.error("Error decodificando el token:", error);
      return false;
    }
  }, []);

  // CAMBIO: useEffect más robusto para verificación inicial
  useEffect(() => {
    const initializeAuth = async () => {
      // Si ya tenemos usuario, no necesitamos re-inicializar
      if (user) {
        setLoading(false);
        return;
      }

      const accessToken = tokenService.getAccessToken();
      const refreshToken = tokenService.getRefreshToken();

      // Si tenemos token de acceso válido, usarlo
      if (accessToken && !isTokenExpired(accessToken)) {
        if (setUserFromToken(accessToken)) {
          setLoading(false);
          return;
        }
      }

      // Si el access token expiró pero tenemos refresh token, intentar renovar
      if (refreshToken && (!accessToken || isTokenExpired(accessToken))) {
        try {
          // Importar dinámicamente para evitar dependencias circulares
          const { tokenRefreshManager } = await import("@/services/api/token/token.handler");
          const newAccessToken = await tokenRefreshManager.refreshToken();
          if (newAccessToken) {
            setUserFromToken(newAccessToken);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error("Error renovando token:", error);
        }
      }

      // Si llegamos aquí, no hay sesión válida
      tokenService.clearAllTokens();
      setUser(null);
      setLoading(false);
    };

    initializeAuth();
  }, []); // Dependencias vacías para ejecutar solo al montar

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
    [setUserFromToken]
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
    return !!(token && !isTokenExpired(token) && user);
  }, [user]);

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