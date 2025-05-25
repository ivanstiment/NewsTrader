// client/src/services/api/csrf.service.js
import { ENDPOINTS } from "@/api/config/endpoints";
import {
  createDelay,
  getCsrfTokenFromCookie,
  hasCsrfToken,
  isValidCsrfToken,
} from "@/utils/csrf.utils";

/**
 * Servicio para gestión de tokens CSRF
 * Maneja la comunicación con el backend y la lógica de negocio
 *
 * NOTA: Este servicio no importa directamente de @/api para evitar
 * dependencias circulares con los interceptors
 */
class CsrfService {
  constructor() {
    this.maxRetries = 3;
    this.retryDelay = 1000;
    this.apiClient = null; // Se inyectará después
  }

  /**
   * Inyectar cliente API para evitar dependencia circular
   * @param {Object} client - Cliente API (axios instance)
   */
  setApiClient(client) {
    this.apiClient = client;
  }

  /**
   * Realiza petición al endpoint de CSRF
   * @returns {Promise} Response del servidor
   */
  async requestCsrfToken() {
    if (!this.apiClient) {
      throw new Error(
        "API client no configurado. Llama a setApiClient() primero."
      );
    }

    // Usar directamente el cliente axios sin pasar por los interceptors
    return this.apiClient.get(ENDPOINTS.CSRF, {
      // Deshabilitar interceptors para esta petición específica
      skipCsrfInterceptor: true,
    });
  }

  /**
   * Obtiene token CSRF del servidor y lo retorna desde cookies
   * @returns {Promise<string|null>} Token CSRF o null
   */
  async fetchCsrfToken() {
    try {
      await this.requestCsrfToken();
      return getCsrfTokenFromCookie();
    } catch (error) {
      console.error("Error al obtener token CSRF del servidor:", error);
      throw error;
    }
  }

  /**
   * Obtiene token CSRF con estrategia de reintentos
   * @param {Object} options - Opciones de configuración
   * @param {number} options.maxRetries - Máximo número de reintentos
   * @param {number} options.delay - Delay entre reintentos
   * @returns {Promise<string|null>} Token CSRF o null
   */
  async getCsrfTokenWithRetry({
    maxRetries = this.maxRetries,
    delay = this.retryDelay,
  } = {}) {
    // Primero verificar si ya existe un token válido
    const existingToken = getCsrfTokenFromCookie();
    if (isValidCsrfToken(existingToken)) {
      return existingToken;
    }

    // Intentar obtener token con reintentos
    let lastError = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const token = await this.fetchCsrfToken();

        if (isValidCsrfToken(token)) {
          console.log(`Token CSRF obtenido en intento ${attempt + 1}`);
          return token;
        }

        throw new Error("Token CSRF inválido recibido del servidor");
      } catch (error) {
        lastError = error;
        console.warn(
          `Intento ${attempt + 1}/${maxRetries + 1} fallido:`,
          error.message
        );

        // Si no es el último intento, esperar antes del siguiente
        if (attempt < maxRetries) {
          await createDelay(delay);
        }
      }
    }

    console.error(
      `Falló la obtención del token CSRF después de ${maxRetries + 1} intentos`
    );
    throw lastError || new Error("No se pudo obtener el token CSRF");
  }

  /**
   * Refresca el token CSRF forzando una nueva petición
   * @returns {Promise<string|null>} Nuevo token CSRF
   */
  async refreshCsrfToken() {
    return this.fetchCsrfToken();
  }

  /**
   * Obtiene el token CSRF actual desde cookies
   * @returns {string|null} Token CSRF actual
   */
  getCurrentToken() {
    return getCsrfTokenFromCookie();
  }

  /**
   * Verifica si existe un token CSRF válido
   * @returns {boolean} true si hay token válido
   */
  hasValidToken() {
    return hasCsrfToken();
  }

  /**
   * Configurar opciones por defecto del servicio
   * @param {Object} options - Nuevas opciones
   */
  configure({ maxRetries, retryDelay } = {}) {
    if (typeof maxRetries === "number" && maxRetries >= 0) {
      this.maxRetries = maxRetries;
    }

    if (typeof retryDelay === "number" && retryDelay >= 0) {
      this.retryDelay = retryDelay;
    }
  }
}

// Instancia singleton del servicio
export const csrfService = new CsrfService();
export default csrfService;
