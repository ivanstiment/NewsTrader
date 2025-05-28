// client/src/api/interceptors/response.interceptor.js
import { tokenRefreshManager } from "@/services/api/token/token.handler";
import { tokenService } from "@/services/api/token/token.service";

/**
 * Interceptor de respuestas exitosas
 */
export const responseInterceptor = (response) => {
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

  if (import.meta.env.MODE === "development") {
    console.error(
      `❌ ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`,
      {
        status: error.response?.status,
        data: error.response?.data,
      }
    );
  }

  // Solo manejar errores 401 para refresh de token
  if (error.response?.status === 401 && 
      !originalRequest._retry && 
      !originalRequest.skipRetryOn401) {
    
    // Ignorar errores 401 en endpoints de autenticación
    const authEndpoints = ["/token/", "/login/", "/register/"];
    const isAuthEndpoint = authEndpoints.some(endpoint => 
      originalRequest?.url?.includes(endpoint)
    );

    if (isAuthEndpoint) {
      return Promise.reject(error);
    }

    // Verificar si tenemos refresh token
    if (!tokenService.getRefreshToken()) {
      tokenRefreshManager.handleRefreshFailure();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newAccessToken = await tokenRefreshManager.refreshToken();
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      
      // Usar la instancia de axios del config original
      const axiosInstance = originalRequest.__axiosInstance;
      if (axiosInstance) {
        return axiosInstance(originalRequest);
      }
      
      // Como último recurso, usar adapter
      if (originalRequest.adapter) {
        return originalRequest.adapter(originalRequest);
      }
      
      console.error("No se puede reintentar la petición: ni instancia ni adapter disponible");
      return Promise.reject(error);
      
    } catch (refreshError) {
      console.error("Failed to refresh token:", refreshError);
      return Promise.reject(error);
    }
  }

  return Promise.reject(error);
};