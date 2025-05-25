import { getAccessToken } from "@/services/tokenService";
import { handleError } from "@/utils/errorHandler";
import { addCsrfHeader } from "../handlers/csrf.handler";

export const requestInterceptor = (config) => {
  // Agregar token JWT
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Agregar token CSRF
  config = addCsrfHeader(config);

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