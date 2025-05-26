import api from "@/api/axios";

export const getHistoricalPrice = (symbol) => api.get(`/historical-price/${symbol}/`);
