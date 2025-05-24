import { api, ENDPOINTS } from "@/api";

export const newsService = {
  /**
   * Obtener lista de noticias
   * @param {Object} params - Parámetros de búsqueda y paginación
   * @returns {Promise}
   */
  getNews: (params = {}) => api.get(ENDPOINTS.NEWS.LIST, { params }),

  /**
   * Crear nueva noticia
   * @param {Object} newsData - Datos de la noticia
   * @returns {Promise}
   */
  createNews: (newsData) => api.post(ENDPOINTS.NEWS.CREATE, newsData),

  /**
   * Obtener detalle de una noticia
   * @param {string} uuid - UUID de la noticia
   * @returns {Promise}
   */
  getNewsDetail: (uuid) => api.get(ENDPOINTS.NEWS.DETAIL(uuid)),

  /**
   * Actualizar noticia
   * @param {string} uuid - UUID de la noticia
   * @param {Object} newsData - Datos actualizados
   * @returns {Promise}
   */
  updateNews: (uuid, newsData) =>
    api.put(ENDPOINTS.NEWS.UPDATE(uuid), newsData),

  /**
   * Eliminar noticia
   * @param {string} uuid - UUID de la noticia
   * @returns {Promise}
   */
  deleteNews: (uuid) => api.delete(ENDPOINTS.NEWS.DELETE(uuid)),
};

export default newsService;
