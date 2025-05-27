import { api, ENDPOINTS } from "@/api";

export const articlesApi = {
  /**
   * Obtener lista de articulos
   * @param {Object} params - Parámetros de búsqueda y paginación
   * @returns {Promise}
   */
  getArticles: (params = {}) => api.get(ENDPOINTS.ARTICLES.LIST, { params }),

  /**
   * Obtener detalle de un articulo
   * @param {string} uuid - UUID del articulo
   * @returns {Promise}
   */
  getAnalysis: (uuid) => api.get(ENDPOINTS.ARTICLES.DETAIL(uuid)),

  /**
   * Obtener detalle de un análisis
   * @param {string} uuid - UUID del articulo
   * @returns {Promise}
   */
  triggerAnalysis: (uuid) => api.post(`${ENDPOINTS.ARTICLES.DETAIL(uuid)}/analyze/`),

};

export default articlesApi;
