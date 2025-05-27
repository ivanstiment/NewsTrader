import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { articlesApi } from "../../articles.api";

export function ArticleAnalyze() {
  const { id } = useParams();
  const [status, setStatus] = useState("…");

  useEffect(() => {
    articlesApi.triggerAnalysis(`${id}`)
      .then(r => setStatus(r.data.status))
      .catch(() => setStatus("error"));
  }, [id]);

  return <div>Análisis: {status}</div>;
}