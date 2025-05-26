import { API_CONFIG } from "@/api/config";
import { tokenService } from "@/services/api";
import axios from "axios";
import toast from "react-hot-toast";
import { handleError } from "./handlers/error.handler";
import { getCsrfToken } from '@/services/api/csrf/csrf.util';

// Configurar valores por defecto para CSRF
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

// Determina URLs base
const isDevelopment = import.meta.env.MODE === "development";
const baseUrl = isDevelopment
  ? import.meta.env.VITE_API_BASE_URL_LOCAL || "http://localhost:8000/api"
  : import.meta.env.VITE_API_BASE_URL_PROD || "";

const refreshUrl = isDevelopment
  ? (import.meta.env.VITE_API_BASE_URL_LOCAL || "http://localhost:8000/api") +
    "/token/refresh/"
  : "/token/refresh/";

console.log("API Configuration:", { isDevelopment, baseUrl, refreshUrl });

// Crear instancia de axios
const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  timeout: 10000, // 10 segundos timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Variables para manejar refresh de tokens
let isRefreshing = false;
let refreshSubscribers = [];

// Función para añadir subscribers
function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

// Al tener nuevo token, ejecutar subscribers
function onRefreshed(newToken) {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
}

// Interceptor de request
api.interceptors.request.use(
  (config) => {
    // Agregar token JWT
    const token = tokenService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Agregar token CSRF a todas las solicitudes POST, PUT, PATCH y DELETE
    if (
      ["post", "put", "patch", "delete"].includes(config.method.toLowerCase())
    ) {
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        config.headers[API_CONFIG.csrf.headerName] = csrfToken;
      }
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);

    // Manejar errores de configuración de request
    handleError(error, {
      context: { phase: "request_setup" },
      customMessage: "Error al configurar la petición",
    });

    return Promise.reject(error);
  }
);

// Interceptor de response
api.interceptors.response.use(
  (response) => {
    // Manejar respuestas exitosas pero con warnings
    if (response.data?.warning) {
      toast(response.data.warning, {
        icon: "⚠️",
        duration: 4000,
      });
    }

    return response;
  },
  async (error) => {
    const { config, response } = error;

    // Contexto para logging
    const errorContext = {
      url: config?.url,
      method: config?.method?.toUpperCase(),
      phase: "response",
    };

    // Si es error 401 y no es una petición de retry
    if (response?.status === 401 && !config._retry) {
      config._retry = true;

      // Si ya estamos refrescando, añadir a la cola
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((newToken) => {
            if (newToken) {
              config.headers.Authorization = `Bearer ${newToken}`;
              resolve(axios.request(config));
            } else {
              reject(error);
            }
          });
        });
      }

      // Intentar refrescar token
      isRefreshing = true;

      try {
        const refreshToken = tokenService.getRefreshToken();
        if (!refreshToken) {
          throw new Error("No hay token de actualización disponible");
        }

        const { data } = await axios.post(
          refreshUrl,
          { refresh: refreshToken },
          { withCredentials: true }
        );

        tokenService.setAccessToken(data.access);
        isRefreshing = false;
        onRefreshed(data.access);

        // Reintentar la petición original
        config.headers.Authorization = `Bearer ${data.access}`;
        return axios.request(config);
      } catch (refreshError) {
        console.error("Error al actualizar el token:", refreshError);
        isRefreshing = false;
        onRefreshed(null);

        // Limpiar tokens
        tokenService.clearAllTokens();

        // No mostrar toast para errores de autenticación durante refresh
        // ya que redirigiremos automáticamente
        const shouldRedirect =
          !window.location.pathname.includes("/login") &&
          !window.location.pathname.includes("/register") &&
          !window.location.pathname.includes("/home");

        if (shouldRedirect) {
          toast.error("Tu sesión ha expirado. Redirigiendo al login...", {
            duration: 3000,
          });

          // Dar tiempo al toast antes de redirigir
          setTimeout(() => {
            window.location.href = "/login";
          }, 1000);
        }

        return Promise.reject(refreshError);
      }
    }

    // Manejar otros tipos de errores con el sistema global
    const shouldShowToast = !isRefreshing && response?.status !== 401;

    if (shouldShowToast) {
      // Determinar si mostrar toast basado en el tipo de error
      let showToast = true;
      let customMessage = null;

      switch (response?.status) {
        case 400:
          // Para errores de validación, mostrar mensaje específico
          customMessage = "Verifica que todos los campos estén correctos";
          break;
        case 403:
          customMessage = "No tienes permisos para realizar esta acción";
          break;
        case 404:
          customMessage = "El recurso solicitado no existe";
          break;
        case 429:
          customMessage = "Demasiadas peticiones. Inténtalo más tarde";
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          customMessage = "Error del servidor. Inténtalo más tarde";
          break;
        default:
          // Para errores de red o timeout
          if (!response) {
            if (error.code === "ECONNABORTED") {
              customMessage = "La petición tardó demasiado tiempo";
            } else {
              customMessage = "Error de conexión. Verifica tu internet";
            }
          }
          break;
      }

      handleError(error, {
        context: errorContext,
        showToast,
        customMessage,
        toastType: response?.status >= 500 ? "warning" : "error",
      });
    }

    // Para otros errores (que no sean 401), rechazar directamente
    return Promise.reject(error);
  }
);

/**
 * Wrapper para peticiones con manejo específico de errores
 */
export const apiRequest = {
  get: (url, options = {}) => {
    const { showErrorToast = true, errorMessage, ...axiosConfig } = options;
    return api.get(url, axiosConfig).catch((error) => {
      if (!showErrorToast) {
        // Si no queremos mostrar toast, manejamos el error silenciosamente
        console.error("API Error (silencioso):", error);
      }
      throw error;
    });
  },

  post: (url, data, options = {}) => {
    const { showErrorToast = true, errorMessage, ...axiosConfig } = options;
    return api.post(url, data, axiosConfig).catch((error) => {
      if (!showErrorToast) {
        console.error("API Error (silencioso):", error);
      }
      throw error;
    });
  },

  put: (url, data, options = {}) => {
    const { showErrorToast = true, errorMessage, ...axiosConfig } = options;
    return api.put(url, data, axiosConfig).catch((error) => {
      if (!showErrorToast) {
        console.error("API Error (silencioso):", error);
      }
      throw error;
    });
  },

  delete: (url, options = {}) => {
    const { showErrorToast = true, errorMessage, ...axiosConfig } = options;
    return api.delete(url, axiosConfig).catch((error) => {
      if (!showErrorToast) {
        console.error("API Error (silencioso):", error);
      }
      throw error;
    });
  },
};

export default api;
