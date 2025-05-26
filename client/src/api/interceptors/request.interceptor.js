import { tokenService } from "@/services/api";
import { csrfManager } from "@/utils/csrf.manager";
import { API_CONFIG } from "@/api/config";


/**
 * Interceptor de peticiones - Agrega tokens y headers necesarios
 */
export const requestInterceptor = (config) => {
  // Agregar token de autorización si existe
  const token = tokenService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // CSRF token (cross-site compatible):
  const csrfToken = csrfManager.get();
  if (csrfToken && ["post", "put", "patch", "delete"].includes(config.method)) {
    config.headers[API_CONFIG.csrf.headerName] = csrfToken;
  }

  // Log para debugging en desarrollo
  if (import.meta.env.MODE === "development") {
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      data: config.data,
    });
  }

  return config;
};

/**
 * Interceptor de errores de petición
 */
export const requestErrorInterceptor = (error) => {
  console.error("Error en la petición:", error);
  return Promise.reject(error);
};