import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { triggerAnalysis } from "../../articles.api";

export function ArticleAnalyze() {
  const { id } = useParams();
  const [status, setStatus] = useState("…");

  useEffect(() => {
    triggerAnalysis(`${id}`)
      .then(r => setStatus(r.data.status))
      .catch(() => setStatus("error"));
  }, [id]);

  return <div>Análisis: {status}</div>;
}