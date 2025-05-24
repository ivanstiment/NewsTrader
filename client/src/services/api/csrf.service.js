import { api, ENDPOINTS } from "@/api";

export const csrfService = {
  /**
   * Obtener token CSRF del servidor
   * @returns {Promise}
   */
  getCsrfToken: () => api.get(ENDPOINTS.CSRF),
};

export default csrfService;
