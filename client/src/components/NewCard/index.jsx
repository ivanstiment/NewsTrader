import { Link } from "react-router-dom";
import { newCardPropTypes } from "@/propTypes/newCard.propTypes";
import { ExternalLinkIcon } from "../Icons";
import styles from "./NewCard.module.scss";
import toast from "react-hot-toast";
import api from "@/api/axios";

export function NewCard({ newItem }) {
  const tsSeconds = newItem.provider_publish_time;
  const dateObj = new Date(tsSeconds * 1000);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const readableDate = dateObj.toLocaleString("es-ES", options);

  const handleAnalyze = () => {
    api
      .post(`/news/${newItem.uuid}/analyze/`)
      .then(() => toast.success("Análisis encolado"))
      .catch(() => toast.error("Error al encolar"));
  };

  const analysis = newItem.analysis;

  const setAnalysisClass = (sentimentLabel) => {
    if (sentimentLabel === "positive") {
      return styles["new__analysis-label--positive"];
    } else if (sentimentLabel === "negative") {
      return styles["new__analysis-label--negative"];
    } else {
      return styles["new__analysis-label--neutral"];
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
          <span className={styles["new__subTitle"]}>Fecha</span>
          <time className={styles["new__badge"]} dateTime={readableDate}>
            {readableDate}
          </time>
        </div>
        <div className={styles["new__data"]}>
          <span className={styles["new__subTitle"]}>Editor</span>
          <span className={styles["new__badge"]}>{newItem.publisher}</span>
        </div>
        <div className={styles["new__data"]}>
          <span className={styles["new__subTitle"]}>Tipo</span>
          <span className={styles["new__badge"]}>{newItem.news_type}</span>
        </div>
        {newItem.related_tickers && newItem.related_tickers.length > 0 && (
          <div className={styles["new__data"]}>
            <span className={styles["new__subTitle"]}>Related Tickers</span>
            <div className={styles["new__badgesContainer"]}>
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
          className={styles["new__analyzeButton"]}
          onClick={handleAnalyze}
        >
          {analysis ? "Re-analizar" : "Analizar"}
        </button>
        {analysis && (
          <div className={styles["new__analysis"]}>
            <span
              className={`${styles["new__analysis-label"]} ${setAnalysisClass(
                analysis.sentiment_label
              )}`}
            >
              {analysis.sentiment_label.toUpperCase()}
            </span>
            <small>Score: {analysis.combined_score.toFixed(2)}</small>
          </div>
        )}
      </footer>
    </article>
  );
}

NewCard.propTypes = newCardPropTypes;
