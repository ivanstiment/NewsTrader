import api from "@/api/axios";


export function fetchArticles() {
  return api.get("/articles/");
}

export function fetchAnalysis(articleId) {
  return api.get(`/articles/${articleId}/`);
}

export function triggerAnalysis(articleId) {
  return api.post(`/articles/${articleId}/analyze/`);
}