import apiClient from "./client";
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

export default api;
