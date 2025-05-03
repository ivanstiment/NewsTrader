// import axios from "axios";
import api from "./axios";

// const newsApi = axios.create({
//   baseURL: "http://localhost:8000/news/new/news/",
//   withCredentials: true,
// });

// export const getAllNews = () => newsApi.get("/");
export const getAllNews = () => api.get("/news/new/news/");

export const getNew = (uuid) => api.get(`/${uuid}/`);

export const createNew = (itemNew) => api.post("/", itemNew);

export const deleteNew = (uuid) => api.delete(`/${uuid}/`);

export const updateNew = (uuid, itemNew) => api.put(`/${uuid}/`, itemNew);

// export const getNew = (uuid) => newsApi.get(`/${uuid}/`);

// export const createNew = (itemNew) => newsApi.post("/", itemNew);

// export const deleteNew = (uuid) => newsApi.delete(`/${uuid}/`);

// export const updateNew = (uuid, itemNew) => newsApi.put(`/${uuid}/`, itemNew);
