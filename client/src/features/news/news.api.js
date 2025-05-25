import { api, ENDPOINTS } from "@/api";

export const newsApi = {
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
  createNew: (newsData) => api.post(ENDPOINTS.NEWS.CREATE, newsData),

  /**
   * Obtener detalle de una noticia
   * @param {string} uuid - UUID de la noticia
   * @returns {Promise}
   */
  getNewDetail: (uuid) => api.get(ENDPOINTS.NEWS.DETAIL(uuid)),

  /**
   * Actualizar noticia
   * @param {string} uuid - UUID de la noticia
   * @param {Object} newsData - Datos actualizados
   * @returns {Promise}
   */
  updateNew: (uuid, newsData) => api.put(ENDPOINTS.NEWS.UPDATE(uuid), newsData),

  /**
   * Eliminar noticia
   * @param {string} uuid - UUID de la noticia
   * @returns {Promise}
   */
  deleteNew: (uuid) => api.delete(ENDPOINTS.NEWS.DELETE(uuid)),
};

export default newsApi;
