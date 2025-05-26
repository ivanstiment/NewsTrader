import { API_CONFIG } from "@/api/config/defaults";

/**
 * Utilidades para manejo de tokens CSRF
 * Funciones puras sin efectos secundarios
 */

/**
 * Extrae el valor de una cookie por nombre
 * @param {string} name - Nombre de la cookie
 * @returns {string|null} Valor de la cookie o null
 */
export const getCookieValue = (name) => {
  console.log(`getCookieValue name: ${name}`)
  console.log(`!document.cookie ${!document.cookie}`)
  console.log(`document.cookie === "" ${document.cookie === ""}`)
  if (!document.cookie || document.cookie === "") {
    return null;
  }

  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const trimmedCookie = cookie.trim();
    const cookieStart = `${name}=`;

  console.log(`cookieStart: ${cookieStart}`)
  console.log(`decodeURIComponent(trimmedCookie.substring(cookieStart.length) ${decodeURIComponent(trimmedCookie.substring(cookieStart.length))}`)
    if (trimmedCookie.startsWith(cookieStart)) {
      return decodeURIComponent(trimmedCookie.substring(cookieStart.length));
    }
  }

  return null;
};

/**
 * Obtiene el token CSRF de las cookies
 * @returns {string|null} Token CSRF o null
 */
export const getCsrfTokenFromCookie = () => {
  console.log(`getCsrfTokenFromCookie API_CONFIG.csrf.cookieName ${API_CONFIG.csrf.cookieName}`)
  return getCookieValue(API_CONFIG.csrf.cookieName);
};

/**
 * Valida si un token CSRF es válido
 * @param {string|null} token - Token a validar
 * @returns {boolean} true si el token es válido
 */
export const isValidCsrfToken = (token) => {
  console.log(`es un token Valido? ${token}`);
  console.log(`token !== null ${token !== null}`);
  console.log(`typeof token === "string" ${typeof token === "string"}`);
  console.log(`token.trim() !== "" ${token?.trim() !== ""}`);
  return token !== null && typeof token === "string" && token.trim() !== "";
};

/**
 * Verifica si existe un token CSRF válido en cookies
 * @returns {boolean} true si existe un token válido
 */
export const hasCsrfToken = () => {
  const token = getCsrfTokenFromCookie();
  return isValidCsrfToken(token);
};

/**
 * Verifica si un método HTTP requiere token CSRF
 * @param {string} method - Método HTTP
 * @returns {boolean} true si requiere CSRF
 */
export const requiresCsrfToken = (method) => {
  if (!method || typeof method !== "string") {
    return false;
  }

  const methodsRequiringCsrf = ["post", "put", "patch", "delete"];
  return methodsRequiringCsrf.includes(method.toLowerCase());
};

/**
 * Crea headers CSRF para una petición
 * @param {string|null} token - Token CSRF
 * @returns {Object} Headers con token CSRF
 */
export const createCsrfHeaders = (token) => {
  if (!isValidCsrfToken(token)) {
    return {};
  }

  return {
    [API_CONFIG.csrf.headerName]: token,
  };
};

/**
 * Verifica si un error es relacionado con CSRF
 * @param {Object} error - Error de axios
 * @returns {boolean} true si es error CSRF
 */
export const isCsrfError = (error) => {
  return (
    error?.response?.status === 403 &&
    error?.response?.data?.detail?.includes?.("CSRF")
  );
};

/**
 * Genera mensaje de error para CSRF
 * @param {Object} error - Error de axios
 * @returns {string|null} Mensaje de error o null
 */
export const getCsrfErrorMessage = (error) => {
  if (isCsrfError(error)) {
    return "Error de seguridad. Por favor, recarga la página e inténtalo de nuevo.";
  }
  return null;
};

/**
 * Crea un delay para reintentos
 * @param {number} ms - Milisegundos a esperar
 * @returns {Promise} Promise que resuelve después del delay
 */
export const createDelay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
