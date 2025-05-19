// import axios from "axios";

// export const api = axios.create({
//   // baseURL: process.env.REACT_APP_API_URL,
//   baseURL: import.meta.env.VITE_API_URL,
//   withCredentials: true,
// });

import api from "./axios";


export function fetchArticles() {
  return api.get("/articles/");
}

export function fetchAnalysis(articleId) {
  return api.get(`/articles/${articleId}/`);
}

export function triggerAnalysis(articleId) {
  return api.post(`/articles/${articleId}/analyze/`);
}