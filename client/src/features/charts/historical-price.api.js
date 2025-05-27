import { api, ENDPOINTS } from "@/api";

export const historicalPriceApi = {
  /**
   * Obtener precio histórico
   * @param {String} symbol
   * @returns {Promise}
   */
  getHistoricalPrice: (symbol) => api.get(ENDPOINTS.STOCKS.HISTORICAL_PRICE(symbol))
};

export default historicalPriceApi;

