import { useState, useEffect } from "react";
import { fetchArticles, fetchAnalysis } from "../../articles.api";

export function useArticles() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchArticles().then((res) => setData(res.data));
  }, []);
  return data;
}

export function useAnalysis(articleId) {
  const [analysis, setAnalysis] = useState(null);
  useEffect(() => {
    if (!articleId) return;
    fetchAnalysis(articleId).then((res) => setAnalysis(res.data.analysis));
  }, [articleId]);
  return analysis;
}
