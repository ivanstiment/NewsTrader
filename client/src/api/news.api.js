import api from "./axios";

export const getAllNews = () => api.get("/news/");

export const getNew = (uuid) => api.get(`/news/${uuid}/`);

export const createNew = (itemNew) => api.post("/", itemNew);

export const deleteNew = (uuid) => api.delete(`/${uuid}/`);

export const updateNew = (uuid, itemNew) => api.put(`/${uuid}/`, itemNew);
