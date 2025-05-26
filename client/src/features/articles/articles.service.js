import { api, ENDPOINTS } from "@/api";

export const articlesService = {
  /**
   * Obtener lista de artículos
   * @param {Object} params - Parámetros de búsqueda y paginación
   * @returns {Promise}
   */
  getArticles: (params = {}) => api.get(ENDPOINTS.ARTICLES.LIST, { params }),

  /**
   * Obtener detalle de un artículo
   * @param {number} id - ID del artículo
   * @returns {Promise}
   */
  getArticleDetail: (id) => api.get(ENDPOINTS.ARTICLES.DETAIL(id)),

  /**
   * Analizar artículo
   * @param {number} id - ID del artículo
   * @param {Object} analysisData - Datos para el análisis
   * @returns {Promise}
   */
  analyzeArticle: (id, analysisData = {}) =>
    api.post(ENDPOINTS.ARTICLES.ANALYZE(id), analysisData),
};

export default articlesService;
