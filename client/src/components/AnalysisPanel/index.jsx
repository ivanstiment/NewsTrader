import styles from "./AnalysisPanel.module.scss";

export function AnalysisPanel({ analysis }) {
  if (!analysis) return <p>Cargando análisis…</p>;
  return (
    <div className={styles.analysis}>
      <h3 className={styles["analysis__header"]}>Análisis de Sentimiento</h3>
      <div className={styles["analysis__row"]}>
        <span>Sentimiento:</span>
        <span
          className={styles[`analysis__label--${analysis.sentiment_label}`]}
        >
          {analysis.sentiment_label}
        </span>
      </div>
      <div className={styles["analysis__row"]}>
        <span>Puntaje combinado:</span>
        <span>{analysis.combined_score.toFixed(2)}</span>
      </div>
      <div className={styles["analysis__row"]}>
        <span>Relevancia:</span>
        <span>{analysis.relevance}</span>
      </div>
    </div>
  );
}
