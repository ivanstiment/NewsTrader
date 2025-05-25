import { tokenService } from "@/services/api";
import { getCookie } from "@/utils/csrf.utils";
import { API_CONFIG } from "@/api/config";

const METHODS_REQUIRING_CSRF = ["post", "put", "patch", "delete"];

/**
 * Interceptor de peticiones - Agrega tokens y headers necesarios
 */
export const requestInterceptor = (config) => {
  // Agregar token de autorización si existe
  const token = tokenService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  
  if (METHODS_REQUIRING_CSRF.includes(config.method.toLowerCase())) {
    const csrfToken = getCookie();
    if (csrfToken) {
      config.headers[API_CONFIG.csrf.headerName] = csrfToken;
    }
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