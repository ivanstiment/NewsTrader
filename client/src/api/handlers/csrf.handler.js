import { API_CONFIG } from "../config/defaults";

/**
 * Obtener el token CSRF de las cookies
 * @returns {string|null} El token CSRF o null si no existe
 */
export const getCsrfTokenFromCookie = () => {
  const cookieName = API_CONFIG.csrf.cookieName;
  let cookieValue = null;

  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, cookieName.length + 1) === cookieName + "=") {
        cookieValue = decodeURIComponent(
          cookie.substring(cookieName.length + 1)
        );
        break;
      }
    }
  }
  return cookieValue;
};

/**
 * Verificar si existe un token CSRF válido
 * @returns {boolean} true si existe un token válido
 */
export const hasCsrfToken = () => {
  const token = getCsrfTokenFromCookie();
  return token !== null && token.trim() !== "";
};

/**
 * Verificar si un método HTTP requiere token CSRF
 * @param {string} method - Método HTTP
 * @returns {boolean} true si requiere CSRF
 */
export const requiresCsrfToken = (method) => {
  const methodsRequiringCsrf = ["post", "put", "patch", "delete"];
  return methodsRequiringCsrf.includes(method.toLowerCase());
};

/**
 * Agregar el header CSRF a la configuración de la petición
 * @param {Object} config - Configuración de axios
 * @returns {Object} Configuración con header CSRF
 */
export const addCsrfHeader = (config) => {
  if (requiresCsrfToken(config.method)) {
    const csrfToken = getCsrfTokenFromCookie();
    if (csrfToken) {
      config.headers[API_CONFIG.csrf.headerName] = csrfToken;
    }
  }
  return config;
};

/**
 * Manejar errores relacionados con CSRF
 * @param {Object} error - Error de axios
 * @returns {boolean} true si es un error de CSRF
 */
export const isCsrfError = (error) => {
  return (
    error.response?.status === 403 &&
    error.response?.data?.detail?.includes("CSRF")
  );
};

/**
 * Generar mensaje de error para problemas de CSRF
 * @param {Object} error - Error de axios
 * @returns {string} Mensaje de error
 */
export const getCsrfErrorMessage = (error) => {
  if (isCsrfError(error)) {
    return "Error de seguridad. Por favor, recarga la página e inténtalo de nuevo.";
  }
  return null;
};

/**
 * Handler principal para errores de CSRF
 * @param {Object} error - Error de axios
 * @returns {Promise} Promise rechazada si es error de CSRF
 */
export const handleCsrfError = async (error) => {
  if (isCsrfError(error)) {
    console.error("Error CSRF:", error);

    // Agregar lógica adicional:
    // - Mostrar toast de error
    // - Refrescar el token CSRF
    // - Recargar la página

    const errorMessage = getCsrfErrorMessage(error);
    throw new Error(errorMessage);
  }

  return Promise.reject(error);
};

export default {
  getCsrfTokenFromCookie,
  hasCsrfToken,
  requiresCsrfToken,
  addCsrfHeader,
  isCsrfError,
  getCsrfErrorMessage,
  handleCsrfError,
};
