// client/src/api/index.js
import { setupCsrfInterceptors } from "@/api/interceptors/csrf.interceptor";
import apiClient from "./client";
import apiUtils from "./utils";
import { createRequestConfig, handleSilentError } from "./utils/request.utils";

/**
 * Wrapper para peticiones con manejo específico de errores
 */
export const api = {
  get: (url, options = {}) => {
    const { axiosConfig, meta } = createRequestConfig(options);
    return apiClient
      .get(url, axiosConfig)
      .catch((error) => handleSilentError(error, meta));
  },

  post: (url, data, options = {}) => {
    const { axiosConfig, meta } = createRequestConfig(options);
    return apiClient
      .post(url, data, axiosConfig)
      .catch((error) => handleSilentError(error, meta));
  },

  put: (url, data, options = {}) => {
    const { axiosConfig, meta } = createRequestConfig(options);
    return apiClient
      .put(url, data, axiosConfig)
      .catch((error) => handleSilentError(error, meta));
  },

  delete: (url, options = {}) => {
    const { axiosConfig, meta } = createRequestConfig(options);
    return apiClient
      .delete(url, axiosConfig)
      .catch((error) => handleSilentError(error, meta));
  },
};

// Exportar también el cliente base para casos especiales
export { default as apiClient } from "./client";

// Exportar configuraciones para uso externo
export { ENDPOINTS } from "./config/endpoints";
export { tokenRefreshManager } from "./handlers/token.handler";

// Exportar utilidades
export { apiUtils };

// Configuración de interceptores CSRF
setupCsrfInterceptors(apiClient);

// Inyectar el cliente API en el servicio CSRF después de la configuración
// Esto evita dependencias circulares
const initializeCsrfService = async () => {
  try {
    const { csrfService } = await import("@/services/api/csrf.service");
    csrfService.setApiClient(apiClient);
    console.log("CSRF Service inicializado correctamente");
  } catch (error) {
    console.error("Error inicializando CSRF Service:", error);
  }
};

// Inicializar de forma asíncrona
initializeCsrfService();

export default api;
