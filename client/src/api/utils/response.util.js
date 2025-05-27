/**
 * Formatear respuesta de la API
 * @param {Object} response - Respuesta de axios
 * @returns {Object} Respuesta formateada
 */
export const formatApiResponse = (response) => {
  return {
    data: response.data,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Extraer datos de una respuesta paginada
 * @param {Object} response - Respuesta de la API
 * @returns {Object} Datos de paginación
 */
export const extractPaginationData = (response) => {
  const { data } = response;
  return {
    results: data.results || data,
    count: data.count || null,
    next: data.next || null,
    previous: data.previous || null,
    currentPage: data.current_page || 1,
    totalPages: data.total_pages || null,
  };
};

/**
 * Verificar si una respuesta contiene errores de validación
 * @param {Object} response - Respuesta de la API
 * @returns {boolean} true si hay errores de validación
 */
export const hasValidationErrors = (response) => {
  return response.status === 400 && response.data?.errors;
};

/**
 * Extraer errores de validación de una respuesta
 * @param {Object} response - Respuesta de la API
 * @returns {Object} Errores de validación formateados
 */
export const extractValidationErrors = (response) => {
  if (!hasValidationErrors(response)) {
    return {};
  }

  const errors = response.data.errors;
  const formattedErrors = {};

  Object.keys(errors).forEach((field) => {
    if (Array.isArray(errors[field])) {
      formattedErrors[field] = errors[field].join(", ");
    } else {
      formattedErrors[field] = errors[field];
    }
  });

  return formattedErrors;
};

/**
 * Verificar si una respuesta fue exitosa
 * @param {Object} response - Respuesta de la API
 * @returns {boolean} true si la respuesta fue exitosa
 */
export const isSuccessResponse = (response) => {
  return response.status >= 200 && response.status < 300;
};

/**
 * Transformar respuesta para un formulario
 * @param {Object} response - Respuesta de la API
 * @returns {Object} Datos transformados para formulario
 */
export const transformForForm = (response) => {
  const { data } = response;

  // Transformar campos de fecha
  if (data.created_at) {
    data.created_at = new Date(data.created_at).toISOString().split("T")[0];
  }
  if (data.updated_at) {
    data.updated_at = new Date(data.updated_at).toISOString().split("T")[0];
  }

  return data;
};

export default {
  formatApiResponse,
  extractPaginationData,
  hasValidationErrors,
  extractValidationErrors,
  isSuccessResponse,
  transformForForm,
};
