import { API_CONFIG } from "@/api/config";
import { csrfManager, csrfService, tokenService } from "@/services";

/**
 * Lista de métodos que requieren token CSRF
 */
const METHODS_REQUIRING_CSRF = ["post", "put", "patch", "delete"];

/**
 * Interceptor de peticiones - Agrega tokens y headers necesarios
 */
export const requestInterceptor = async (config) => {
  // Configuraciones especiales para evitar bucles infinitos
  const skipCsrf = config.skipCsrfCheck;
  const skipAuth = config.skipAuthCheck;

  // Agregar token de autorización si existe y no se debe saltar
  if (!skipAuth) {
    const token = tokenService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  // Manejar CSRF token para métodos que lo requieren
  const method = config.method?.toLowerCase();
  if (!skipCsrf && METHODS_REQUIRING_CSRF.includes(method)) {
    let csrfToken = csrfManager.get();

    // Si no tenemos token CSRF, intentar obtenerlo
    if (!csrfToken) {
      try {
        if (import.meta.env.MODE === "development") {
          console.log("🔄 Token CSRF no encontrado, obteniendo nuevo token...");
        }
        csrfToken = await csrfService.fetchCsrfToken();
        csrfManager.set(csrfToken);
        if (import.meta.env.MODE === "development") {
          console.log("✅ Token CSRF obtenido");
        }
      } catch (error) {
        console.error("❌ Error obteniendo token CSRF:", error);
        // No bloqueamos la petición, el servidor manejará el error
      }
    }

    // Agregar token CSRF al header si lo tenemos
    if (csrfToken) {
      config.headers[API_CONFIG.csrf.headerName] = csrfToken;
    }
  }

  // Log para debugging en desarrollo
  if (import.meta.env.MODE === "development") {
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
      headers: {
        Authorization: config.headers.Authorization
          ? "***Bearer token***"
          : undefined,
        [API_CONFIG.csrf.headerName]: config.headers[API_CONFIG.csrf.headerName]
          ? "***CSRF token***"
          : undefined,
      },
      skipCsrf,
      skipAuth,
      hasCsrf: !!config.headers[API_CONFIG.csrf.headerName],
      hasAuth: !!config.headers.Authorization,
    });
  }

  return config;
};

/**
 * Interceptor de errores de petición
 */
export const requestErrorInterceptor = (error) => {
  console.error("❌ Error en la petición:", error);
  return Promise.reject(error);
};
