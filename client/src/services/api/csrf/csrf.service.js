// client/src/services/api/csrf/csrf.service.js
import { ENDPOINTS } from "@/api/config/endpoints";

// No importamos apiClient aquí para evitar dependencia circular
// Se inyectará desde el interceptor

let apiClientInstance = null;

export const csrfService = {
  // Método para inyectar el cliente API (llamado desde el interceptor)
  setApiClient(client) {
    apiClientInstance = client;
  },

  /**
   * Obtiene el token CSRF del servidor
   * Usa una configuración especial para evitar bucles infinitos
   */
  fetchCsrfToken: async () => {
    if (!apiClientInstance) {
      throw new Error("API client no inicializado");
    }

    try {
      const response = await apiClientInstance.get(ENDPOINTS.CONFIG.CSRF, {
        // Configuración especial para evitar interceptors
        skipCsrfCheck: true,  // Evita el request interceptor CSRF
        skipAuthCheck: true   // Evita verificación de auth
      });
      
      const token = response.data.csrfToken;
      if (!token) {
        throw new Error("CSRF token no recibido del servidor");
      }
      return token;
    } catch (error) {
      console.error("Error fetching CSRF token:", error);
      throw error;
    }
  }
};

export default csrfService;