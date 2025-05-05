import api from "./axios";

export const getAllNews = () => api.get("/news/new/news/");

export const getNew = (uuid) => api.get(`/${uuid}/`);

export const createNew = (itemNew) => api.post("/", itemNew);

export const deleteNew = (uuid) => api.delete(`/${uuid}/`);

export const updateNew = (uuid, itemNew) => api.put(`/${uuid}/`, itemNew);
