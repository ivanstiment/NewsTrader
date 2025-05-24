import { getAccessToken } from "@/services/tokenService";
import { getCsrfToken } from "@/utils/csrf";
import { handleError } from "@/utils/errorHandler";

const METHODS_REQUIRING_CSRF = ["post", "put", "patch", "delete"];

export const requestInterceptor = (config) => {
  // Agregar token JWT
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Agregar token CSRF para métodos que lo requieren
  if (METHODS_REQUIRING_CSRF.includes(config.method.toLowerCase())) {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
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
