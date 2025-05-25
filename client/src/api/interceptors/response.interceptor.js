import { tokenService } from "@/services/api";
import { handleAuthError } from "../handlers/auth.handler";
import { tokenRefreshManager } from "../handlers/token.handler";

/**
 * Interceptor de respuestas exitosas
 */
export const responseInterceptor = (response) => {
  // Log para debugging en desarrollo
  if (import.meta.env.MODE === "development") {
    console.log(
      `✅ ${response.config.method?.toUpperCase()} ${response.config.url}`,
      {
        status: response.status,
        data: response.data,
      }
    );
  }

  return response;
};

/**
 * Interceptor de errores de respuesta
 */
export const responseErrorInterceptor = async (error) => {
  const originalRequest = error.config;

  // Log para debugging en desarrollo
  if (import.meta.env.MODE === "development") {
    console.error(
      `❌ ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`,
      {
        status: error.response?.status,
        data: error.response?.data,
      }
    );
  }

  // NO intentar refresh en estas situaciones:
  // 1. Errores de login/register (endpoints de autenticación)
  // 2. Errores que no son 401
  // 3. Si ya se intentó el refresh
  const isAuthEndpoint =
    originalRequest?.url?.includes("/token/") ||
    originalRequest?.url?.includes("/login/") ||
    originalRequest?.url?.includes("/register/");

  const shouldSkipRefresh =
    isAuthEndpoint || error.response?.status !== 401 || originalRequest._retry;

  if (shouldSkipRefresh) {
    // Para errores de autenticación en endpoints que NO son de login
    if (error.response?.status === 401 && !isAuthEndpoint) {
      return handleAuthError(error);
    }

    // Para cualquier otro error, rechazar directamente
    return Promise.reject(error);
  }

  // Solo intentar refresh para 401 en endpoints protegidos
  if (error.response?.status === 401 && !isAuthEndpoint) {
    // Verificar si tenemos token de acceso
    const currentToken = tokenService.getAccessToken();
    if (!currentToken) {
      // No hay token, redirigir a login
      tokenService.clearAllTokens();
      return handleAuthError(error);
    }

    // Marcar que ya se intentó el refresh
    originalRequest._retry = true;

    try {
      // Intentar refrescar el token
      const newToken = await tokenRefreshManager.refreshToken();

      if (newToken) {
        // Actualizar el header de autorización
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Reinttentar la petición original
        return error.config.adapter(originalRequest);
      }
    } catch (refreshError) {
      console.error("Error al refrescar token:", refreshError);
      // El tokenRefreshManager ya maneja la limpieza y redirección
      return Promise.reject(refreshError);
    }
  }

  return Promise.reject(error);
};
