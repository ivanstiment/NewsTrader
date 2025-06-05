import toastService from "@/services/toast/toast.service";

const ERROR_MESSAGES = {
  400: "Verifica que todos los campos estén correctos",
  403: "No tienes permisos para realizar esta acción",
  404: "El recurso solicitado no existe",
  429: "Demasiadas peticiones. Inténtalo más tarde",
  500: "Error del servidor. Inténtalo más tarde",
  502: "Error del servidor. Inténtalo más tarde",
  503: "Error del servidor. Inténtalo más tarde",
  504: "Error del servidor. Inténtalo más tarde",
};

/**
 * Obtiene el mensaje de error apropiado según el código de respuesta
 * @param {Error} error - Objeto de error axios
 * @returns {string} Mensaje de error legible
 */
export const getErrorMessage = (error) => {
  const { response } = error;

  if (!response) {
    if (error.code === "ECONNABORTED") {
      return "La petición tardó demasiado tiempo";
    }
    return "Error de conexión. Verifica tu internet";
  }

  return ERROR_MESSAGES[response.status] || "Ha ocurrido un error inesperado";
};

/**
 * Determina si debe mostrar warning o error según el código de estado
 * @param {number} statusCode - Código de estado HTTP
 * @returns {'warning' | 'error'} Tipo de toast a mostrar
 */
export const getToastType = (statusCode) => {
  return statusCode >= 500 ? "warning" : "error";
};

/**
 * Maneja errores de API mostrando notificaciones apropiadas
 * @param {Error} error - Error de axios
 * @param {Object} context - Contexto adicional del error
 */
export const handleApiError = (error, context = {}) => {
  const errorContext = {
    url: error.config?.url,
    method: error.config?.method?.toUpperCase(),
    phase: "response",
    ...context,
  };

  const customMessage = getErrorMessage(error);
  const toastType = getToastType(error.response?.status);

  handleError(error, {
    context: errorContext,
    showToast: true,
    customMessage,
    toastType,
  });
};

/**
 * Tipos de errores comunes
 * @enum {string}
 */
export const ERROR_TYPES = {
  NETWORK: "NETWORK_ERROR",
  VALIDATION: "VALIDATION_ERROR",
  AUTHENTICATION: "AUTH_ERROR",
  AUTHORIZATION: "AUTHORIZATION_ERROR",
  NOT_FOUND: "NOT_FOUND_ERROR",
  SERVER: "SERVER_ERROR",
  TIMEOUT: "TIMEOUT_ERROR",
  UNKNOWN: "UNKNOWN_ERROR",
};

/**
 * Mensajes de error por defecto en español
 * @type {Object.<string, string>}
 */
const DEFAULT_ERROR_MESSAGES = {
  [ERROR_TYPES.NETWORK]: "Error de conexión. Verifica tu conexión a internet.",
  [ERROR_TYPES.VALIDATION]: "Los datos enviados no son válidos.",
  [ERROR_TYPES.AUTHENTICATION]:
    "Error de autenticación. Por favor, inicia sesión nuevamente.",
  [ERROR_TYPES.AUTHORIZATION]: "No tienes permisos para realizar esta acción.",
  [ERROR_TYPES.NOT_FOUND]: "El recurso solicitado no fue encontrado.",
  [ERROR_TYPES.SERVER]: "Error interno del servidor. Inténtalo más tarde.",
  [ERROR_TYPES.TIMEOUT]:
    "La solicitud tardó demasiado tiempo. Inténtalo nuevamente.",
  [ERROR_TYPES.UNKNOWN]: "Ha ocurrido un error inesperado.",
};

/**
 * Determina el tipo de error basado en el objeto de error
 * @param {Error} error - Objeto de error
 * @returns {string} Tipo de error del enum ERROR_TYPES
 */
export function getErrorType(error) {
  if (!error.response) {
    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      return ERROR_TYPES.TIMEOUT;
    }
    return ERROR_TYPES.NETWORK;
  }

  const status = error.response.status;

  switch (status) {
    case 400:
      return ERROR_TYPES.VALIDATION;
    case 401:
      return ERROR_TYPES.AUTHENTICATION;
    case 403:
      return ERROR_TYPES.AUTHORIZATION;
    case 404:
      return ERROR_TYPES.NOT_FOUND;
    case 500:
    case 502:
    case 503:
    case 504:
      return ERROR_TYPES.SERVER;
    default:
      return ERROR_TYPES.UNKNOWN;
  }
}

/**
 * Extrae el mensaje de error más específico posible
 * @param {Error} error - Objeto de error
 * @returns {string} Mensaje de error específico
 */
