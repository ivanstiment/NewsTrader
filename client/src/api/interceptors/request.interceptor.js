import { getAccessToken } from "@/services/tokenService";
import { csrfService } from "@/services/api";
import { handleError } from "@/utils/errorHandler";
import { API_CONFIG } from "@/api/config";

const METHODS_REQUIRING_CSRF = ["post", "put", "patch", "delete"];

export const requestInterceptor = (config) => {
  // Agregar token JWT
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Agregar token CSRF para métodos que lo requieren
  if (METHODS_REQUIRING_CSRF.includes(config.method.toLowerCase())) {
    const csrfToken = csrfService.getToken();
    if (csrfToken) {
      config.headers[API_CONFIG.csrf.headerName] = csrfToken;
    }
  }

  return config;
};

export const requestErrorInterceptor = (error) => {
  console.error("Request interceptor error:", error);

  handleError(error, {
    context: { phase: "request_setup" },
    customMessage: "Error al configurar la petición",
  });

  return Promise.reject(error);
};