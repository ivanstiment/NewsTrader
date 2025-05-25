import { tokenService } from "@/services/api";
import { getCookie } from "@/utils/csrf.utils";
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

  console.log("configuración en el requestInterceptor")
  console.log(config)
  const csrfToken = getCookie(API_CONFIG.csrf.cookieName);
  console.log("comprobaciones requestInterceptor")
  console.log('["post", "put", "patch", "delete"].includes(config.method)')
  console.log(["post", "put", "patch", "delete"].includes(config.method))
  console.log('config.method')
  console.log(config.method)
  console.log('csrfToken')
  console.log(csrfToken)
  if (csrfToken && ["post", "put", "patch", "delete"].includes(config.method)) {
    config.headers[API_CONFIG.csrf.headerName] = csrfToken;
    console.log("API_CONFIG.csrf.headerName")
    console.log(API_CONFIG.csrf.headerName)
    console.log("Aquí ya debería estar metido en")
    console.log(config)
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