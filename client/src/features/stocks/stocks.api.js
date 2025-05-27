import { api, ENDPOINTS } from "@/api";

export const stocksApi = {
  /**
   * Obtener lista de stocks
   * @param {Object} params - Parámetros de búsqueda y paginación
   * @returns {Promise}
   */
  getStocks: (params = {}) => api.get(ENDPOINTS.STOCKS.LIST, { params }),

  /**
   * Buscar stocks
   * @param {string} query - Término de búsqueda
   * @returns {Promise}
   */
  searchStocks: (query) =>
    api.get(ENDPOINTS.STOCKS.SEARCH, { params: { q: query } }),

  /**
   * Obtener información de un stock específico
   * @param {string} symbol - Símbolo del stock
   * @returns {Promise}
   */
  getStockDetail: (symbol) => api.get(ENDPOINTS.STOCKS.DETAIL(symbol)),

  /**
   * Obtener datos históricos de precios
   * @param {string} symbol - Símbolo del stock
   * @param {Object} params - Parámetros adicionales (fechas, intervalo, etc.)
   * @returns {Promise}
   */
  getHistoricalData: (symbol, params = {}) =>
    api.get(ENDPOINTS.STOCKS.HISTORICAL(symbol), { params }),
};

export default stocksApi;