export function extractErrorMessage(error) {
  // Si el error tiene un mensaje específico del servidor
  if (error.response?.data) {
    const data = error.response.data;

    // Diferentes formatos de respuesta de error del servidor
    if (typeof data === "string") {
      return data;
    }

    if (data.detail) {
      return data.detail;
    }

    if (data.message) {
      return data.message;
    }

    if (data.error) {
      return data.error;
    }

    // Para errores de validación (Django REST Framework)
    if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
      return data.non_field_errors.join(", ");
    }

    // Para errores de campo específicos
    const fieldErrors = Object.keys(data)
      .filter((key) => Array.isArray(data[key]) && key !== "non_field_errors")
      .map((key) => `${key}: ${data[key].join(", ")}`);

    if (fieldErrors.length > 0) {
      return fieldErrors.join("; ");
    }
  }

  // Mensaje de error del cliente (axios/network)
  if (error.message) {
    return error.message;
  }

  // Mensaje por defecto basado en el tipo
  const errorType = getErrorType(error);
  return DEFAULT_ERROR_MESSAGES[errorType];
}

/**
 * Formatea información adicional del error para logging
 * @param {Error} error - Objeto de error
 * @param {Object} context - Contexto adicional
 * @returns {Object} Información formateada del error
 */
export function formatErrorInfo(error, context = {}) {
  const info = {
    timestamp: new Date().toISOString(),
    type: getErrorType(error),
    message: extractErrorMessage(error),
    context,
  };

  if (error.response) {
    info.response = {
      status: error.response.status,
      statusText: error.response.statusText,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
    };
  }

  if (error.request && !error.response) {
    info.request = {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      timeout: error.config?.timeout,
    };
  }

  return info;
}

/**
 * Maneja errores globalmente con notificaciones toast
 * @param {Error} error - Objeto de error
 * @param {Object} options - Opciones de manejo
 * @param {boolean} [options.showToast=true] - Si mostrar notificación toast
 * @param {'info'|'success'|'warning'|'error'} [options.toastType='error'] - Tipo de toast
 * @param {Object} [options.context={}] - Contexto adicional
 * @param {string} [options.customMessage=null] - Mensaje personalizado
 * @param {boolean} [options.logError=true] - Si loguear el error
 * @param {Function} [options.onError=null] - Callback personalizado
 * @returns {Object} Información del error formateada
 */
export function handleError(error, options = {}) {
  const {
    showToast = true,
    toastType = "error",
    context = {},
    customMessage = null,
    logError = true,
    onError = null,
  } = options;

  const errorInfo = formatErrorInfo(error, context);
  const message = customMessage || errorInfo.message;

  // Log del error para debugging
  if (logError) {
    console.error("Error handled:", errorInfo);
  }

  // Mostrar notificación toast usando nuestro nuevo servicio
  if (showToast) {
    const toastOptions = {
      duration: toastType === 'error' ? 5000 : 4000,
      position: 'top-right'
    };

    switch (toastType) {
      case "error":
        toastService.error(message, toastOptions);
        break;
      case "warning":
        toastService.warning(message, toastOptions);
        break;
      default:
        toastService.info(message, toastOptions);
    }
  }

  // Callback personalizado
  if (onError && typeof onError === "function") {
    onError(errorInfo);
  }

  return errorInfo;
}

/**
 * Hook personalizado para manejo de errores en componentes
 * @returns {Object} Funciones de manejo de errores
 * @example
 * const { handleError, handleAsyncError } = useErrorHandler();
 */
export function useErrorHandler() {
  /**
   * Maneja un error mostrando notificación
   * @param {Error} error - Error a manejar
   * @param {Object} options - Opciones de manejo
   */
  const handleErrorWithToast = (error, options = {}) => {
    return handleError(error, options);
  };

  /**
   * Wrapper para funciones asíncronas con manejo de errores
   * @param {Function} asyncFn - Función asíncrona a ejecutar
   * @param {Object} options - Opciones de manejo de errores
   * @returns {Promise} Resultado de la función o error
   */
  const handleAsyncError = async (asyncFn, options = {}) => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error, options);
      throw error; // Re-throw para que el componente pueda manejar el estado
    }
  };

  return { handleError: handleErrorWithToast, handleAsyncError };
}

/**
 * Wrapper para peticiones API con manejo automático de errores
 * @param {Function} apiFunction - Función de API a ejecutar
 * @param {Object} defaultOptions - Opciones por defecto para manejo de errores
 * @returns {Function} Función wrapped con manejo de errores
 */
export function withErrorHandling(apiFunction, defaultOptions = {}) {
  return async (...args) => {
    try {
      return await apiFunction(...args);
    } catch (error) {
      handleError(error, defaultOptions);
      throw error;
    }
  };
}