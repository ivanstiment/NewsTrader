import { api, ENDPOINTS } from "@/api";
import { ExternalLinkIcon } from "@/shared/components/icons";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { newCardPropTypes } from "../../new-card.propTypes";
import styles from "./NewCard.module.scss";

export function NewCard({ newItem }) {
  const dateObj = new Date(newItem.provider_publish_time * 1000);
  const dateOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const readableDate = dateObj.toLocaleString("es-ES", dateOptions);

  const [analysis, setAnalysis] = useState(newItem.analysis || null);
  const [isLoading, setIsLoading] = useState(false);
  const pollRef = useRef(null);

  // Si prop.newItem.analysis cambia (por ejemplo al filtrar la lista), lo reflejamos
  useEffect(() => {
    setAnalysis(newItem.analysis || null);
  }, [newItem.analysis]);

  // Determina la clase CSS según etiqueta
  const getAnalysisClass = (label) => {
    switch (label) {
      case "positivo":
        return styles["new__analysis-label--positive"];
      case "negativo":
        return styles["new__analysis-label--negative"];
      default:
        return styles["new__analysis-label--neutral"];
    }
  };

  const getAnalysisButtonText = () => {
    if (isLoading) return "Analizando…";
    return analysis ? "Re-analizar" : "Analizar";
  };

  const handleAnalyze = async () => {
    if (isLoading) return;
    setIsLoading(true);
    toast.loading("Encolando análisis…", { id: newItem.uuid });

    try {
      await api.post(ENDPOINTS.NEWS.ANALYZE(newItem.uuid));
      toast.success("Análisis encolado", { id: newItem.uuid });

      // Polling: cada 2s consultamos hasta que analysis !== null
      pollRef.current = setInterval(async () => {
        try {
          const { data } = await api.get(ENDPOINTS.NEWS.DETAIL(newItem.uuid));
          if (data.analysis) {
            clearInterval(pollRef.current);
            setAnalysis(data.analysis);
            setIsLoading(false);
            toast.success("Análisis completado", { id: newItem.uuid });
          }
        } catch {
          clearInterval(pollRef.current);
          setIsLoading(false);
          toast.error("Error al obtener resultado", { id: newItem.uuid });
        }
      }, 2000);
    } catch {
      setIsLoading(false);
      toast.error("Error al encolar", { id: newItem.uuid });
    }
  };

  return (
    <article className={styles["new__container"]}>
      <header className={styles["new__header"]}>
        <h2 className={styles["new__title"]}>
          <Link to={`/news/${newItem.uuid}`}>{newItem.title}</Link>
        </h2>
        <Link
          className={styles["new__link"]}
          to={`${newItem.link}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLinkIcon
            width={40}
            height={34}
            className={styles["new__svg"]}
          />
        </Link>
      </header>

      <div className={styles["new__body"]}>
        <div className={styles["new__data"]}>
          <span className={styles["new__sub-title"]}>Fecha</span>
          <time className={styles["new__badge"]} dateTime={readableDate}>
            {readableDate}
          </time>
        </div>
        <div className={styles["new__data"]}>
          <span className={styles["new__sub-title"]}>Editor</span>
          <span className={styles["new__badge"]}>{newItem.publisher}</span>
        </div>
        <div className={styles["new__data"]}>
          <span className={styles["new__sub-title"]}>Tipo</span>
          <span className={styles["new__badge"]}>{newItem.news_type}</span>
        </div>
        {newItem.related_tickers && newItem.related_tickers.length > 0 && (
          <div className={styles["new__data"]}>
            <span className={styles["new__sub-title"]}>Related Tickers</span>
            <div className={styles["new__badges-container"]}>
              {newItem.related_tickers.map((ticker) => (
                <span key={ticker} className={styles["new__badge"]}>
                  {ticker}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      <footer className={styles["new__footer"]}>
        <button
          className={styles["new__analyze-button"]}
          onClick={handleAnalyze}
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {getAnalysisButtonText()}
        </button>
        {analysis && (
          <div className={styles["new__analysis"]}>
            <span
              className={`${styles["new__analysis-label"]} ${getAnalysisClass(
                analysis.sentiment_label
              )}`}
            >
              {analysis.sentiment_label.toUpperCase()}
            </span>
            <small>Puntuación: {analysis.combined_score.toFixed(2)}</small>
          </div>
        )}
      </footer>
    </article>
  );
}

NewCard.propTypes = newCardPropTypes;
