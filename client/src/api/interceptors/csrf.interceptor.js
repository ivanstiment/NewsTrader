// client/src/api/interceptors/csrf.interceptor.js
import {
  createCsrfHeaders,
  getCsrfErrorMessage,
  getCsrfTokenFromCookie,
  isCsrfError,
  requiresCsrfToken,
} from "@/utils/csrf.utils";

/**
 * Interceptor para manejo automático de tokens CSRF en axios
 * Se encarga de agregar headers y manejar errores relacionados con CSRF
 */

/**
 * Referencia lazy al servicio CSRF para evitar dependencia circular
 */
let _csrfService = null;

/**
 * Obtener servicio CSRF de forma lazy
 */
const getCsrfService = async () => {
  if (!_csrfService) {
    try {
      const { csrfService } = await import("@/services/api/csrf.service");
      _csrfService = csrfService;
    } catch (error) {
      console.error("Error importando CSRF service:", error);
    }
  }
  return _csrfService;
};

/**
 * Interceptor de peticiones para agregar token CSRF
 * @param {Object} config - Configuración de axios
 * @returns {Object} Configuración modificada
 */
export const csrfRequestInterceptor = (config) => {
  // Permitir skip del interceptor para peticiones específicas (como obtener el token CSRF)
  if (config.skipCsrfInterceptor) {
    return config;
  }

  // Solo agregar CSRF token si el método lo requiere
  if (!requiresCsrfToken(config.method)) {
    return config;
  }

  // Obtener token actual
  const csrfToken = getCsrfTokenFromCookie();

  if (csrfToken) {
    // Crear headers CSRF y agregarlos a la configuración
    const csrfHeaders = createCsrfHeaders(csrfToken);
    config.headers = {
      ...config.headers,
      ...csrfHeaders,
    };
  } else {
    console.warn(
      "Token CSRF no encontrado para petición:",
      config.method,
      config.url
    );
  }

  return config;
};

/**
 * Interceptor de errores de peticiones
 * @param {Object} error - Error de axios
 * @returns {Promise} Promise rechazada
 */
export const csrfRequestErrorInterceptor = (error) => {
  return Promise.reject(error);
};

/**
 * Interceptor de respuestas exitosas
 * @param {Object} response - Respuesta de axios
 * @returns {Object} Respuesta sin modificar
 */
export const csrfResponseInterceptor = (response) => {
  return response;
};

/**
 * Interceptor de errores de respuesta para manejo de errores CSRF
 * @param {Object} error - Error de axios
 * @returns {Promise} Promise rechazada con error procesado
 */
export const csrfResponseErrorInterceptor = async (error) => {
  if (isCsrfError(error)) {
    console.error("Error CSRF detectado:", error);

    // Obtener mensaje de error personalizado
    const errorMessage = getCsrfErrorMessage(error);

    // Crear nuevo error con mensaje más descriptivo
    const csrfError = new Error(errorMessage);
    csrfError.originalError = error;
    csrfError.type = "CSRF_ERROR";

    // Intentar refrescar el token automáticamente si es posible
    try {
      const csrfService = await getCsrfService();
      if (csrfService) {
        console.log("Intentando refrescar token CSRF automáticamente...");
        await csrfService.refreshCsrfToken();
      }
    } catch (refreshError) {
      console.error("Error intentando refrescar token CSRF:", refreshError);
    }

    return Promise.reject(csrfError);
  }

  return Promise.reject(error);
};

/**
 * Configurar interceptores CSRF en una instancia de axios
 * @param {Object} axiosInstance - Instancia de axios
 */
export const setupCsrfInterceptors = (axiosInstance) => {
  // Interceptor de peticiones
  axiosInstance.interceptors.request.use(
    csrfRequestInterceptor,
    csrfRequestErrorInterceptor
  );

  // Interceptor de respuestas
  axiosInstance.interceptors.response.use(
    csrfResponseInterceptor,
    csrfResponseErrorInterceptor
  );

  console.log("Interceptores CSRF configurados correctamente");
};

/**
 * Clase para manejo avanzado de errores CSRF
 */
export class CsrfErrorHandler {
  constructor() {
    this.listeners = [];
  }

  /**
   * Agregar listener para errores CSRF
   * @param {Function} callback - Función a ejecutar en caso de error CSRF
   */
  onCsrfError(callback) {
    if (typeof callback === "function") {
      this.listeners.push(callback);
    }
  }

  /**
   * Remover listener
   * @param {Function} callback - Función a remover
   */
  offCsrfError(callback) {
    this.listeners = this.listeners.filter((listener) => listener !== callback);
  }

  /**
   * Manejar error CSRF y notificar a listeners
   * @param {Object} error - Error CSRF
   */
  async handleCsrfError(error) {
    // Notificar a todos los listeners
    for (const listener of this.listeners) {
      try {
        await listener(error);
      } catch (listenerError) {
        console.error("Error en listener de CSRF:", listenerError);
      }
    }
  }
}

// Instancia global del manejador de errores CSRF
export const csrfErrorHandler = new CsrfErrorHandler();

export default {
  setupCsrfInterceptors,
  csrfRequestInterceptor,
  csrfResponseErrorInterceptor,
  csrfErrorHandler,
};
