import { tokenService } from "@/services/api";

/**
 * Interceptor de peticiones - Agrega tokens y headers necesarios
 */
export const requestInterceptor = (config) => {
  // Agregar token de autorización si existe
  const token = tokenService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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
