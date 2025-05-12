import api from "./axios";

export const getAllStocks = () => api.get("/stocks/");

export const getStock = (symbol) => api.get(`/stock/${symbol}/`);



