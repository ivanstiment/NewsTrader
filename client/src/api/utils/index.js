import { createRequestConfig, handleSilentError } from "./request.utils";

// Exportaciones nombradas
export { createRequestConfig, handleSilentError };

// Crear utilidades de respuesta si no existen
export const formatResponse = (response) => {
  return {
    data: response.data,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  };
};

export const extractErrorDetails = (error) => {
  return {
    message: error.message,
    status: error.response?.status,
    data: error.response?.data,
    config: {
      url: error.config?.url,
      method: error.config?.method,
    },
  };
};

export const isNetworkError = (error) => {
  return !error.response && error.request;
};

export const isTimeoutError = (error) => {
  return error.code === "ECONNABORTED";
};

// Exportación por defecto con todas las utilidades
export default {
  createRequestConfig,
  handleSilentError,
  formatResponse,
  extractErrorDetails,
  isNetworkError,
  isTimeoutError,
};
