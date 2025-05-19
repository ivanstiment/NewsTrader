import { useState } from "react";
import { useAnalysis, useArticles } from "@/hooks/useArticleAnalysis";
import styles from "./ArticlesList.module.scss";
import { AnalysisPanel } from "../AnalysisPanel";
import { ArticleCard } from "../ArticleCard";

export function ArticlesList() {
  const articles = useArticles();
  const [selectedId, setSelectedId] = useState(null);
  const analysis = useAnalysis(selectedId);

  return (
    <div className={styles["articles-list"]}>
      <aside className={styles["articles-list__sidebar"]}>
        {articles.map((art) => (
          <ArticleCard
            key={art.id}
            article={art}
            onSelect={setSelectedId}
            isActive={art.id === selectedId}
          />
        ))}
      </aside>
      <section className={styles["articles-list__detail"]}>
        {selectedId ? (
          <AnalysisPanel analysis={analysis} />
        ) : (
          <p className={styles["articles-list__placeholder"]}>
            Selecciona una noticia para ver su análisis
          </p>
        )}
      </section>
    </div>
  );
}
