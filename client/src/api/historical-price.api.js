import api from "./axios";

export const getHistoricalPrice = (symbol) => api.get(`/historical-price/${symbol}/`);
