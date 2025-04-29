import axios from "axios";

const newsApi = axios.create({
  baseURL: "http://localhost:8000/news/new/news/",
});

export const getAllNews = () => newsApi.get("/");

export const getNew = (uuid) => newsApi.get(`/${uuid}/`);

export const createNew = (itemNew) => newsApi.post("/", itemNew);

export const deleteNew = (uuid) => newsApi.delete(`/${uuid}/`);

export const updateNew = (uuid, itemNew) => newsApi.put(`/${uuid}/`, itemNew);
