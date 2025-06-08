/**
 * @fileoverview Componente de tarjeta de noticias con análisis de sentimiento
 * @module features/news/components/NewCard
 * @description Sistema de análisis con gestión de toasts y estados
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

  // Estados del componente
  const [analysis, setAnalysis] = useState(newItem.analysis || null);
  const [isLoading, setIsLoading] = useState(false);
  const [pollAttempts, setPollAttempts] = useState(0);

  // Referencias para cleanup
  const pollRef = useRef(null);
  const currentToastId = useRef(null);

  // Si prop.newItem.analysis cambia (por ejemplo al filtrar la lista), lo reflejamos
  useEffect(() => {
    setAnalysis(newItem.analysis || null);
  }, [newItem.analysis]);

  // Limpiar el intervalo al desmontar el componente
  useEffect(() => {
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
      if (currentToastId.current) {
        toastService.remove(currentToastId.current);
        currentToastId.current = null;
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

    // Limpiar recursos anteriores
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    if (currentToastId.current) {
      toastService.remove(currentToastId.current);
    }

    const loadingToastId = `analysis-${newItem.uuid}`;
    currentToastId.current = loadingToastId;

    toastService.loading("Encolando análisis…", { id: loadingToastId });

    try {
      await newsApi.triggerNewAnalisis(newItem.uuid);

      // Aquí está la corrección clave: usar el método update() corregido
      toastService.update(
        loadingToastId,
        "info",
        "Análisis encolado. Procesando…",
        {
          duration: 0,
          closeButton: false,
          showProgress: false,
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
            pollRef.current = null;
            setAnalysis(data.analysis);
            setIsLoading(false);
            setPollAttempts(0);

            toastService.update(
              loadingToastId,
              "success",
              "Análisis completado exitosamente",
              { duration: 3000, closeButton: true, showProgress: true }
            );

            // Limpiar la referencia después de que el toast desaparezca
            setTimeout(() => {
              currentToastId.current = null;
            }, 3500);

          } else if (attempts >= POLL_CONFIG.maxPollAttempts) {
            // Límite de intentos alcanzado
            clearInterval(pollRef.current);
            pollRef.current = null;
            setIsLoading(false);
            setPollAttempts(0);

            toastService.update(
              loadingToastId,
              "warning",
              "El análisis está tardando más de lo esperado. Verifica que el servicio Celery esté activo.",
              { duration: 5000, closeButton: true, showProgress: true }
            );

            setTimeout(() => {
              currentToastId.current = null;
            }, 5500);
          }
        } catch (error) {
          // Error al consultar el estado
          clearInterval(pollRef.current);
          pollRef.current = null;
          setIsLoading(false);
          setPollAttempts(0);

          toastService.update(
            loadingToastId,
            "error",
            "Error al obtener el resultado del análisis",
            { duration: 5000, closeButton: true, showProgress: true }
          );

          setTimeout(() => {
            currentToastId.current = null;
          }, 5500);
          
          if (import.meta.env.MODE === "development") {
            console.error("Error en polling de análisis:", error);
          }
        }
      }, POLL_CONFIG.pollInterval);

    } catch (error) {
      setIsLoading(false);
      
      toastService.update(
        loadingToastId,
        "error",
        "Error al encolar el análisis. Verifica tu conexión.",
        { duration: 5000, closeButton: true, showProgress: true }
      );

      setTimeout(() => {
        currentToastId.current = null;
      }, 5500);

      if (import.meta.env.MODE === "development") {
        console.error("Error inicial en análisis:", error);
      }
    }
  };

  return (
    <article className={styles["new__container"]}>
      <header className={styles["new__header"]}>
        <h2 className={styles["new__title"]}>{newItem.title}</h2>
        <Link
          className={styles["new__link"]}
          to={newItem.link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Abrir noticia: ${newItem.title}`}
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
          aria-describedby={
            isLoading && pollAttempts > 0
              ? `poll-status-${newItem.uuid}`
              : undefined
          }
        >
          {getAnalysisButtonText()}
        </button>

        {isLoading && pollAttempts > 0 && (
          <small
            id={`poll-status-${newItem.uuid}`}
            className={styles["new__poll-status"]}
            aria-live="polite"
          >
            Intento {pollAttempts}/{POLL_CONFIG.maxPollAttempts}
          </small>
        )}

        {analysis && (
          <div
            className={styles["new__analysis"]}
            aria-label="Resultado del análisis"
          >
            <span
              className={`${styles["new__analysis-label"]} ${getAnalysisClass(
                analysis.sentiment_label
              )}`}
              aria-label={`Sentimiento: ${analysis.sentiment_label}`}
            >
              {analysis.sentiment_label.toUpperCase()}
            </span>
            <small
              aria-label={`Puntuación: ${analysis.combined_score.toFixed(2)}`}
            >
              Puntuación: {analysis.combined_score.toFixed(2)}
            </small>
          </div>
        )}
      </footer>
    </article>
  );
}

NewCard.propTypes = newCardPropTypes;