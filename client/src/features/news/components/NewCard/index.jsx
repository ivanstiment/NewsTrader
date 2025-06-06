/**
 * @fileoverview Componente de tarjeta de noticias con análisis de sentimiento
 * @module features/news/components/NewCard
 */

import { api, ENDPOINTS } from "@/api";
import { POLL_CONFIG } from "@/api/config";
import { toastService } from "@/services";
import { ExternalLinkIcon } from "@/shared/components/icons";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { newCardPropTypes } from "../../new-card.propTypes";
import { newsApi } from "../../news.api";
import styles from "./NewCard.module.scss";

/**
 * Componente que renderiza una tarjeta de noticia con análisis de sentimiento
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.newItem - Datos de la noticia
 * @returns {JSX.Element} Tarjeta de noticia renderizada
 *
 * @example
 * <NewCard newItem={newsData} />
 */
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
  const [pollAttempts, setPollAttempts] = useState(0);
  const pollRef = useRef(null);

  // Si prop.newItem.analysis cambia (por ejemplo al filtrar la lista), lo reflejamos
  useEffect(() => {
    setAnalysis(newItem.analysis || null);
  }, [newItem.analysis]);

  // Limpiar el intervalo al desmontar el componente
  useEffect(() => {
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
      }
    };
  }, []);

  /**
   * Determina la clase CSS según la etiqueta de sentimiento
   * @param {string} label - Etiqueta de sentimiento
   * @returns {string} Clase CSS correspondiente
   */
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

  /**
   * Obtiene el texto del botón según el estado
   * @returns {string} Texto del botón
   */
  const getAnalysisButtonText = () => {
    if (isLoading) return "Analizando…";
    return analysis ? "Re-analizar" : "Analizar";
  };

  /**
   * Maneja el proceso de análisis de la noticia
   * @async
   */
  const handleAnalyze = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setPollAttempts(0);

    const loadingToastId = `analysis-${newItem.uuid}`;
    toastService.loading("Encolando análisis…", { id: loadingToastId });

    try {
      await newsApi.triggerNewAnalisis(newItem.uuid);

      toastService.update(
        loadingToastId,
        "info",
        "Análisis encolado. Procesando…",
        {
          duration: 0,
          closeButton: false,
          showProgress: true,
        }
      );

      // Polling con límite de intentos
      let attempts = 0;
      pollRef.current = setInterval(async () => {
        attempts++;
        setPollAttempts(attempts);

        try {
          const { data } = await api.get(ENDPOINTS.NEWS.DETAIL(newItem.uuid));

          if (data.analysis) {
            // Análisis completado exitosamente
            clearInterval(pollRef.current);
            setAnalysis(data.analysis);
            setIsLoading(false);
            setPollAttempts(0);

            toastService.promise(
              loadingToastId,
              "success",
              "Análisis completado exitosamente",
              { duration: 3000 }
            );
          } else if (attempts >= POLL_CONFIG.maxPollAttempts) {
            // Límite de intentos alcanzado
            clearInterval(pollRef.current);
            setIsLoading(false);
            setPollAttempts(0);

            toastService.promise(
              loadingToastId,
              "warning",
              "El análisis está tardando más de lo esperado. Verifica que el servicio Celery esté activo."
            );
          }
        } catch (error) {
          // Error al consultar el estado
          clearInterval(pollRef.current);
          setIsLoading(false);
          setPollAttempts(0);

          toastService.promise(
            loadingToastId,
            "error",
            "Error al obtener el resultado del análisis"
          );
          
          if (import.meta.env.MODE === "development") {
            console.log(error);
          }
        }
      }, POLL_CONFIG.pollInterval);
    } catch (error) {
      setIsLoading(false);
      toastService.promise(
        loadingToastId,
        "error",
        "Error al encolar el análisis. Verifica tu conexión."
      );
      if (import.meta.env.MODE === "development") {
        console.log(error);
      }
    }
  };

  return (
    <article className={styles["new__container"]}>
      <header className={styles["new__header"]}>
        <h2 className={styles["new__title"]}>
          {/* <Link to={`/news/${newItem.uuid}`}>{newItem.title}</Link> */}
          {newItem.title}
        </h2>
        <h2 className={styles["new__title"]}>{newItem.title}</h2>
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

        {isLoading && pollAttempts > 0 && (
          <small className={styles["new__poll-status"]}>
            Intento {pollAttempts}/{POLL_CONFIG.maxPollAttempts}
          </small>
        )}

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
