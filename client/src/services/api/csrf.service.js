import { api, ENDPOINTS } from "@/api";
import { API_CONFIG } from "@/api/config";

/**
 * Obtener el token CSRF de las cookies
 * @returns {string|null} El token CSRF o null si no existe
 */
export const getCsrfToken = () => {
  const cookieName = API_CONFIG.csrf.cookieName;
  let cookieValue = null;
  
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, cookieName.length + 1) === (cookieName + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(cookieName.length + 1));
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
  const token = getCsrfToken();
  return token !== null && token.trim() !== '';
};

export const csrfService = {
  /**
   * Obtener token CSRF del servidor
   * @returns {Promise} Response del servidor
   */
  getCsrfToken: () => api.get(ENDPOINTS.CSRF),

  /**
   * Obtener el token CSRF desde el backend
   * @returns {Promise<string|null>} El token CSRF o null en caso de error
   */
  fetchCsrfToken: async () => {
    try {
      await csrfService.getCsrfToken();
      return getCsrfToken();
    } catch (error) {
      console.error('Error al obtener token CSRF:', error);
      return null;
    }
  },

  /**
   * Obtener el token CSRF con reintentos automáticos
   * @param {number} maxRetries - Número máximo de reintentos
   * @param {number} delay - Retraso entre reintentos en ms
   * @returns {Promise<string|null>} El token CSRF o null si falla
   */
  getCsrfTokenWithRetry: async (maxRetries = 3, delay = 1000) => {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Primero verificar si ya existe en cookies
        let token = getCsrfToken();
        if (token) {
          return token;
        }

        // Si no existe, obtenerlo del servidor
        token = await csrfService.fetchCsrfToken();
        if (token) {
          return token;
        }

        // Si no es el último intento, esperar antes del siguiente
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } catch (error) {
        console.error(`Intento ${attempt + 1} fallido para obtener CSRF token:`, error);
        
        // Si no es el último intento, esperar antes del siguiente
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    console.error(`No se pudo obtener el token CSRF después de ${maxRetries + 1} intentos`);
    return null;
  },

  // Funciones utilitarias exportadas también como métodos del servicio
  getToken: getCsrfToken,
  hasToken: hasCsrfToken,
};

export default csrfService;