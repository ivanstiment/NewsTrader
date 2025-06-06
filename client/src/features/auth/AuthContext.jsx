/**
 * @fileoverview Proveedor de contexto de autenticación para la aplicación NewsTrader.
 * Gestiona el estado de autenticación del usuario, incluyendo inicio y cierre de sesión,
 * y proporciona funciones auxiliares para verificar el estado de autenticación.
 */

import { tokenService } from "@/services";
import { jwtDecode } from "jwt-decode";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

/**
 * Contexto de autenticación que proporciona información y funciones relacionadas con la autenticación del usuario.
 * @type {React.Context<AuthContextType>}
 */
export const AuthContext = createContext();

/**
 * Proveedor de autenticación que envuelve la aplicación y proporciona el contexto de autenticación.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - Componentes hijos que tendrán acceso al contexto de autenticación.
 * @returns {JSX.Element} Componente proveedor de autenticación.
 */
export function AuthProvider({ children }) {
  /**
   * Estado del usuario autenticado.
   * Inicializar estado desde tokens existentes.
   * @type {User|null}
   */
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

  /**
   * Estado de carga que indica si se está verificando la autenticación.
   * Loading debe ser false si ya el usuario es válido
   * @type {boolean}
   */
  const [loading, setLoading] = useState(() => {
    const token = tokenService.getAccessToken();
    return !(token && !isTokenExpired(token));
  });

  /**
   * Verifica si un token JWT ha expirado.
   *
   * @param {string} token - Token JWT a verificar.
   * @returns {boolean} `true` si el token ha expirado, `false` en caso contrario.
   */
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

  /**
   * Decodifica un token JWT y establece el estado del usuario.
   *
   * @param {string} token - Token JWT a decodificar.
   * @returns {boolean} `true` si se estableció el usuario correctamente, `false` en caso contrario.
   */
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

  // useEffect para verificación inicial
  useEffect(() => {
    const initializeAuth = async () => {
      // Si ya hay usuario, no re-inicializar
      if (user) {
        setLoading(false);
        return;
      }

      const accessToken = tokenService.getAccessToken();
      const refreshToken = tokenService.getRefreshToken();

      // Si hay token de acceso válido, usarlo
      if (accessToken && !isTokenExpired(accessToken)) {
        if (setUserFromToken(accessToken)) {
          setLoading(false);
          return;
        }
      }

      // Si el access token expiró pero hay refresh token, intentar renovar
      if (refreshToken && (!accessToken || isTokenExpired(accessToken))) {
        try {
          // Importar dinámicamente para evitar dependencias circulares
          const { tokenRefreshManager } = await import("@/services");
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

      // Aquí, no hay sesión válida
      tokenService.clearAllTokens();
      setUser(null);
      setLoading(false);
    };

    initializeAuth();
  }, []); // Dependencias vacías para ejecutar solo al montar

  /**
   * Inicia sesión estableciendo los tokens y el estado del usuario.
   *
   * @param {string} accessToken - Token de acceso.
   * @param {string} [refreshToken] - Token de actualización (opcional).
   * @returns {boolean} `true` si el inicio de sesión fue exitoso, `false` en caso contrario.
   */
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

  /**
   * Cierra la sesión del usuario, limpiando los tokens y el estado del usuario.
   */
  const logout = useCallback(() => {
    tokenService.clearAllTokens();
    setUser(null);
    setLoading(false);

    // Usar replace para evitar problemas de navegación
    window.location.replace("/home");
  }, []);

  /**
   * Verifica si el usuario está autenticado.
   *
   * @returns {boolean} `true` si el usuario está autenticado, `false` en caso contrario.
   */
  const isAuthenticated = useCallback(() => {
    const token = tokenService.getAccessToken();
    return !!(token && !isTokenExpired(token) && user);
  }, [user]);

  /**
   * Obtiene la información del usuario actual.
   *
   * @returns {User|null} Objeto de usuario o `null` si no hay usuario autenticado.
   */
  const getCurrentUser = useCallback(() => {
    return user;
  }, [user]);

  /**
   * Valor del contexto de autenticación que se proporciona a los componentes hijos.
   * @type {AuthContextType}
   */
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

/**
 * Tipo de usuario autenticado.
 * @typedef {Object} User
 * @property {string} username - Nombre de usuario.
 * @property {string} userId - Identificador único del usuario.
 * @property {string} email - Correo electrónico del usuario.
 */

/**
 * Tipo del contexto de autenticación.
 * @typedef {Object} AuthContextType
 * @property {User|null} user - Usuario autenticado o `null` si no hay sesión.
 * @property {boolean} loading - Indica si se está verificando la autenticación.
 * @property {function(string, string=): boolean} login - Función para iniciar sesión.
 * @property {function(): void} logout - Función para cerrar sesión.
 * @property {function(): boolean} isAuthenticated - Verifica si el usuario está autenticado.
 * @property {function(): User|null} getCurrentUser - Obtiene el usuario actual.
 */
