import { useState, useEffect } from "react";
import { articlesApi } from "./articles.api";

export function useArticles() {
  const [data, setData] = useState([]);
  useEffect(() => {
    articlesApi.getArticles().then((res) => setData(res.data));
  }, []);
  return data;
}

export function useAnalysis(articleId) {
  const [analysis, setAnalysis] = useState(null);
  useEffect(() => {
    if (!articleId) return;
    articlesApi.getAnalysis(articleId).then((res) => setAnalysis(res.data.analysis));
  }, [articleId]);
  return analysis;
}
