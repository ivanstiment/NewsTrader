import { handleError } from "@/utils/errorHandler";

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

export const getToastType = (statusCode) => {
  return statusCode >= 500 ? "warning" : "error";
};

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
