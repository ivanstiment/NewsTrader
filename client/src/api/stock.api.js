import api from "./axios";

export const getStock = (symbol) => api.get(`/stock/${symbol}/`);
