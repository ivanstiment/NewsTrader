import api from "./axios";

export const getAllStocks = () => api.get("/stocks/stock/stocks/");

export const getStock = (symbol) => api.get(`/stock/${symbol}/`);

// export const getStock = (symbol) => api.get(`/stockinfo/${symbol}/`);
